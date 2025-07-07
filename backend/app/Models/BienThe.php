<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BienThe extends Model
{
    use HasFactory;

    protected $table = 'bienthe';

    protected $fillable = [
        'san_pham_id',
        'dung_tich',
        'gia',
        'so_luong_ton',
    ];

    // Biến thể thuộc về một sản phẩm
    public function sanpham()
    {
        return $this->belongsTo(Sanpham::class, 'san_pham_id');
    }
    public function chitietdonhang()
    {
        return $this->hasMany(Chitietdonhang::class, 'bien_the_id');
    }
}