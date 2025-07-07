<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('chitietdonhang', function (Blueprint $table) {
            $table->unsignedBigInteger('bien_the_id')->after('san_pham_id')->nullable();

            // Nếu bảng liên kết là `bienthe`, dùng foreign key:
            $table->foreign('bien_the_id')->references('id')->on('bienthe')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('chitietdonhang', function (Blueprint $table) {
            $table->dropForeign(['bien_the_id']);
            $table->dropColumn('bien_the_id');
        });
    }
};