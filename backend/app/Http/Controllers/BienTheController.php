<?php

namespace App\Http\Controllers;

use App\Models\BienThe;
use Illuminate\Http\Request;

class BienTheController extends Controller
{
    public function getall()
    {
        try {
            $bienthe = BienThe::all();
            return response()->json([
                'status' => true,
                'message' => 'Lấy thành công danh sách Bien thể ',
                'data' => $bienthe
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra :' . $e->getMessage()
            ], 500);
        }
    }
    // Lấy tất cả biến thể của 1 sản phẩm
    public function get($san_pham_id)
    {
        $variants = BienThe::where('san_pham_id', $san_pham_id)->get();
        return response()->json(['data' => $variants]);
    }

    // Thêm mới biến thể
    public function add(Request $request)
    {
        try {
            $validated = $request->validate([
                'san_pham_id' => 'required|exists:sanpham,id',
                'dung_tich' => 'required|string',
                'gia' => 'required|numeric',
                'so_luong_ton' => 'required|integer',
            ]);

            $variant = BienThe::create($validated);

            return response()->json([
                'message' => 'Tạo biến thể thành công!',
                'data' => $variant
            ]);

        } catch (\Exception $e) {
            // Bắt lỗi và trả về để biết lý do thực sự
            return response()->json([
                'error' => true,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Cập nhật biến thể
    public function update(Request $request, $id)
    {
        $variant = BienThe::findOrFail($id);

        $validated = $request->validate([
            'dung_tich' => 'required|string',
            'gia' => 'sometimes|required|numeric',
            'so_luong_ton' => 'sometimes|required|integer',
        ]);

        $variant->update($validated);

        return response()->json([
            'message' => 'Cập nhật biến thể thành công!',
            'data' => $variant
        ]);
    }

    // Xoá biến thể
    public function delete($id)
    {
        $variant = BienThe::findOrFail($id);
        $variant->delete();

        return response()->json(['message' => 'Xóa biến thể thành công!']);
    }
}