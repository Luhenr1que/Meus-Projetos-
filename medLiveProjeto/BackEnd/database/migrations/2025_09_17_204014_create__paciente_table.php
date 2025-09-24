<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('tb_paciente', function (Blueprint $table) {
            // Dados básicos
            $table->id('idPaciente');
            $table->string('nomePaciente');
            $table->date('dataNascimento')->nullable();
            $table->string('emailPaciente')->unique();
            $table->string('telefonePaciente')->nullable();
            $table->string('senhaPaciente');
            
            // Endereço
            $table->string('cep')->nullable();
            $table->string('logradouro')->nullable();
            $table->string('numero')->nullable();
            $table->string('complemento')->nullable();
            $table->string('bairro')->nullable();
            $table->string('cidade')->nullable();
            $table->string('estado', 2)->nullable();
            
            // Dados médicos
            $table->decimal('peso', 5, 2)->nullable()->comment('Peso em kg');
            $table->decimal('altura', 3, 2)->nullable()->comment('Altura em metros');
            $table->enum('tipoSanguineo', ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])->nullable();
            
            // Foto de perfil
            $table->longText('fotoPerfil')->nullable();
            
            // Status e timestamps
            $table->enum('status', ['ativo', 'inativo', 'pendente'])->default('ativo');
            $table->timestamps();
            
            // Índices
            $table->index('emailPaciente');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pacientes');
    }
};