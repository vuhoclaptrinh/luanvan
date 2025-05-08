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

        return response()->json($productone);
    }
    // hàm sửa sản phẩm
    public function update(Request $request, $id)
    {
        //kiem tra du liệu
        $request->validate([
            'ten_san_pham' => 'required|string|max:255',
            'thuong_hieu' => 'required|string|max:255',
            'mo_ta' => 'nullable|string',
            'dung_tich' => 'required|numeric',
            'gia' => 'required|numeric',
            'so_luong_ton' => 'required|integer',
            'hinh_anh' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'danh_muc_id' => 'required|exists:categories,id',  // Giả sử bạn có bảng danh mục với model Category
        ]);
        //tim sanpham
        $sanpham = Sanpham::find($id);
        if (!$sanpham) {
            return response()->json(['message' => 'khong tim thay san pham'], 404);
        }
        $sanpham->update([
            'ten_san_pham' => $request->input('ten_san_pham'),
            'thuong_hieu' => $request->input('thuong_hieu'),
            'mo_ta' => $request->input('mo_ta'),
            'dung_tich' => $request->input('dung_tich'),
            'gia' => $request->input('gia'),
            'so_luong_ton' => $request->input('so_luong_ton'),
            'danh_muc_id' => $request->input('danh_muc_id'),
        ]);
        // Kiểm tra nếu có hình ảnh mới, xử lý upload
        if ($request->hasFile('hinh_anh')) {
            $image = $request->file('hinh_anh');
            $imagePath = $image->store('images', 'public');
            $sanpham->update(['hinh_anh' => $imagePath]);
        }
        return response()->json(['message' => 'update hinh ảnh thanh công', 'data' => $sanpham], 200);
    }
    //them san pham
    public function add(Request $request)
    {
        try {
            //  Validate dữ liệu
            $request->validate([
                'ten_san_pham' => 'required|string|max:255',
                'thuong_hieu' => 'required|string|max:100',
                'mo_ta' => 'nullable|string',
                'dung_tich' => 'required|string|max:255',
                'gia' => 'required|numeric',
                'so_luong_ton' => 'required|integer',
                //'danh_muc_id' => 'required|integer|exists:danh_mucs,id',
                'danh_muc_id' => '',
                'hinh_anh' => '',
            ]);

            //  Khởi tạo sản phẩm mới
            $sanpham = new Sanpham();
            $sanpham->ten_san_pham = $request->ten_san_pham;
            $sanpham->thuong_hieu = $request->thuong_hieu;
            $sanpham->mo_ta = $request->mo_ta;
            $sanpham->dung_tich = $request->dung_tich;
            $sanpham->gia = $request->gia;
            $sanpham->so_luong_ton = $request->so_luong_ton;
            $sanpham->danh_muc_id = $request->danh_muc_id;

            //  Xử lý ảnh nếu có
            if ($request->hasFile('hinh_anh')) {
                $file = $request->file('hinh_anh');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('uploads', $filename, 'public');
                $sanpham->hinh_anh = $path;
            }

            $sanpham->save();

            return response()->json(['message' => 'Thêm sản phẩm thành công', 'data' => $sanpham], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi thêm sản phẩm',
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


}