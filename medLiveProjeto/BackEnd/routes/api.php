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

// Rotas do Paciente
Route::post('/paciente/cadastrar', [PacienteController::class, 'cadastrar']);
Route::post('/paciente/logar', [PacienteController::class, 'logar']);

// Rotas protegidas (requerem autenticação)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/paciente/logout', [PacienteController::class, 'logout']);
    Route::get('/paciente/perfil', [PacienteController::class, 'perfil']);
    
    // Novas rotas para gerenciamento do perfil
    Route::get('/paciente/{id}', [PacienteController::class, 'obterPaciente']);
    Route::put('/paciente/{id}', [PacienteController::class, 'atualizarPaciente']);
    Route::post('/paciente/{id}/foto', [PacienteController::class, 'atualizarFoto']);
    Route::delete('/paciente/{id}/foto', [PacienteController::class, 'deletarFoto']);
});