<?php

namespace App\Http\Controllers;

use App\Models\Donhang;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class DonhangController extends Controller
{
    public function get()
    {
        try {

            $donhangs = Donhang::with(['khachhang', 'magiamgia', 'chitietdonhang'])->get()->map(function ($item) {
                $tongTiengoc = $item->chitietdonhang->sum(function ($ct) {
                    return $ct->so_luong * $ct->gia;
                });

                if ($tongTiengoc > 10000000) {
                    $tongTienduocgiam = $tongTiengoc * 0.4; // Giảm 40%
                } elseif ($tongTiengoc > 5000000 && $tongTiengoc <= 10000000) {
                    $tongTienduocgiam = $tongTiengoc * 0.3; // Giảm 30%
                } elseif ($tongTiengoc > 1000000 && $tongTiengoc <= 5000000) {
                    $tongTienduocgiam = $tongTiengoc * 0.2; // Giảm 20%
                } else {
                    $tongTienduocgiam = 0;
                }
                // Đảm bảo không âm
                $tongTienSauGiam = max(0, $tongTiengoc - $tongTienduocgiam);





                return [
                    'id' => $item->id,
                    'khach_hang_id' => $item->khach_hang_id,
                    'ten_khach_hang' => optional($item->khachhang)->ho_ten,
                    'ngay_dat' => $item->ngay_dat,
                    'tong_tien' => (float) $tongTiengoc,
                    'tong_tien_format' => number_format($tongTiengoc, 0, ',', '.') . ' ₫',
                    'tong_tien_giam' => (float) $tongTienSauGiam,
                    'tong_tien_format_giam' => number_format($tongTienSauGiam, 0, ',', '.') . ' ₫',
                    'trang_thai' => $item->trang_thai,
                    'ma_giam_gia_id' => $item->ma_giam_gia_id,
                    'ten_ma_giam_gia' => optional($item->magiamgia)->ma,
                ];
            });

            return response()->json([
                'status' => true,
                'message' => 'Lấy thành công danh sách đơn hàng',
                'data' => $donhangs
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

    //get one donhang
    public function getOne($id)
    {
        $donhang = Donhang::with(['khachhang', 'magiamgia', 'chitietdonhang'])->find($id);
        // Kiểm tra đơn hàng có tồn tại 
        if (!$donhang) {
            return response()->json(['message' => 'Không tìm thấy đơn hàng'], 404);
        }
        // Tính tổng tiền từ chi tiết đơn hàng
        $tongTien = $donhang->chitietdonhang->sum(function ($ct) {
            return $ct->so_luong * $ct->gia;
        });

        // Giảm giá theo điều kiện
        if ($tongTien > 10000000) {
            $tongTien *= 0.6; // Giảm 40%
        } elseif ($tongTien > 5000000 && $tongTien <= 10000000) {
            $tongTien *= 0.7; // Giảm 30%
        } elseif ($tongTien > 1000000 && $tongTien <= 5000000) {
            $tongTien *= 0.8; // Giảm 20%
        }


        $tongTien = max(0, $tongTien);

        // dữ liệu 
        $donhangs = [
            'id' => $donhang->id,
            'khach_hang_id' => $donhang->khach_hang_id,
            'ten_khach_hang' => optional($donhang->khachhang)->ho_ten,
            'email' => optional($donhang->khachhang)->email,
            'so_dien_thoai' => optional($donhang->khachhang)->so_dien_thoai,
            'dia_chi' => optional($donhang->khachhang)->dia_chi,
            'ngay_dat' => $donhang->ngay_dat,
            'tong_tien' => (float) $tongTien,
            'tong_tien_format_giam' => number_format($tongTien, 0, ',', '.') . ' ₫',
            'trang_thai' => $donhang->trang_thai,
            'ma_giam_gia_id' => $donhang->ma_giam_gia_id,
            'ten_ma_giam_gia' => optional($donhang->magiamgia)->ma,
        ];

        if (!$donhangs) {
            return response()->json(['messsage' => 'không tim thay']);
        }
        return response()->json($donhangs);
    }
    // add  
    public function add(Request $request)
    {
        try {

            $request->validate(
                [
                    'khach_hang_id' => 'required|exists:khachhang,id',
                    'ngay_dat' => 'required|date',
                    'tong_tien' => 'required|numeric|min:1|max:999999999',
                    'trang_thai' => 'nullable|string',

                    'ma_giam_gia_id' => 'nullable|exists:magiamgia,id',
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

            );


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
                    'ma_giam_gia_id' => 'nullable|exists:magiamgia,id',
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
            if ($e->getCode() == '23000') {
                // 23000 = SQLSTATE ràng buộc khóa ngoại
                return response()->json([
                    'message' => 'Không thể xoá danh mục vì có ràng buộc dữ liệu',
                    'error' => $e->getMessage()
                ], 409);
            }
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra :' . $e->getMessage()
            ], 500);
        }
    }
    //lọc theo ngày đặt


    public function getDoanhThuTheoThang($year = null)
    {
        try {
            $year = $year ?? Carbon::now()->year;

            // Dùng Eloquent với selectRaw
            $doanhThuTheoThang = Donhang::whereYear('ngay_dat', $year)
                ->selectRaw('MONTH(ngay_dat) as thang, SUM(tong_tien) as doanh_thu')
                ->groupBy('thang')
                ->orderBy('thang')
                ->get();

            // Đảm bảo có đủ 12 tháng
            $result = [];
            for ($i = 1; $i <= 12; $i++) {
                $thangData = $doanhThuTheoThang->firstWhere('thang', $i);
                $result[] = [
                    'month' => 'Tháng ' . $i,
                    'revenue' => $thangData ? (int) $thangData->doanh_thu : 0
                ];
            }

            return response()->json([
                'status' => true,
                'message' => "Lấy doanh thu theo tháng năm $year thành công.",
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }
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