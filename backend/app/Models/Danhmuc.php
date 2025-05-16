<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Danhmuc extends Model
{
    use HasFactory;
    protected $table = 'danhmuc';
    protected $fillable = [
        'id',
        'ten_danh_muc',
        'mo_ta'
    ];
    protected $primaryKey = 'id';

    //có sản phảm phụ thuộc
    public function sanphams()
    {
        return $this->hasMany(Sanpham::class, 'danh_muc_id');
    }
}