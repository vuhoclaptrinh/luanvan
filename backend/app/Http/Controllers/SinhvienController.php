<?php

namespace App\Http\Controllers;

use App\Models\Sinhvien;
use Illuminate\Http\Request;

class SinhvienController extends Controller
{
    public function get()
    {
        try {
            $sinhvien = Sinhvien::with(['khoa'])->get()->map(function ($item) {
                return [
                    'id' => $item->id,
                    'ho_ten' => $item->ho_ten,
                    'email' => $item->email,
                    'khoa_id' => $item->khoa_id,
                    'ten_khoa' => $item->khoa ? $item->khoa->ten_khoa : null,
                    'created_at' => $item->created_at,
                    'updated_at' => $item->updated_at,
                ];
            });

            return response()->json([
                'status' => true,
                'message' => 'Lấy danh sách Sinh viên thành công',
                'data' => $sinhvien
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }
}