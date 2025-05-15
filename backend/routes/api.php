<?php

use App\Http\Controllers\SanphamController;
use App\Models\Sanpham;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DanhmucController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});
//SAN phẩm
//get all
Route::get('/sanpham', [SanphamController::class, 'get']);
//get one
Route::get('/sanpham/{id}', [SanphamController::class, 'getOne']);
//add
Route::post('/sanpham', [SanphamController::class, 'add']);
//update
Route::put('/sanpham/{id}', [SanphamController::class, 'update']);
//delete
Route::delete('/sanpham/{id}', [SanphamController::class, 'delete']);
//getby Danh mục
Route::get('/sanpham/danhmuc/{id}', [SanphamController::class, 'getByDanhmuc']);



//DANH MỤC 
//GET
Route::get('/danhmuc', [DanhmucController::class, 'get']);
//get one
Route::get('/danhmuc/{id}', [DanhmucController::class, 'getOne']);
//add
Route::post('/danhmuc', [DanhmucController::class, 'add']);
//update
Route::put('/danhmuc/{id}', [DanhmucController::class, 'update']);
//delete
Route::delete('/danhmuc/{id}', [DanhmucController::class, 'delete']);


Route::get('/test', function () {
    return response()->json(['message' => 'API OK']);
});