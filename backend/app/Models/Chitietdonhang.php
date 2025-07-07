<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;

class Chitietdonhang extends Model
{

    protected $table = 'chitietdonhang';
    protected $fillable = [
        'id',
        'don_hang_id',
        'san_pham_id',
        'soluong',
        'gia',

    ];
    //quan hệ với đơn hàng (fk don hang lấy id donhang) 
    public function donhang()
    {
        return $this->belongsTo(Donhang::class, 'don_hang_id');
    }
    //quan hệ với sản phẩm (fk san pham lấy id sanpham)
    public function sanpham()
    {
        return $this->belongsTo(Sanpham::class, 'san_pham_id');
    }
    public function bienthe()
    {
        return $this->belongsTo(Bienthe::class, 'bien_the_id');
    }
}