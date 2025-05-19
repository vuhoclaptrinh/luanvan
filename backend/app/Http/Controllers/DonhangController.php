<?php

namespace App\Http\Controllers;

use App\Models\Donhang;
use Illuminate\Http\Request;

class DonhangController extends Controller
{
    public function get()
    {
        try {
            $donhang = Donhang::all();
            // $donhangs = Donhang::with(['khachhang', 'magiamgia'])->get(); //lấy tên theo khoá

            // $donhang = $donhangs->map(function ($item) {
            //     return [
            //         'id' => $item->id,
            //         'khach_hang_id' => $item->khach_hang_id,
            //         'ten_khach_hang' => $item->khachhang->ho_ten ?? null,
            //         'ngay_dat' => $item->ngay_dat,
            //         'tong_tien' => $item->tong_tien,
            //         'trang_thai' => $item->trang_thai,
            //         'ma_giam_gia_id' => $item->ma_giam_gia_id,
            //         'ten_ma_giam_gia' => $item->magiamgia->ma ?? null,
            //     ];
            // });
            return response()->json([
                'status' => true,
                'message' => 'Lấy thành công danh sách đơn hàng',
                'data' => $donhang //trả về dữ liệu
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra :' . $e->getMessage()
            ], 500);
        }
    }
    //get one donhang
    public function getOne($id)
    {
        $donhang = Donhang::Find($id);

        if (!$donhang) {
            return response()->json(['messsage' => 'không tim thay']);
        }
        return response()->json($donhang);
    }
    // add  
    public function add(Request $request)
    {
        try {

            $request->validate([
                'khach_hang_id' => 'required|exists:khachhang,id',
                'ngay_dat' => 'required|date',
                'tong_tien' => 'required|numeric|min:1|max:999999999',
                'trang_thai' => 'nullable|string',

                'ma_giam_gia_id' => 'required|exists:magiamgia,id',
            ]);


            $donhang = new Donhang();
            $donhang->khach_hang_id = $request->khach_hang_id;
            $donhang->ngay_dat = $request->ngay_dat;
            $donhang->tong_tien = $request->tong_tien;
            $donhang->trang_thai = $request->trang_thai;
            $donhang->ma_giam_gia_id = $request->ma_giam_gia_id;

            $donhang->save();


            return response()->json(
                [
                    'message' => 'Thêm đơn hàng thành công.',
                    'data' => $donhang
                ],
                201
            );

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi thêm đơn hàng.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    //update
    public function update(Request $request, $id)
    {
        try {

            $request->validate(
                [
                    'khach_hang_id' => 'required|exists:khachhang,id',
                    'ma_giam_gia_id' => 'required|exists:magiamgia,id',
                    'ngay_dat' => 'required|date',
                    'tong_tien' => 'required|numeric|min:1|max:999999999',
                    'trang_thai' => 'nullable|string',


                ],
                [
                    'khach_hang_id.required' => 'Khách hàng không được để trống.',
                    'khach_hang_id.exists' => 'Khách hàng không tồn tại.',
                    'ma_giam_gia_id.required' => 'Mã giảm giá không được để trống.',
                    'ma_giam_gia_id.exists' => 'Mã giảm giá không tồn tại.',
                    'ngay_dat.required' => 'Ngày đặt không được để trống.',
                    'tong_tien.required' => 'Tổng tiền không được để trống.',
                    'tong_tien.numeric' => 'Tổng tiền phải là số.',
                    'tong_tien.min' => 'Tổng tiền phải lớn hơn 0.',
                    'tong_tien.max' => 'Tổng tiền không được vượt quá 999.999.999 đồng.',
                ],
                [
                    'ma.unique' => 'Mã giảm giá này đã tồn tại. Vui lòng nhập mã khác.',
                    'ma.required' => 'Mã giảm giá không được để trống.',
                    // các thông báo khác nếu muốn:
                    'phan_tram_giam.integer' => 'Phần trăm giảm phải là số nguyên.',
                    'ngay_ket_thuc.after_or_equal' => 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.'
                ]
            );


            $donhang = Donhang::find($id);

            if (!$donhang) {
                return response()->json([
                    'message' => 'Không tìm thấy đơn hàng.'
                ], 404);
            }


            $donhang->khach_hang_id = $request->khach_hang_id;
            $donhang->ngay_dat = $request->ngay_dat;
            $donhang->tong_tien = $request->tong_tien;
            $donhang->trang_thai = $request->trang_thai;
            $donhang->ma_giam_gia_id = $request->ma_giam_gia_id;

            $donhang->save();


            return response()->json([
                'message' => 'Cập nhật đơn hàng thành công.',
                'data' => $donhang
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi cập nhật đơn hàng.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    //xoa
    public function delete($id)
    {
        try {
            $donhang = Donhang::find($id);
            if (!$donhang) {
                return response()->json(['message' => 'Khong tim thấy đơn hàng'], 404);

            }
            $donhang->delete();
            return response()->json(['message' => 'Xoá đơn hàng ' . $id . ' thành công'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi xoá đơn hàng',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    //lọc theo khách hàng
    public function getByKhachHang($khachHangId)
    {
        try {
            $donhangs = Donhang::where('khach_hang_id', $khachHangId)->get();

            $donhang = $donhangs->map(function ($item) {
                return [
                    'id' => $item->id,
                    'khach_hang_id' => $item->khach_hang_id,
                    'ten_khach_hang' => $item->khachHang->ho_ten ?? null,
                    'ngay_dat' => $item->ngay_dat,
                    'tong_tien' => $item->tong_tien,
                    'trang_thai' => $item->trang_thai,
                    'ma_giam_gia_id' => $item->ma_giam_gia_id,
                ];
            });
            return response()->json([
                'status' => true,
                'message' => 'Lấy thành công danh sách đơn hàng theo khách hàng ' . $khachHangId . '.',
                'data' => $donhang
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra :' . $e->getMessage()
            ], 500);
        }
    }
    //lọc theo ngày đặt


    // public function getbydate($ngaydat)
    // {
    //     try {
    //         $donhangs = Donhang::where('ngay_dat', $ngaydat)->get();

    //         $donhang = $donhangs->map(function ($item) {
    //             return [
    //                 'id' => $item->id,
    //                 'khach_hang_id' => $item->khach_hang_id,
    //                 'ten_khach_hang' => $item->khachHang->ho_ten ?? null,
    //                 'ngay_dat' => $item->ngay_dat,
    //                 'tong_tien' => $item->tong_tien,
    //                 'trang_thai' => $item->trang_thai,
    //                 'ma_giam_gia_id' => $item->ma_giam_gia_id,
    //             ];
    //         });
    //         return response()->json([
    //             'status' => true,
    //             'message' => 'Lấy thành công danh sách đơn hàng theo ngày đặt ' . $ngaydat . '.',
    //             'data' => $donhang
    //         ]);
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'status' => false,
    //             'message' => 'Có lỗi xảy ra :' . $e->getMessage()
    //         ], 500);
    //     }
    // }
    // lay theo ngày đặt
    public function getByDate($ngaydat)
    {
        try {
            $donhangs = Donhang::where('ngay_dat', $ngaydat)->with('khachHang')->get();

            $donhang = $donhangs->map(function ($item) {
                return [
                    'id' => $item->id,
                    'khach_hang_id' => $item->khach_hang_id,
                    'ten_khach_hang' => $item->khachHang->ho_ten ?? null,
                    'ngay_dat' => $item->ngay_dat,
                    'tong_tien' => $item->tong_tien,
                    'trang_thai' => $item->trang_thai,
                    'ma_giam_gia_id' => $item->ma_giam_gia_id,
                ];
            });

            return response()->json([
                'status' => true,
                'message' => 'Lấy thành công danh sách đơn hàng theo ngày đặt ' . $ngaydat . '.',
                'data' => $donhang
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra :' . $e->getMessage()
            ], 500);
        }
    }
}