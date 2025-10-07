<?php

use App\Http\Controllers\Api\PacienteController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// ✅ ROTAS PÚBLICAS
Route::post('/cadastrar', [PacienteController::class, 'cadastrar']);
Route::post('/login', [PacienteController::class, 'logar']);

Route::post('/pacientes/{id}/foto', [PacienteController::class, 'atualizarFoto'])->middleware('auth:sanctum');

// ✅ ADICIONAR ROTAS COMPATÍVEIS COM O REACT NATIVE
Route::post('/pacientes', [PacienteController::class, 'cadastrar']); // Alias para cadastrar
Route::post('/pacientes/login', [PacienteController::class, 'logar']); // Alias para login

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [PacienteController::class, 'logout']);
    Route::get('/perfil', [PacienteController::class, 'perfil']);
    
    // ✅ ADICIONAR ROTAS COMPATÍVEIS COM O REACT NATIVE (PROTEGIDAS)
    Route::post('/pacientes/logout', [PacienteController::class, 'logout']); // Alias para logout
    Route::get('/pacientes/perfil', [PacienteController::class, 'perfil']); // Alias para perfil
});