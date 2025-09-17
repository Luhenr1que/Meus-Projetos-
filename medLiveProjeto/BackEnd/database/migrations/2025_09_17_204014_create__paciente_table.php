<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('_paciente', function (Blueprint $table) {
            $table->id();
            $table->timestamps();  $table -> id("idPaciente");
            $table -> string("nomePaciente")->unique()->nullable();
            $table -> string("emailPaciente")->unique()->nullable();
            $table -> string("senhaPaciente");
            $table -> string("status")->nullable();
            $table -> timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('_paciente');
    }
};
