<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Khachhang;
use Illuminate\Container\Facades\DB;
use Illuminate\Support\Facades\DB as FacadesDB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

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
                'email' => 'required|email|max:255',
                'so_dien_thoai' => 'required|string|max:255',
                'dia_chi' => 'required|string|max:255',
                'mat_khau' => 'nullable|string|min:6',
            ]);

            $khachhang = Khachhang::find($id);

            if (!$khachhang) {
                return response()->json(['message' => 'Không tìm thấy khách hàng'], 404);
            }

            $data = $request->only([
                'ho_ten',
                'email',
                'so_dien_thoai',
                'dia_chi',
            ]);

            // Nếu có gửi mật khẩu mới thì mã hóa rồi lưu
            if ($request->filled('mat_khau')) {
                $data['mat_khau'] = bcrypt($request->mat_khau);
            }

            $khachhang->update($data);

            return response()->json([
                'message' => 'Cập nhật khách hàng thành công',
                'data' => $khachhang,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi',
                'error' => $e->getMessage(),
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
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:khachhang,email',
        ]);

        $token = Str::random(60);

        // Lưu token vào bảng reset_password
        FacadesDB::table('reset_password')->updateOrInsert(
            ['email' => $request->email],
            [
                'token' => $token,
                'created_at' => now()
            ]
        );

        // Tạo link reset mật khẩu (trả về cho frontend hiển thị)
        $resetLink = "http://localhost:5173/reset-password?token=$token&email=" . urlencode($request->email);

        return response()->json([
            'message' => 'Yêu cầu đặt lại mật khẩu đã được xử lý.',
            'reset_link' => $resetLink
        ]);
    }
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|string',
            'new_password' => 'required|string|min:6|confirmed'
        ]);

        $record = FacadesDB::table('reset_password')
            ->where('email', $request->email)
            ->where('token', $request->token)
            ->first();

        if (!$record) {
            return response()->json(['message' => 'Token không hợp lệ hoặc đã hết hạn'], 400);
        }

        $khachhang = Khachhang::where('email', $request->email)->first();

        if (!$khachhang) {
            return response()->json(['message' => 'Không tìm thấy tài khoản'], 404);
        }

        $khachhang->mat_khau = Hash::make($request->new_password);
        $khachhang->save();

        FacadesDB::table('reset_password')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Đặt lại mật khẩu thành công']);
    }
}