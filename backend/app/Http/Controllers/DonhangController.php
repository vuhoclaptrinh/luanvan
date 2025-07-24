<?php

namespace App\Http\Controllers;

use App\Models\BienThe;
use App\Models\Donhang;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DonhangController extends Controller
{

    public function get()
    {
        try {


            $donhangs = Donhang::with(['khachhang', 'magiamgia'])->get()->map(function ($item) {
                return [
                    'id' => $item->id,
                    'khach_hang_id' => $item->khach_hang_id,
                    'so_dien_thoai' => $item->so_dien_thoai,
                    'dia_chi' => $item->dia_chi,
                    'ten_khach_hang' => optional($item->khachhang)->ho_ten,
                    'ngay_dat' => Carbon::parse($item->ngay_dat)->format('d-m-Y'),

                    'tong_tien_truoc_giam' => $item->tong_tien_truoc_giam,
                    'tong_tien_truoc_giam_fomat' => number_format($item->tong_tien_truoc_giam, 0, ',', '.') . ' ₫',
                    'giam_gia_tien' => $item->giam_gia_tien,
                    'giam_gia_tien_fomat' => number_format($item->giam_gia_tien, 0, ',', '.') . ' ₫',
                    'phi_van_chuyen' => $item->phi_van_chuyen,
                    'phi_van_chuyen_fomat' => number_format($item->phi_van_chuyen, 0, ',', '.') . ' ₫',
                    'tong_tien' => $item->tong_tien,
                    'tong_tien_format' => number_format($item->tong_tien, 0, ',', '.') . ' ₫',

                    'trang_thai' => $item->trang_thai,
                    'ma_giam_gia_id' => $item->ma_giam_gia_id,
                    'ten_ma_giam_gia' => optional($item->magiamgia)->ma,
                    'paymentMethod' => $item->paymentMethod,
                    'created_at' => $item->created_at
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
        $donhang = Donhang::with(['khachhang', 'magiamgia'])->find($id);

        if (!$donhang) {
            return response()->json(['message' => 'Không tìm thấy đơn hàng'], 404);
        }

        return response()->json([
            'id' => $donhang->id,
            'khach_hang_id' => $donhang->khach_hang_id,
            'so_dien_thoai' => (string) $donhang->so_dien_thoai,
            'dia_chi' => $donhang->dia_chi,
            'ten_khach_hang' => optional($donhang->khachhang)->ho_ten,
            'email' => optional($donhang->khachhang)->email,
            'ngay_dat' => Carbon::parse($donhang->ngay_dat)->format('Y-m-d'),

            'tong_tien_truoc_giam' => $donhang->tong_tien_truoc_giam,
            'tong_tien_truoc_giam_fomat' => number_format($donhang->tong_tien_truoc_giam, 0, ',', '.') . ' ₫',
            'giam_gia_tien' => $donhang->giam_gia_tien,
            'giam_gia_tien_fomat' => number_format($donhang->giam_gia_tien, 0, ',', '.') . ' ₫',
            'phi_van_chuyen' => $donhang->phi_van_chuyen,
            'phi_van_chuyen_fomat' => number_format($donhang->phi_van_chuyen, 0, ',', '.') . ' ₫',
            'tong_tien' => $donhang->tong_tien,
            'tong_tien_format' => number_format($donhang->tong_tien, 0, ',', '.') . ' ₫',

            'trang_thai' => $donhang->trang_thai,
            'ma_giam_gia_id' => $donhang->ma_giam_gia_id,
            'ten_ma_giam_gia' => optional($donhang->magiamgia)->ma,
            'paymentMethod' => $donhang->paymentMethod,
            'created_at' => $donhang->created_at
        ]);



    }
    // add  
    public function add(Request $request)
    {
        try {

            $request->validate(
                [
                    'khach_hang_id' => 'required|exists:khachhang,id',
                    'so_dien_thoai' => 'required|string|max:255',

                    'dia_chi' => 'required|string|max:255',

                    'ngay_dat' => 'required|date',
                    'tong_tien' => 'required|numeric|min:1|max:999999999',
                    'trang_thai' => 'nullable|string',

                    'ma_giam_gia_id' => 'nullable|exists:magiamgia,id',
                    'paymentMethod' => 'nullable|string',
                    'tong_tien_truoc_giam' => 'required|numeric',
                    'giam_gia_tien' => 'required|numeric',
                    'phi_van_chuyen' => 'required|numeric',
                    'ten_phuong_thuc_van_chuyen' => 'nullable|string|max:255',

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
            $donhang->so_dien_thoai = $request->so_dien_thoai;
            $donhang->dia_chi = $request->dia_chi;
            $donhang->ngay_dat = $request->ngay_dat ?? Carbon::now('Asia/Ho_Chi_Minh');

            $donhang->tong_tien = $request->tong_tien;
            $donhang->tong_tien_truoc_giam = $request->tong_tien_truoc_giam;
            $donhang->giam_gia_tien = $request->giam_gia_tien;
            $donhang->phi_van_chuyen = $request->phi_van_chuyen;
            $donhang->ten_phuong_thuc_van_chuyen = $request->ten_phuong_thuc_van_chuyen;
            $donhang->trang_thai = $request->trang_thai;
            $donhang->ma_giam_gia_id = $request->ma_giam_gia_id;
            $donhang->paymentMethod = $request->paymentMethod;
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
                    'created_at' => $item->created_at,
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

            $doanhThuTheoThang = Donhang::whereYear('ngay_dat', $year)
                ->where('trang_thai', 'đã giao') // ✅ chỉ tính đơn đã giao
                ->selectRaw('MONTH(ngay_dat) as thang, SUM(tong_tien) as doanh_thu')
                ->groupBy('thang')
                ->orderBy('thang')
                ->get();

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
    //check xem khách hàng đã mua sản phẩm này chưa
    public function checkDaMua($khachHangId, $sanPhamId)
    {
        try {
            $daMua = Donhang::where('khach_hang_id', $khachHangId)
                ->whereHas('chiTietDonHang', function ($query) use ($sanPhamId) {
                    $query->where('san_pham_id', $sanPhamId);
                })
                ->exists();

            return response()->json([
                'status' => true,
                'message' => $daMua ? 'Khách hàng đã mua sản phẩm này' : 'Chưa mua',
                'da_mua' => $daMua
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

    public function createGHTK(Request $request, $id)
    {
        $donhang = Donhang::with(['chitietdonhang.sanpham'])->find($id);

        if (!$donhang) {
            return response()->json(['message' => 'Không tìm thấy đơn hàng'], 404);
        }

        // Tách tỉnh và quận/huyện
        $parts = explode(',', $donhang->dia_chi);
        $province = $this->cleanAddressPart(trim($parts[count($parts) - 1] ?? ''));
        $district = $this->cleanAddressPart(trim($parts[count($parts) - 2] ?? ''));

        // Chuẩn bị danh sách sản phẩm
        $products = [];
        foreach ($donhang->chitietdonhang as $item) {
            $productName = $item->sanpham->ten_san_pham ?? 'Sản phẩm không tên';

            $products[] = [
                'name' => $productName,
                'weight' => $item->sanpham->weight ?? 0.2,
                'quantity' => $item->so_luong,
            ];


        }
        $addressParts = explode(',', $donhang->dia_chi);

        if (count($addressParts) >= 5) {
            // Chèn "Tổ 1" vào sau xã (vị trí thứ 3 → index 2)
            array_splice($addressParts, 3, 0, 'Tổ 1');
        }

        $fullAddress = implode(',', $addressParts);
        // Payload gửi GHTK
        $payload = [
            'order' => [
                'id' => 'DH' . $donhang->id,
                'pick_name' => 'Shop Nước Hoa ABC',
                'pick_address' => '123 Nguyễn Văn A',
                'pick_province' => 'Hồ Chí Minh',
                'pick_district' => 'Quận 1',
                'pick_tel' => '0909123456',

                'tel' => '0' . ltrim($donhang->so_dien_thoai, '0'),
                'name' => $donhang->khachhang->ho_ten ?? 'Khách hàng',
                'address' => $donhang->dia_chi,
                'province' => $province,
                'district' => $district,

                'is_freeship' => '0',
                'pick_money' => (int) $donhang->tong_tien,
                'value' => (int) $donhang->tong_tien,
                'note' => 'Đơn hàng từ website',
                'transport' => 'road',
                'products' => $products,
                'total_weight' => 0.2,
            ]
        ];

        // Gửi request đến GHTK
        $response = Http::withOptions(['verify' => false])
            ->withHeaders([
                'Token' => env('GHTK_TOKEN'),
            ])
            ->acceptJson()
            ->post('https://services.giaohangtietkiem.vn/services/shipment/order', $payload);
        // Xử lý phản hồi
        if ($response->successful() && isset($response->json()['order'])) {
            $label = $response->json()['order']['label'];
            $donhang->tracking_code = $label;
            $donhang->save();

            return response()->json([
                'success' => true,
                'tracking_code' => $label,
            ]);
        } else {
            Log::error('Lỗi từ GHTK:', [
                'payload' => $payload,
                'response' => $response->body(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Tạo đơn GHTK thất bại',
                'ghtk_error' => $response->json(),
            ], 500);
        }
    }

    function cleanAddressPart($text)
    {
        return trim(preg_replace('/^(Tỉnh|Thành phố|TP|Quận|Huyện|Thị xã)\s+/ui', '', $text));
    }
    public function huyDonHang($id)
    {
        $donhang = Donhang::with('chitietdonhang')->find($id);

        if (!$donhang) {
            return response()->json(['message' => 'Không tìm thấy đơn hàng'], 404);
        }

        if (strtolower($donhang->trang_thai) !== 'chờ xử lý') {
            return response()->json(['message' => 'Chỉ được huỷ đơn khi đang chờ xác nhận'], 400);
        }
        foreach ($donhang->chitietdonhang as $item) {
            if ($item->bien_the_id) {
                $bienthe = BienThe::find($item->bien_the_id);
                if ($bienthe) {
                    $bienthe->so_luong_ton += $item->so_luong;
                    $bienthe->save();
                }
            }
        }
        $donhang->trang_thai = 'đã huỷ';
        $donhang->save();

        return response()->json(['message' => 'Đã huỷ đơn hàng và hoàn trả tồn kho thành công']);
    }


}