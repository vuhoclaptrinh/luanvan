<?php

namespace App\Http\Controllers;
use App\Models\Danhmuc;
use Illuminate\Auth\Events\Validated;
use Illuminate\Http\Request;
use PhpParser\Node\Stmt\TryCatch;

class DanhmucController extends Controller
{
    // get danh sách
    public function get()
    {
        try {
            $danhmuc = Danhmuc::all();
            return response()->json([
                'status' => true,
                'message' => 'Lấy thành công danh sách Danh mục',
                'data' => $danhmuc
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra :' . $e->getMessage()
            ], 500);
        }
    }

    //get one danh muc
    public function getOne($id)
    {
        $danhmuc = Danhmuc::Find($id);

        if (!$danhmuc) {
            return response()->json(['messsage' => 'khoong tim thay']);
        }
        return response()->json($danhmuc);
    }
    // add
    public function add(Request $request)
    {
        try {
            $request->validate([
                'ten_danh_muc' => 'required|string|max:255',
                'mo_ta' => 'required|string|max:255'
            ]);
            // tao
            $danhmuc = new Danhmuc();
            $danhmuc->ten_danh_muc = $request->ten_danh_muc;
            $danhmuc->mo_ta = $request->mo_ta;

            $danhmuc->save();
            return response()->json(
                [
                    'message' => 'thêm danh mục thành công ',
                    'data' => $danhmuc
                ],
                201
            );

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    //update(
    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'ten_danh_muc' => 'required|string|max:255',
                'mo_ta' => 'required|string|max:255'
            ]);
            // tim
            $danhmuc = Danhmuc::find($id);

            $danhmuc->update($request->only([
                'ten_danh_muc',
                'mo_ta'
            ]));
            return response()->json(
                [
                    'message' => 'caap nhat danh mục thành công ',
                    'data' => $danhmuc
                ],
                200
            );

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    //xoa
    public function delete($id)
    {
        try {
            $danhmuc = Danhmuc::find($id);
            if (!$danhmuc) {
                return response()->json(['message' => 'Khoong tim thay danh muc'], 404);

            }
            $danhmuc->delete();
            return response()->json(['message' => 'Xoá danh muc thành công'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi xoá danh muc',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}