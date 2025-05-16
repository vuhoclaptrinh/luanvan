<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Khachhang extends Model
{
    use HasFactory;
    protected $table = 'khachhang';
    protected $fillable = [
        'id',
        'ho_ten',
        'email',
        'mat_khau',
        'so_dien_thoai',
        'dia_chi'
    ];
    //co khoa ngoại bên danh giá
    public function danhgias()
    {
        return $this->hasMany(Danhgia::class, 'khach_hang_id');
    }
    protected $primaryKey = 'id';
}