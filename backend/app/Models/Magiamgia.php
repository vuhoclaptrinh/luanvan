<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Magiamgia extends Model
{
    use HasFactory;
    protected $table = 'magiamgia';
    protected $fillable = [
        'ma',
        'phan_tram_giam',
        'ngay_bat_dau',
        'ngay_ket_thuc',
        'dieu_kien_ap_dung'
    ];
    protected $primaryKey = 'id';
}