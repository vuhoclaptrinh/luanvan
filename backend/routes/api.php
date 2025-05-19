<?php

use App\Http\Controllers\DanhgiaController;
use App\Http\Controllers\SanphamController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DanhmucController;
use App\Http\Controllers\DonhangController;
use App\Http\Controllers\KhachhangController;
use App\Http\Controllers\MagiamgiaController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});
Route::get('/test', function () {
    return response()->json(['message' => 'API OK']);
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

//KACH HANG
//GET
Route::get('/khachhang', [KhachhangController::class, 'get']);
//get one
Route::get('/khachhang/{id}', [KhachhangController::class, 'getOne']);
//add
Route::post('/khachhang', [KhachhangController::class, 'add']);
//update
Route::put('/khachhang/{id}', [KhachhangController::class, 'update']);
//delete
Route::delete('/khachhang/{id}', [KhachhangController::class, 'delete']);

//Mã Giàm Giá
//GET
Route::get('/magiamgia', [MagiamgiaController::class, 'get']);
//get one
Route::get('/magiamgia/{id}', [MagiamgiaController::class, 'getOne']);
//add
Route::post('/magiamgia', [MagiamgiaController::class, 'add']);
//update
Route::put('/magiamgia/{id}', [MagiamgiaController::class, 'update']);
//delete
Route::delete('/magiamgia/{id}', [MagiamgiaController::class, 'delete']);

//Đánh giá
//GET
Route::get('/danhgia', [DanhgiaController::class, 'get']);
//get one
Route::get('/danhgia/{id}', [DanhgiaController::class, 'getOne']);
//add
Route::post('/danhgia', [DanhgiaController::class, 'add']);
//update
Route::put('/danhgia/{id}', [DanhgiaController::class, 'update']);
//delete
Route::delete('/danhgia/{id}', [DanhgiaController::class, 'delete']);
//getby san pham
Route::get('/danhgia/sanpham/{id}', [DanhgiaController::class, 'getBySanPham']);
//getby kahch hàng
Route::get('/danhgia/khachhang/{id}', [DanhgiaController::class, 'getByKhachHang']);

//DON HÀNG
//GET
Route::get('/donhang', [DonhangController::class, 'get']);
//get one
Route::get('/donhang/{id}', [DonhangController::class, 'getOne']);
//add
Route::post('/donhang', [DonhangController::class, 'add']);
//update
Route::put('/donhang/{id}', [DonhangController::class, 'update']);
//delete
Route::delete('/donhang/{id}', [DonhangController::class, 'delete']);
//getby naydat
Route::get('/donhang/khachhang/{id}/{ngaydat}', [DonhangController::class, 'getByDate']);

//getby khach hàng
Route::get('/donhang/khachhang/{id}', [DonhangController::class, 'getByKhachHang']);