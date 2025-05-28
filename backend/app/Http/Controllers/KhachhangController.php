<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Khachhang;
use Illuminate\Support\Facades\Hash;

class KhachhangController extends Controller
{
    // get danh sách khách hàng
    public function get()
    {
        try {
            $khachhang = Khachhang::all();
            return response()->json([
                'status' => true,
                'message' => 'Lấy thành công danh sách Khách hàng',
                'data' => $khachhang
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra :' . $e->getMessage()
            ], 500);
        }
    }

    //get one khách hàng
    public function getOne($id)
    {
        $khachhang = Khachhang::Find($id);

        if (!$khachhang) {
            return response()->json(['messsage' => 'khoong tim thay']);
        }
        return response()->json($khachhang);
    }
    // add
    public function add(Request $request)
    {
        try {
            $request->validate([
                'ho_ten' => 'required|string|max:255',
                'email' => 'required|string|max:255',
                'mat_khau' => 'required|string|max:255',
                'so_dien_thoai' => 'required|string|max:255',

                'dia_chi' => 'required|string|max:255'
            ]);
            // tao
            $khachhang = new Khachhang();
            $khachhang->ho_ten = $request->ho_ten;
            $khachhang->email = $request->email;
            $khachhang->mat_khau = Hash::make($request->mat_khau);
            //$khachhang->email = $request->email;
            $khachhang->so_dien_thoai = $request->so_dien_thoai;
            $khachhang->dia_chi = $request->dia_chi;

            $khachhang->save();
            return response()->json(
                [
                    'message' => 'thêm khách hàng thành công ',
                    'data' => $khachhang
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
            $request->validate([
                'ho_ten' => 'required|string|max:255',
                'email' => 'required|string|max:255',
                'mat_khau' => 'required|string|max:255',
                'so_dien_thoai' => 'required|string|max:255',

                'dia_chi' => 'required|string|max:255'
            ]);
            // tim
            $khachhang = Khachhang::find($id);

            $khachhang->update($request->only([
                'ho_ten',
                'email',
                'mat_khau',
                'so_dien_thoai',
                'dia_chi'
            ]));
            return response()->json(
                [
                    'message' => 'cậpp nhật khách hàng thành công ',
                    'data' => $khachhang
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
            $khachhang = Khachhang::find($id);
            if (!$khachhang) {
                return response()->json(['message' => 'Khoong tim thay khách hàng'], 404);

            }
            $khachhang->delete();
            return response()->json(['message' => 'Xoá khách hàng thành công'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi xoá khách hàng',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    //login
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'mat_khau' => 'required|string',
        ]);

        // Tìm khách hàng theo email
        $khachhang = Khachhang::where('email', $request->email)->first();

        // So sánh mật khẩu
        if (!$khachhang || !Hash::check($request->mat_khau, $khachhang->mat_khau)) {
            return response()->json([
                'message' => 'Email hoặc mật khẩu không đúng'
            ], 401);
        }

        return response()->json([
            'message' => 'Đăng nhập thành công',
            'user' => $khachhang
        ]);
    }
    //register
    public function register(Request $request)
    {
        $request->validate(
            [
                'ho_ten' => 'required|string|max:255',
                'email' => 'required|email|unique:khachhang,email',
                'mat_khau' => 'required|string|min:6|max:255',
            ],
            [
                'ho_ten.required' => 'Họ tên là bắt buộc',
                'email.required' => 'Email là bắt buộc',
                'email.email' => 'Email không hợp lệ',
                'email.unique' => 'Email đã được sử dụng',
                'mat_khau.required' => 'Mật khẩu là bắt buộc',
                'mat_khau.min' => 'Mật khẩu phải có ít nhất 6 ký tự',
            ]
        );

        $khachhang = new Khachhang();
        $khachhang->ho_ten = $request->ho_ten;
        $khachhang->email = $request->email;
        $khachhang->mat_khau = Hash::make($request->mat_khau); // 🔒 Mã hoá mật khẩu

        $khachhang->save();

        return response()->json([
            'success' => true,
            'message' => 'Đăng ký thành công',
            'user' => $khachhang
        ], 201);
    }

}