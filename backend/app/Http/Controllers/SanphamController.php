<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sanpham;
use Illuminate\Auth\Events\Validated;
use Illuminate\Container\Attributes\Storage;

class SanphamController extends Controller
{
    //get
    public function get()
    {
        try {
            $sanpham = Sanpham::with(['images', 'danhMuc'])->get()->map(function ($item) {
                return [
                    'id' => $item->id,
                    'ten_san_pham' => $item->ten_san_pham,
                    'thuong_hieu' => $item->thuong_hieu,
                    'mo_ta' => $item->mo_ta,
                    'dung_tich' => $item->dung_tich,
                    'gia' => (float) $item->gia,
                    'gia_format' => number_format($item->gia, 0, ',', '.') . ' ₫',
                    'so_luong_ton' => $item->so_luong_ton,
                    'hinh_anh' => $item->hinh_anh, // Ảnh chính nếu có
                    'images' => $item->images->map(fn($img) => $img->image_path), // mảng ảnh phụ
                    'danh_muc_id' => $item->danh_muc_id,
                    'danh_muc_ten' => $item->danhMuc ? $item->danhMuc->ten_danh_muc : null,
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
    // tim san pham theo ma
    public function getOne($id)
    {
        // Lấy sản phẩm cùng với quan hệ ảnh phụ
        $product = Sanpham::with('images')->find($id);

        if (!$product) {
            return response()->json(['message' => 'Không tìm thấy sản phẩm'], 404);
        }



        return response()->json([
            'status' => true,
            'message' => 'Lấy sản phẩm thành công',
            'data' => [
                ...$product->toArray(),

            ]
        ]);
    }



    //them san pham
    public function add(Request $request)
    {
        try {
            $request->validate([
                'ten_san_pham' => 'required|string|max:255',
                'thuong_hieu' => 'required|string|max:100',
                'mo_ta' => 'nullable|string',
                'dung_tich' => 'required|string|max:255',
                'gia' => 'required|numeric',
                'so_luong_ton' => 'required|integer',
                'danh_muc_id' => 'nullable|exists:danhmuc,id',
                'hinh_anh' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                'hinh_phu.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048', // validate array các ảnh phụ
            ]);

            $sanpham = new Sanpham();
            $sanpham->ten_san_pham = $request->ten_san_pham;
            $sanpham->thuong_hieu = $request->thuong_hieu;
            $sanpham->mo_ta = $request->mo_ta;
            $sanpham->dung_tich = $request->dung_tich;
            $sanpham->gia = $request->gia;
            $sanpham->so_luong_ton = $request->so_luong_ton;
            $sanpham->danh_muc_id = $request->danh_muc_id;

            // Xử lý upload hình ảnh chính nếu có
            if ($request->hasFile('hinh_anh')) {
                $file = $request->file('hinh_anh');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('images', $filename, 'public');
                $sanpham->hinh_anh = $path;
            }

            $sanpham->save();

            // Xử lý upload nhiều ảnh phụ (nếu có)
            if ($request->hasFile('hinh_phu')) {
                foreach ($request->file('hinh_phu') as $file) {
                    $filename = time() . '_' . $file->getClientOriginalName();
                    $path = $file->storeAs('images', $filename, 'public');

                    // Lưu vào bảng sanpham_images
                    $sanpham->images()->create([
                        'image_path' => $path,
                    ]);
                }
            }

            return response()->json([
                'message' => 'Thêm sản phẩm thành công',
                'data' => $sanpham->load('images') // load quan hệ images để trả về luôn
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi thêm sản phẩm',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // public function add(Request $request)
    // {
    //     try {
    //         $request->validate([
    //             'ten_san_pham' => 'required|string|max:255',
    //             'thuong_hieu' => 'required|string|max:100',
    //             'mo_ta' => 'nullable|string',
    //             'dung_tich' => 'required|string|max:255',
    //             'gia' => 'required|numeric',
    //             'so_luong_ton' => 'required|integer',
    //             'danh_muc_id' => 'nullable|exists:danhmuc,id',
    //             'hinh_anh' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
    //         ]);

    //         $sanpham = new Sanpham();
    //         $sanpham->ten_san_pham = $request->ten_san_pham;
    //         $sanpham->thuong_hieu = $request->thuong_hieu;
    //         $sanpham->mo_ta = $request->mo_ta;
    //         $sanpham->dung_tich = $request->dung_tich;
    //         $sanpham->gia = $request->gia;
    //         $sanpham->so_luong_ton = $request->so_luong_ton;
    //         $sanpham->danh_muc_id = $request->danh_muc_id;

    //         // Xử lý upload hình ảnh nếu có
    //         if ($request->hasFile('hinh_anh')) {
    //             $file = $request->file('hinh_anh');
    //             $filename = time() . '_' . $file->getClientOriginalName();
    //             $path = $file->storeAs('images', $filename, 'public');
    //             $sanpham->hinh_anh = $path;
    //         }

    //         $sanpham->save();

    //         return response()->json([
    //             'message' => 'Thêm sản phẩm thành công',
    //             'data' => $sanpham
    //         ], 201);

    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'message' => 'Đã xảy ra lỗi khi thêm sản phẩm',
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }

    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'ten_san_pham' => 'required|string|max:255',
                'thuong_hieu' => 'required|string|max:100',
                'mo_ta' => 'nullable|string',
                'dung_tich' => 'required|string|max:255',
                'gia' => 'required|numeric',
                'so_luong_ton' => 'required|integer',
                'danh_muc_id' => 'nullable|exists:danhmuc,id',
                'hinh_anh' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            ]);

            $sanpham = Sanpham::findOrFail($id);

            $sanpham->ten_san_pham = $request->ten_san_pham;
            $sanpham->thuong_hieu = $request->thuong_hieu;
            $sanpham->mo_ta = $request->mo_ta;
            $sanpham->dung_tich = $request->dung_tich;
            $sanpham->gia = $request->gia;
            $sanpham->so_luong_ton = $request->so_luong_ton;
            $sanpham->danh_muc_id = $request->danh_muc_id;

            if ($request->hasFile('hinh_anh')) {
                $file = $request->file('hinh_anh');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('images', $filename, 'public');
                $sanpham->hinh_anh = $path;
            }

            $sanpham->save();
            $sanpham->refresh();

            return response()->json([
                'message' => 'Cập nhật sản phẩm thành công',
                'data' => $sanpham
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi cập nhật sản phẩm',
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

            // Xoá ảnh nếu có
            /* if ($sanpham->hinh_anh && Storage::disk('public')->exists($sanpham->hinh_anh)) {
                 Storage::disk('public')->delete($sanpham->hinh_anh);
             }
             */
            $sanpham->delete();

            return response()->json(['message' => 'Xoá sản phẩm thành công'], 200);
        } catch (\Exception $e) {
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