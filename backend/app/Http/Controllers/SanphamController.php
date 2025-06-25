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
            $request->validate([
                'ten_san_pham' => 'required|string|max:255',
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
            ]);

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
                'ten_san_pham' => 'required|string|max:255',
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
            ]);

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


}