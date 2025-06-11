<?php

namespace App\Http\Controllers;

use App\Models\Khoa;
use Illuminate\Http\Request;

class KhoaController extends Controller
{
    public function get()
    {
        try {
            $khoa = Khoa::all();
            return response()->json([
                'status' => true,
                'message' => 'Lấy thành công danh sách Khoa',
                'data' => $khoa
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra :' . $e->getMessage()
            ], 500);
        }
    }
    public function getOne($id)
    {
        $khoa = Khoa::with(['sinhviens:id,ho_ten,email,khoa_id'])->find($id);

        if (!$khoa) {
            return response()->json(['messsage' => 'khoong tim thay']);
        }
        return response()->json($khoa);
    }
}