<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sanpham;
use Illuminate\Auth\Events\Validated;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SanphamController extends Controller
{
    //get
    public function get()
    {
        try {
            $sanpham = Sanpham::with(['images', 'danhMuc', 'variants'])->get()->map(function ($item) {
                return [
                    'id' => $item->id,
                    'ten_san_pham' => $item->ten_san_pham,
                    'thuong_hieu' => $item->thuong_hieu,
                    'xuat_xu' => $item->xuat_xu,
                    'phong_cach' => $item->phong_cach,
                    'nam_phat_hanh' => $item->nam_phat_hanh,
                    'do_luu_huong' => $item->do_luu_huong,
                    'do_toa_huong' => $item->do_toa_huong,
                    'mo_ta' => $item->mo_ta,
                    'hinh_anh' => $item->hinh_anh,
                    'images' => $item->images->pluck('image_path'),
                    'danh_muc_id' => $item->danh_muc_id,
                    'danh_muc_ten' => $item->danhMuc?->ten_danh_muc,
                    'variants' => $item->variants->map(function ($v) {
                        return [
                            'id' => $v->id,
                            'dung_tich' => $v->dung_tich,
                            'gia' => (float) $v->gia,
                            'gia_format' => number_format($v->gia, 0, ',', '.') . ' ₫',
                            'so_luong_ton' => $v->so_luong_ton,
                        ];
                    }),
                    'created_at' => $item->created_at,
                    'updated_at' => $item->updated_at,
                ];
            });

            return response()->json([
                'status' => true,
                'message' => 'Lấy danh sách sản phẩm thành công',
                'data' => $sanpham
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getOne($id)
    {
        $product = Sanpham::with(['images', 'variants', 'danhMuc'])->find($id);

        if (!$product) {
            return response()->json(['message' => 'Không tìm thấy sản phẩm'], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Lấy sản phẩm thành công',
            'data' => [
                'id' => $product->id,
                'ten_san_pham' => $product->ten_san_pham,
                'thuong_hieu' => $product->thuong_hieu,
                'xuat_xu' => $product->xuat_xu,
                'phong_cach' => $product->phong_cach,
                'nam_phat_hanh' => $product->nam_phat_hanh,
                'do_luu_huong' => $product->do_luu_huong,
                'do_toa_huong' => $product->do_toa_huong,
                'mo_ta' => $product->mo_ta,
                'hinh_anh' => $product->hinh_anh,
                'images' => $product->images,
                'danh_muc_id' => $product->danh_muc_id,
                'danh_muc_ten' => $product->danhMuc?->ten_danh_muc,
                'variants' => $product->variants,
                'created_at' => $product->created_at,
                'updated_at' => $product->updated_at,
            ]
        ]);
    }

    public function add(Request $request)
    {
        try {
            $request->validate(
                [
                    'ten_san_pham' => 'required|string|max:255|unique:sanpham,ten_san_pham',
                    'thuong_hieu' => 'required|string|max:100',
                    'xuat_xu' => 'nullable|string|max:255',
                    'phong_cach' => 'nullable|string|max:255',
                    'nam_phat_hanh' => 'nullable|integer|min:1900|max:' . date('Y'),
                    'do_luu_huong' => 'nullable|string|max:255',
                    'do_toa_huong' => 'nullable|string|max:255',
                    'mo_ta' => 'nullable|string',
                    'danh_muc_id' => 'nullable|exists:danhmuc,id',

                    'variants' => 'required|array|min:1',
                    'variants.*.dung_tich' => 'required|string|max:255',
                    'variants.*.gia' => 'required|numeric',
                    'variants.*.so_luong_ton' => 'required|integer',

                    'hinh_anh' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                    'hinh_phu.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                ],
                [
                    // Thông báo lỗi tùy chỉnh
                    'ten_san_pham.required' => 'Tên sản phẩm không được đer trống.',
                    'ten_san_pham.string' => 'Tên sản phẩm phải là chuỗi.',
                    'ten_san_pham.unique' => 'Tên sản phẩm đã tồn tại.',
                    'ten_san_pham.max' => 'Tên sản phẩm không được vượt quá 255 ký tự.',

                    'thuong_hieu.required' => 'Thương hiệu không được để trống.',
                    'thuong_hieu.string' => 'Thương hiệu phải là chuỗi.',
                    'thuong_hieu.max' => 'Thương hiệu không được vượt quá 100 ký tự.',

                    'xuat_xu.string' => 'Xuất xứ phải là chuỗi.',
                    'xuat_xu.max' => 'Xuất xứ không được vượt quá 255 ký tự.',

                    'phong_cach.string' => 'Phong cách phải là chuỗi.',
                    'phong_cach.max' => 'Phong cách không được vượt quá 255 ký tự.',

                    'nam_phat_hanh.integer' => 'Năm phát hành phải là số nguyên.',
                    'nam_phat_hanh.min' => 'Năm phát hành không được nhỏ hơn 1900.',
                    'nam_phat_hanh.max' => 'Năm phát hành không được lớn hơn năm hiện tại.',

                    'do_luu_huong.string' => 'Độ lưu hương phải là chuỗi.',
                    'do_luu_huong.max' => 'Độ lưu hương không được vượt quá 255 ký tự.',

                    'do_toa_huong.string' => 'Độ toả hương phải là chuỗi.',
                    'do_toa_huong.max' => 'Độ toả hương không được vượt quá 255 ký tự.',

                    'mo_ta.string' => 'Mô tả phải là chuỗi.',

                    'danh_muc_id.exists' => 'Danh mục đã chọn không tồn tại.',

                    'variants.required' => 'Phải có ít nhất một biến thể sản phẩm.',
                    'variants.array' => 'Biến thể phải là mảng.',
                    'variants.min' => 'Phải có ít nhất một biến thể sản phẩm.',
                    'variants.*.dung_tich.required' => 'Dung tích của biến thể không được để trống.',
                    'variants.*.dung_tich.string' => 'Dung tích của biến thể phải là chuỗi.',
                    'variants.*.dung_tich.max' => 'Dung tích của biến thể không được vượt quá 255 ký tự.',
                    'variants.*.gia.required' => 'Giá của biến thể không được để trống.',
                    'variants.*.gia.numeric' => 'Giá của biến thể phải là số.',
                    'variants.*.so_luong_ton.required' => 'Số lượng tồn của biến thể không được để trống.',
                    'variants.*.so_luong_ton.integer' => 'Số lượng tồn của biến thể phải là số nguyên.',
                    'hinh_anh.image' => 'Hình ảnh đại diện phải là định dạng ảnh.',
                    'hinh_anh.mimes' => 'Hình ảnh đại diện chỉ cho phép các định dạng: jpeg, png, jpg, gif, svg.',
                    'hinh_anh.max' => 'Kích thước ảnh đại diện không được vượt quá 2MB.',
                    'hinh_phu.*.image' => 'Mỗi hình ảnh phụ phải là một ảnh hợp lệ.',
                    'hinh_phu.*.mimes' => 'Ảnh phụ chỉ cho phép các định dạng: jpeg, png, jpg, gif, svg.',
                    'hinh_phu.*.max' => 'Kích thước mỗi ảnh phụ không được vượt quá 2MB.',
                ]
            );
            $dungTichList = array_map(fn($v) => trim(strtolower($v['dung_tich'])), $request->variants);
            if (count($dungTichList) !== count(array_unique($dungTichList))) {
                return response()->json([
                    'message' => 'Các biến thể có dung tích bị trùng lặp. Mỗi dung tích phải là duy nhất.'
                ], 422);
            }

            $sanpham = new Sanpham($request->only([
                'ten_san_pham',
                'thuong_hieu',
                'xuat_xu',
                'phong_cach',
                'nam_phat_hanh',
                'do_luu_huong',
                'do_toa_huong',
                'mo_ta',
                'danh_muc_id'
            ]));

            if ($request->hasFile('hinh_anh')) {
                $file = $request->file('hinh_anh');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('images', $filename, 'public');
                $sanpham->hinh_anh = $path;
            }

            $sanpham->save();

            foreach ($request->variants as $variant) {
                $sanpham->variants()->create($variant);
            }

            if ($request->hasFile('hinh_phu')) {
                foreach ($request->file('hinh_phu') as $file) {
                    $filename = time() . '_' . $file->getClientOriginalName();
                    $path = $file->storeAs('images', $filename, 'public');
                    $sanpham->images()->create(['image_path' => $path]);
                }
            }

            return response()->json([
                'message' => 'Thêm sản phẩm thành công',
                'data' => $sanpham->load(['images', 'variants'])
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi thêm sản phẩm',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'ten_san_pham' => 'required|string|max:255|unique:sanpham,ten_san_pham,' . $id,
                'thuong_hieu' => 'required|string|max:100',
                'xuat_xu' => 'nullable|string|max:255',
                'phong_cach' => 'nullable|string|max:255',
                'nam_phat_hanh' => 'nullable|string|max:255',
                'do_luu_huong' => 'nullable|string|max:255',
                'do_toa_huong' => 'nullable|string|max:255',
                'mo_ta' => 'nullable|string',
                'danh_muc_id' => 'nullable|exists:danhmuc,id',
                'variants' => 'required|array|min:1',
                'variants.*.dung_tich' => 'required|string|max:255',
                'variants.*.gia' => 'required|numeric',
                'variants.*.so_luong_ton' => 'required|integer',
                'hinh_anh' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                'hinh_phu.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                'images_phu_deleted' => 'nullable|string',
            ], [
                'ten_san_pham.unique' => 'Tên sản phẩm đã tồn tại.',
            ]);
            $dungTichList = array_map(fn($v) => trim(strtolower($v['dung_tich'])), $request->variants);
            if (count($dungTichList) !== count(array_unique($dungTichList))) {
                return response()->json([
                    'message' => 'Các biến thể có dung tích bị trùng lặp. Mỗi dung tích phải là duy nhất.'
                ], 422);
            }

            $sanpham = Sanpham::findOrFail($id);
            $sanpham->fill($request->only([
                'ten_san_pham',
                'thuong_hieu',
                'xuat_xu',
                'phong_cach',
                'nam_phat_hanh',
                'do_luu_huong',
                'do_toa_huong',
                'mo_ta',
                'danh_muc_id'
            ]));

            if ($request->hasFile('hinh_anh')) {
                $file = $request->file('hinh_anh');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('images', $filename, 'public');
                $sanpham->hinh_anh = $path;
            }

            $sanpham->save();

            $sanpham->variants()->delete();
            foreach ($request->variants as $variant) {
                $sanpham->variants()->create($variant);
            }

            if ($request->filled('images_phu_deleted')) {
                $deletedIds = json_decode($request->images_phu_deleted, true);
                if (is_array($deletedIds) && count($deletedIds) > 0) {
                    $imagesToDelete = $sanpham->images()->whereIn('id', $deletedIds)->get();

                    foreach ($imagesToDelete as $img) {
                        // Xóa file ảnh trong storage
                        if ($img->image_path && \Illuminate\Support\Facades\Storage::disk('public')->exists($img->image_path)) {
                            \Illuminate\Support\Facades\Storage::disk('public')->delete($img->image_path);
                        }

                        $img->delete();
                    }
                }
            }

            if ($request->hasFile('hinh_phu')) {
                foreach ($request->file('hinh_phu') as $file) {
                    $filename = time() . '_' . $file->getClientOriginalName();
                    $path = $file->storeAs('images', $filename, 'public');
                    $sanpham->images()->create(['image_path' => $path]);
                }
            }

            return response()->json([
                'message' => 'Cập nhật sản phẩm thành công',
                'data' => $sanpham->load(['images', 'variants'])
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi cập nhật sản phẩm',
                'error' => $e->getMessage()
            ], 500);
        }
    }




    // xoa san pham
    public function delete($id)
    {
        try {
            $sanpham = Sanpham::find($id);

            if (!$sanpham) {
                return response()->json(['message' => 'Không tìm thấy sản phẩm'], 404);
            }


            $sanpham->delete();

            return response()->json(['message' => 'Xoá sản phẩm thành công'], 200);
        } catch (\Exception $e) {
            if ($e->getCode() == '23000') {
                // 23000 = SQLSTATE ràng buộc khóa ngoại
                return response()->json([
                    'message' => 'Không thể xoá sản phẩm vì có ràng buộc dữ liệu đã tồn tại',
                    'error' => $e->getMessage()
                ], 409); // Conflict
            }
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi xoá sản phẩm',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    // lọc theo danh mục
    public function getByDanhmuc($id)
    {
        $sanpham = Sanpham::where('danh_muc_id', $id)->get();

        if ($sanpham->isEmpty()) {
            return response()->json(['message' => 'Không có sản phẩm nào trong danh mục này'], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Lấy danh sách san pham theo danh muc thành công',
            'data' => $sanpham
        ], 200);
    }

    public function getByThuongHieu(Request $request)
    {
        $thuongHieu = $request->query('thuong_hieu');
        $excludeId = $request->query('exclude_id');

        if (!$thuongHieu) {
            return response()->json([
                'message' => 'Thiếu tham số thương hiệu.'
            ], 400);
        }

        $query = \App\Models\Sanpham::where('thuong_hieu', $thuongHieu);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        $sanPhams = $query->with('variants') // nếu bạn dùng quan hệ biến thể
            ->orderBy('id', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'data' => $sanPhams
        ]);
    }


}