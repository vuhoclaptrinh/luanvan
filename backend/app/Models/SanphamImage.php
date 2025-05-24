<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SanphamImage extends Model
{
    protected $table = 'sanpham_images';

    protected $fillable = ['sanpham_id', 'image_path'];

    public function sanpham()
    {
        return $this->belongsTo(Sanpham::class);
    }
}