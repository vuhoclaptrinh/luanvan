<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sanpham extends Model
{
    use HasFactory;

    protected $table = 'sanpham';

    protected $fillable = [
        'id',
        'ten_san_pham',
        'thuong_hieu',
        'mo_ta',
        'dung_tich',
        'gia',
        'so_luong_ton',
        'hinh_anh',
        'danh_muc_id',
        'xuat_xu',
        'phong_cach',
        'nam_phat_hanh',
        'do_luu_huong',
        'do_toa_huong',
        // Thêm các cột khác trong bảng
    ];

    //thuộc 1 danh mục
    public function danhmuc()
    {
        return $this->belongsTo(Danhmuc::class, 'danh_muc_id');
    }

    //có khoá ngoại bên đánh giá
    public function danhgias()
    {
        return $this->hasMany(Danhgia::class, 'san_pham_id');
    }
    public function getHinhAnhUrlAttribute()
    {
        if ($this->hinh_anh) {
            return asset('storage/' . $this->hinh_anh); // tạo URL đầy đủ
        }
        return null;
    }
    public function images()
    {
        return $this->hasMany(SanphamImage::class, 'sanpham_id');
    }

    public function variants()
    {
        return $this->hasMany(BienThe::class, 'san_pham_id');
    }
    protected $primaryKey = 'id';
}