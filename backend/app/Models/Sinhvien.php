<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sinhvien extends Model
{
    protected $table = 'sinh_vien';
    protected $fillable = [
        'id',
        'ho_ten',
        'email'
    ];
    public function khoa()
    {
        return $this->belongsTo(Khoa::class, 'khoa_id');
    }

}