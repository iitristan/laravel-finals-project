<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use App\Models\Order;

return new class extends Migration
{
    public function up()
    {
        // First add the column as nullable
        Schema::table('orders', function (Blueprint $table) {
            $table->string('order_number')->nullable()->after('id');
        });

        // Generate order numbers for existing orders
        Order::whereNull('order_number')->each(function ($order) {
            $order->update([
                'order_number' => strtoupper(Str::random(8))
            ]);
        });

        // Make the column unique and non-nullable
        Schema::table('orders', function (Blueprint $table) {
            $table->string('order_number')->nullable(false)->unique()->change();
        });
    }

    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('order_number');
        });
    }
};