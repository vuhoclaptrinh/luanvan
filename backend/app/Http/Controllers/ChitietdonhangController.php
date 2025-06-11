<?php

namespace App\Http\Controllers;
use App\Models\Chitietdonhang;
use App\Models\Donhang;
use Illuminate\Http\Request;

class ChitietdonhangController extends Controller
{
    //GET 
    public function get()
    {
        try {
            $chitietdonhangs = Chitietdonhang::all();
            // $chitietdonhang = Chitietdonhang::with('donhang', 'sanpham')->get();

            // $chitietdonhangs = $chitietdonhang->map(function ($item) {
            //     return [
            //         'id' => $item->id,
            //         'don_hang_id' => $item->don_hang_id,
            //         'ten_khach_hang' => $item->donhang->khachhang->ho_ten ?? null,
            //         'san_pham_id' => $item->san_pham_id,
            //         'ten_san_pham' => $item->sanpham->ten_san_pham ?? null,
            //         'so_luong' => $item->so_luong,
            //         'gia' => $item->gia,

            //     ];
            // });
            return response()->json([
                'status' => true,
                'message' => 'Lấy thành công danh sách chi tiết đơn hàng',
                'data' => $chitietdonhangs
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }
    //get id donhang
    public function getByDonhang($don_hang_id)
    {
        try {
            $chitietdonhang = Chitietdonhang::where('don_hang_id', $don_hang_id)->with('sanpham')->get();

            if ($chitietdonhang->isEmpty()) {
                return response()->json(['message' => 'Không tìm thấy chi tiết đơn hàng'], 404);
            }
            $chitietdonhangs = $chitietdonhang->map(function ($item) {
                return [
                    'id' => $item->id,
                    'don_hang_id' => $item->don_hang_id,
                    'ten_khach_hang' => $item->donhang->khachhang->ho_ten ?? null,
                    'san_pham_id' => $item->san_pham_id,
                    'ten_san_pham' => $item->sanpham->ten_san_pham ?? null,
                    'so_luong' => $item->so_luong,
                    'gia' => $item->gia,

                ];
            });
            return response()->json([
                'status' => true,
                'message' => 'Lấy thành công danh sách chi tiết đơn hàng',
                'data' => $chitietdonhangs
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }
    //add
    public function add(Request $request)
    {
        try {
            $request->validate(
                [
                    'don_hang_id' => 'required|exists:donhang,id',
                    'san_pham_id' => 'required|exists:sanpham,id',
                    'so_luong' => 'required|integer|min:1',
                    'gia' => 'required|numeric|min:0',
                ]


            );
            $chitietdonhang = new Chitietdonhang();
            $chitietdonhang->don_hang_id = $request->don_hang_id;
            $chitietdonhang->san_pham_id = $request->san_pham_id;
            $chitietdonhang->so_luong = $request->so_luong;
            $chitietdonhang->gia = $request->gia;
            $chitietdonhang->save();

            return response()->json([
                'status' => true,
                'message' => 'Thêm thành công chi tiết đơn hàng',
                'data' => $chitietdonhang
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }
    // update
    public function update(Request $request, $id)
    {
        try {
            $chitietdonhang = Chitietdonhang::find($id);
            if (!$chitietdonhang) {
                return response()->json(['message' => 'Không tìm thấy chi tiết đơn hàng'], 404);
            }
            $request->validate([
                'don_hang_id' => 'required|exists:donhang,id',
                'san_pham_id' => 'required|exists:sanpham,id',
                'so_luong' => 'required|integer|min:1',
                'gia' => 'required|numeric|min:0',
            ]);
            $chitietdonhang->don_hang_id = $request->don_hang_id;
            $chitietdonhang->san_pham_id = $request->san_pham_id;
            $chitietdonhang->so_luong = $request->so_luong;
            $chitietdonhang->gia = $request->gia;
            $chitietdonhang->save();

            return response()->json([
                'status' => true,
                'message' => 'Cập nhật thành công chi tiết đơn hàng',
                'data' => $chitietdonhang
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }
    //delete
    public function delete($id)
    {
        try {
            $chitietdonhang = Chitietdonhang::find($id);
            if (!$chitietdonhang) {
                return response()->json(['message' => 'Không tìm thấy chi tiết đơn hàng'], 404);
            }
            $chitietdonhang->delete();

            return response()->json([
                'status' => true,
                'message' => 'Xóa thành công chi tiết đơn hàng'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }
}