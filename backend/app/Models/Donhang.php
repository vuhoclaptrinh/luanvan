<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Donhang extends Model
{
    use HasFactory;

    protected $table = 'donhang';
    protected $fillable = [
        'id',
        'khach_hang_id',
        'so_dien_thoai',
        'dia_chi',
        'ngay_dat',
        'tong_tien',
        'trang_thai',
        'ma_giam_gia_id',
        'paymentMethod'
    ];
    // quan he voi khach hang  (fk khach hang lấy id khachhang)
    public function khachhang()
    {
        return $this->belongsTo(Khachhang::class, 'khach_hang_id');
    }
    //quan he voi ma giam gia ( fk ma giam gia lấy id magiamgia)
    public function magiamgia()
    {
        return $this->belongsTo(Magiamgia::class, 'ma_giam_gia_id');
    }
    public function chitietdonhang()
    {
        return $this->hasMany(Chitietdonhang::class, 'don_hang_id');
    }
}