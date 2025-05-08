<?php

use App\Http\Controllers\SanphamController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return ['api nef'];
});
//Route::get('/sanpham', [SanphamController::class, 'get']);
//Route::get('/sanpham/{id}', [SanphamController::class, 'getOne']);