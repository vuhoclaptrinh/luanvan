<?php

namespace App\Http\Controllers;

use App\Models\Danhgia;
use App\Models\Khachhang;
use Illuminate\Http\Request;

class DanhgiaController extends Controller
{
    // get danh sách
    public function get()
    {
        try {
            $danhgias = Danhgia::with(['khachHang', 'sanPham'])->get(); //lấy tên theo khoá
            // $danhgia = Danhgia::all();
            //map 
            $danhgia = $danhgias->map(function ($item) {
                return [
                    'id' => $item->id,
                    'ma_khach_hang' => $item->khach_hang_id,
                    'ma_san_pham' => $item->san_pham_id,
                    'so_sao' => $item->so_sao,
                    'noi_dung' => $item->noi_dung,
                    'ngay_danh_gia' => $item->ngay_danh_gia,
                    'ten_khach_hang' => $item->khachHang->ho_ten ?? null,
                    'ten_san_pham' => $item->sanPham->ten_san_pham ?? null,
                ];
            });

            return response()->json([
                'status' => true,
                'message' => 'Lấy thành công danh sách đánh giá',
                'data' => $danhgia
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra :' . $e->getMessage()
            ], 500);
        }
    }

    //get one danh muc
    public function getOne($id)
    { {
            $danhgia = DanhGia::with(['sanpham', 'khachhang'])->find($id);

            if (!$danhgia) {
                return response()->json(null, 404);
            }

            return response()->json([
                'id' => $danhgia->id,
                'san_pham_id' => $danhgia->san_pham_id,
                'ten_san_pham' => optional($danhgia->sanpham)->ten_san_pham,
                'so_sao' => $danhgia->so_sao,
                'noi_dung' => $danhgia->noi_dung,
                'ngay_danh_gia' => $danhgia->created_at->format('d/m/Y'),
                'ten_khach_hang' => optional($danhgia->khachhang)->ten,
                'email' => optional($danhgia->khachhang)->email,
            ]);
        }
    }
    // add
    public function add(Request $request)
    {
        try {

            $request->validate([
                'khach_hang_id' => 'required|exists:khachhang,id',
                'san_pham_id' => 'required|exists:sanpham,id',
                'so_sao' => 'required|integer|min:1|max:5',
                'noi_dung' => 'nullable|string',
                'ngay_danh_gia' => 'required|date',
            ], );


            $danhgia = new Danhgia();
            $danhgia->khach_hang_id = $request->khach_hang_id;
            $danhgia->san_pham_id = $request->san_pham_id;
            $danhgia->so_sao = $request->so_sao;
            $danhgia->noi_dung = $request->noi_dung;
            $danhgia->ngay_danh_gia = $request->ngay_danh_gia;

            $danhgia->save();


            return response()->json(
                [
                    'message' => 'Thêm đánh giá thành công.',
                    'data' => $danhgia
                ],
                201
            );

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi thêm đánh giá.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    //update(
    public function update(Request $request, $id)
    {
        try {

            $request->validate([
                'khach_hang_id' => 'required|exists:khachhang,id',
                'san_pham_id' => 'required|exists:sanpham,id',
                'so_sao' => 'required|integer|min:1|max:5',
                'noi_dung' => 'nullable|string',
                'ngay_danh_gia' => 'required|date',
            ]);


            $danhgia = Danhgia::find($id);

            if (!$danhgia) {
                return response()->json([
                    'message' => 'Không tìm thấy đánh giá.'
                ], 404);
            }


            $danhgia->khach_hang_id = $request->khach_hang_id;
            $danhgia->san_pham_id = $request->san_pham_id;
            $danhgia->so_sao = $request->so_sao;
            $danhgia->noi_dung = $request->noi_dung;
            $danhgia->ngay_danh_gia = $request->ngay_danh_gia;

            $danhgia->save();


            return response()->json([
                'message' => 'Cập nhật đánh giá thành công.',
                'data' => $danhgia
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi cập nhật đánh giá.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    //xoa
    public function delete($id)
    {
        try {
            $danhgia = Danhgia::find($id);
            if (!$danhgia) {
                return response()->json(['message' => 'Khong tim thay đánh giá'], 404);

            }
            $danhgia->delete();
            return response()->json(['message' => 'Xoá đánh giá thành công'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi xoá đánh giá',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    //get stheo id san phẩm
    public function getBySanPham($sanPhamId)
    {
        try {
            // lấy đánh giá theo sản phẩm kèm tên khách hàng
            $danhgias = Danhgia::with(['khachHang', 'sanPham'])->where('san_pham_id', $sanPhamId)->get();

            // Biến đổi dữ liệu
            $data = $danhgias->map(function ($item) {
                return [
                    'so_sao' => $item->so_sao,
                    'noi_dung' => $item->noi_dung,
                    'ngay_danh_gia' => $item->ngay_danh_gia,
                    'ten_khach_hang' => $item->khachHang->ho_ten ?? null,
                    'ten_san_pham' => $item->sanPham->ten_san_pham ?? null,
                ];
            });

            return response()->json([
                'status' => true,
                'message' => 'Lấy đánh giá theo sản phẩm thành công',
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }
    //get theo id khách hàng
    public function getByKhachHang($idkhachhang)
    {
        try {
            $danhgias = Danhgia::With(['khachhang', 'sanpham'])->where('khach_hang_id', $idkhachhang)->get();

            $danhgia = $danhgias->map(function ($item) {
                return [
                    'ten_khach_hang' => $item->khachHang->ho_ten ?? null,
                    'ten_san_pham' => $item->sanPham->ten_san_pham ?? null,
                    'so_sao' => $item->so_sao,
                    'noi_dung' => $item->noi_dung,
                    'ngay_danh_gia' => $item->ngay_danh_gia,


                ];
            });
            return response()->json([
                'status' => true,
                'message' => 'Lấy đánh giá theo khách hàng thành công',
                'data' => $danhgia
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

}