<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class VnpayController extends Controller
{

    private $vnp_TmnCode = "4QSF0RH6";
    private $vnp_HashSecret = "0BNF0LM8A0U1FHA73LGP963BFXXMCWXW";
    private $vnp_Url = " https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    private $vnp_ReturnUrl = "http://127.0.0.1:8000/api/vnpay-return";

    // Tạo URL thanh toán
    public function createPayment(Request $request)
    {
        $vnp_TxnRef = uniqid(); // mã đơn hàng
        $vnp_OrderInfo = 'Thanh toán đơn hàng test';
        $vnp_OrderType = 'billpayment';
        $vnp_Amount = $request->amount * 100;
        $vnp_Locale = 'vn';
        $vnpay_bankcode = $request->bank_code ?? 'NCB'; // Mã ngân hàng, mặc định là NCB nếu không có trong request
        $vnp_IpAddr = $request->ip();
        $vnp_CreateDate = date('YmdHis');

        $inputData = [
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $this->vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => $vnp_CreateDate,
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_Locale" => $vnp_Locale,
            "vnp_OrderInfo" => $vnp_OrderInfo,
            "vnp_OrderType" => $vnp_OrderType,
            "vnp_ReturnUrl" => $this->vnp_ReturnUrl,
            "vnp_TxnRef" => $vnp_TxnRef,
        ];

        ksort($inputData);
        $query = [];
        $hashData = '';
        foreach ($inputData as $key => $value) {
            $query[] = urlencode($key) . "=" . urlencode($value);
            $hashData .= urlencode($key) . "=" . urlencode($value) . "&";
        }

        $hashData = rtrim($hashData, '&');
        $secureHash = hash_hmac('sha512', $hashData, $this->vnp_HashSecret);

        $vnp_Url = $this->vnp_Url . "?" . implode('&', $query) . '&vnp_SecureHash=' . $secureHash;

        return response()->json(['payment_url' => $vnp_Url]);
    }

    // Xử lý kết quả trả về
    public function vnpayReturn(Request $request)
    {
        $inputData = $request->all();
        $vnp_SecureHash = $inputData['vnp_SecureHash'] ?? '';
        unset($inputData['vnp_SecureHash']);
        unset($inputData['vnp_SecureHashType']);

        ksort($inputData);
        $hashData = '';
        foreach ($inputData as $key => $value) {
            $hashData .= urlencode($key) . "=" . urlencode($value) . "&";
        }
        $hashData = rtrim($hashData, '&');
        $secureHash = hash_hmac('sha512', $hashData, $this->vnp_HashSecret);

        $responseCode = $request->vnp_ResponseCode;
        $transactionStatus = $request->vnp_TransactionStatus;

        if (
            $secureHash === $vnp_SecureHash &&
            $responseCode === '00' &&
            $transactionStatus === '00'
        ) {
            // ✅ Thanh toán thành công: redirect kèm đủ thông tin
            return redirect()->to('http://localhost:5173/vnpay-return?' . http_build_query($request->all()));
        } else {
            // ❌ Thất bại: redirect kèm thông báo lỗi
            return redirect()->to('http://localhost:5173/vnpay-return?vnp_ResponseCode=fail');
        }
    }

}