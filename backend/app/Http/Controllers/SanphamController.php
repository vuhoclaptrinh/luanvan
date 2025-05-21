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
        // Lấy toàn bộ sản phẩm
        try {
            $sanpham = Sanpham::all();

            return response()->json([
                'status' => true,
                'message' => 'Lấy danh sách san pham thành công',
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
        $productone = Sanpham::find($id);

        if (!$productone) {
            return response()->json(['message' => 'Không tìm thấy sản phẩm'], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Lấy sản phẩm thành công',
            'data' => $productone
        ]);
    }


    //them san pham
    // public function add(Request $request)
    // {
    //     try {
    //         //  Validate dữ liệu
    //         $request->validate([
    //             'ten_san_pham' => 'required|string|max:255',
    //             'thuong_hieu' => 'required|string|max:100',
    //             'mo_ta' => 'nullable|string',
    //             'dung_tich' => 'required|string|max:255',
    //             'gia' => 'required|numeric',
    //             'so_luong_ton' => 'required|integer',
    //             //'danh_muc_id' => 'required|integer|exists:danh_mucs,id',
    //             'danh_muc_id' => '',
    //             'hinh_anh' => '',
    //         ]);

    //         //  Khởi tạo sản phẩm mới
    //         $sanpham = new Sanpham();
    //         $sanpham->ten_san_pham = $request->ten_san_pham;
    //         $sanpham->thuong_hieu = $request->thuong_hieu;
    //         $sanpham->mo_ta = $request->mo_ta;
    //         $sanpham->dung_tich = $request->dung_tich;
    //         $sanpham->gia = $request->gia;
    //         $sanpham->so_luong_ton = $request->so_luong_ton;
    //         $sanpham->danh_muc_id = $request->danh_muc_id;

    //         //  Xử lý ảnh nếu có
    //         if ($request->hasFile('hinh_anh')) {
    //             $file = $request->file('hinh_anh');
    //             $filename = time() . '_' . $file->getClientOriginalName();
    //             $path = $file->storeAs('uploads', $filename, 'public');
    //             $sanpham->hinh_anh = $path;
    //         }

    //         $sanpham->save();

    //         return response()->json(['message' => 'Thêm sản phẩm thành công', 'data' => $sanpham], 201);

    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'message' => 'Đã xảy ra lỗi khi thêm sản phẩm',
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }
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
            ]);

            $sanpham = new Sanpham();
            $sanpham->ten_san_pham = $request->ten_san_pham;
            $sanpham->thuong_hieu = $request->thuong_hieu;
            $sanpham->mo_ta = $request->mo_ta;
            $sanpham->dung_tich = $request->dung_tich;
            $sanpham->gia = $request->gia;
            $sanpham->so_luong_ton = $request->so_luong_ton;
            $sanpham->danh_muc_id = $request->danh_muc_id;

            // Xử lý upload hình ảnh nếu có
            if ($request->hasFile('hinh_anh')) {
                $file = $request->file('hinh_anh');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('images', $filename, 'public');
                $sanpham->hinh_anh = $path;
            }

            $sanpham->save();

            return response()->json([
                'message' => 'Thêm sản phẩm thành công',
                'data' => $sanpham
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi thêm sản phẩm',
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