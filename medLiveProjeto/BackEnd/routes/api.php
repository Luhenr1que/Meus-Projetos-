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

Route::post('/cadastrar', [PacienteController::class, 'cadastrar']);
Route::post('/login', [PacienteController::class, 'logar']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [PacienteController::class, 'logout']);
    Route::get('/perfil', [PacienteController::class, 'perfil']);
});
