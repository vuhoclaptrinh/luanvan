<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Khoa extends Model
{
    protected $table = 'khoa';
    protected $fillable = [
        'id',
        'ten_khoa',
        'Ky_hieu'
    ];
    public function sinhviens()
    {
        return $this->hasMany(Sinhvien::class, 'khoa_id', 'id');
    }

}