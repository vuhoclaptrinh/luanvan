<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Danhgia extends Model
{
    use HasFactory;

    protected $table = 'danhgia';

    protected $fillable = [
        'khach_hang_id',
        'san_pham_id',
        'so_sao',
        'noi_dung',
        'ngay_danh_gia',
    ];

    // Quan hệ thuộc khách hàng
    public function khachhang()
    {
        return $this->belongsTo(Khachhang::class, 'khach_hang_id');
    }
    // Quan hệ thuộc sản phẩm
    public function sanpham()
    {
        return $this->belongsTo(Sanpham::class, 'san_pham_id');
    }
}