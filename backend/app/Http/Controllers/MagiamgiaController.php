<?php

namespace App\Http\Controllers;

use App\Models\Magiamgia;
use Illuminate\Http\Request;

class MagiamgiaController extends Controller
{
    // get danh sách
    public function get()
    {
        try {
            $magiamgia = Magiamgia::all();
            return response()->json([
                'status' => true,
                'message' => 'Lấy thành công danh sách Giảm giá',
                'data' => $magiamgia
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
    {
        $magiamgia = Magiamgia::Find($id);

        if (!$magiamgia) {
            return response()->json(['messsage' => 'khoong tim thay']);
        }
        return response()->json($magiamgia);
    }
    // add
    public function add(Request $request)
    {
        try {
            $request->validate(
                [
                    'ma' => 'required|string|max:255|unique:magiamgia,ma',
                    'phan_tram_giam' => 'required|integer|min:0|max:100',
                    'ngay_bat_dau' => 'required|date',
                    'ngay_ket_thuc' => 'required|date|after_or_equal:ngay_bat_dau',
                    'dieu_kien_ap_dung' => 'required|string|max:255'
                ],
                [
                    'ma.unique' => 'Mã giảm giá này đã tồn tại. Vui lòng nhập mã khác.',
                    'ma.required' => 'Mã giảm giá không được để trống.',
                    // các thông báo khác nếu muốn:
                    'phan_tram_giam.integer' => 'Phần trăm giảm phải là số nguyên.',
                    'ngay_ket_thuc.after_or_equal' => 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.'
                ]
            );

            // tao
            $magiamgia = new Magiamgia();
            $magiamgia->ma = $request->ma;
            $magiamgia->phan_tram_giam = $request->phan_tram_giam;
            $magiamgia->ngay_bat_dau = $request->ngay_bat_dau;
            $magiamgia->ngay_ket_thuc = $request->ngay_ket_thuc;
            $magiamgia->dieu_kien_ap_dung = $request->dieu_kien_ap_dung;

            $magiamgia->save();
            return response()->json(
                [
                    'message' => 'thêm Giảm giá thành công ',
                    'data' => $magiamgia
                ],
                201
            );

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    //update(
    public function update(Request $request, $id)
    {
        try {
            $request->validate(
                [
                    'ma' => 'required|string|max:255|unique:magiamgia,ma,' . $id,
                    'phan_tram_giam' => 'required|integer|min:0|max:100',
                    'ngay_bat_dau' => 'required|date',
                    'ngay_ket_thuc' => 'required|date|after_or_equal:ngay_bat_dau',
                    'dieu_kien_ap_dung' => 'required|string|max:255'
                ],
                [
                    'ma.unique' => 'Mã giảm giá này đã tồn tại. Vui lòng nhập mã khác.',
                    'ma.required' => 'Mã giảm giá không được để trống.',
                    // các thông báo khác nếu muốn:
                    'phan_tram_giam.integer' => 'Phần trăm giảm phải là số nguyên.',
                    'ngay_ket_thuc.after_or_equal' => 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.'
                ]
            );
            // tim
            $magiamgia = Magiamgia::find($id);

            $magiamgia->update($request->only([
                'ma',
                'phan_tram_giam',
                'ngay_bat_dau',
                'ngay_ket_thuc',
                'dieu_kien_ap_dung'
            ]));
            return response()->json(
                [
                    'message' => 'caap nhat Giảm giá thành công ',
                    'data' => $magiamgia
                ],
                200
            );

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    //xoa
    public function delete($id)
    {
        try {
            $magiamgia = Magiamgia::find($id);
            if (!$magiamgia) {
                return response()->json(['message' => 'Khoong tim thay Giảm giá'], 404);

            }
            $magiamgia->delete();
            return response()->json(['message' => 'Xoá Giảm giá thành công'], 200);
        } catch (\Exception $e) {
            if ($e->getCode() == '23000') {
                // 23000 = SQLSTATE ràng buộc khóa ngoại
                return response()->json([
                    'message' => 'Không thể xoá Giảm giá vì có ràng buộc dữ liệu',
                    'error' => $e->getMessage()
                ], 409);
            }
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi xoá Giảm giá',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}