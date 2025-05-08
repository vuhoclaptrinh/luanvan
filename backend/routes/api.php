<?php

use App\Http\Controllers\SanphamController;
use App\Models\Sanpham;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

//get all
Route::get('/sanpham', [SanphamController::class, 'get']);
//get one
Route::get('/sanpham/{id}', [SanphamController::class, 'getOne']);
//add
Route::post('/sanpham', [SanphamController::class, 'add']);
//delete
Route::delete('/sanpham/{id}', [SanphamController::class, 'delete']);



Route::get('/test', function () {
    return response()->json(['message' => 'API OK']);
});