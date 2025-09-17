<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Paciente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class PacienteController extends Controller
{
    public function cadastrar(Request $request)
    {
        set_time_limit(120);
        $request->validate([
            'nomePaciente' => 'required|string|max:255',
            'emailPaciente' => 'required|email|unique:tb_paciente,emailPaciente',
            'senhaPaciente' => 'required|string|min:4',
        ], [
            // nomePaciente
            'nomePaciente.required' => 'Campo nome obrigatório.',
            'nomePaciente.string' => 'O nome deve ser um texto válido.',
            'nomePaciente.max' => 'O nome não pode ter mais que 255 caracteres.',

            // emailPaciente
            'emailPaciente.required' => 'Campo e-mail obrigatório.',
            'emailPaciente.email' => 'Insira um email válido.',
            'emailPaciente.unique' => 'Este e-mail já está cadastrado.',

            // senhaPaciente
            'senhaPaciente.required' => 'Campo senha obrigatório.',
            'senhaPaciente.string' => 'A senha deve ser um texto.',
            'senhaPaciente.min' => 'A senha deve ter pelo menos 4 caracteres.',
        ]);

        $paciente = new Paciente();
        $paciente->nomePaciente = $request->input('nomePaciente');
        $paciente->emailPaciente = $request->input('emailPaciente');
        $paciente->senhaPaciente = bcrypt($request->input('senhaPaciente'));
        $paciente->status = 'ativo';

        $paciente->save();

        return response()->json([
            'success' => true,
            'message' => 'Paciente cadastrado com sucesso!',
        ], 201);
    }

    public function logar(Request $request)
    {
        set_time_limit(120);
        $request->validate([
            'emailPaciente' => 'required|email',
            'senhaPaciente' => 'required|min:6'
        ], [
            // emailPaciente
            'emailPaciente.required' => 'Campo email obrigatório.',
            'emailPaciente.email' => 'Insira um email válido.',

            // senhaPaciente
            'senhaPaciente.required' => 'Campo senha obrigatório',
            'senhaPaciente.min' => 'Senha tem de ter minímo de 4 digitos'
        ]);

        $paciente = Paciente::where('emailPaciente', $request->emailPaciente)->first();

        if (!$paciente) {
            return response()->json(['error' => 'Usário não encontrado'], 401);
        }
        if (!Hash::check($request->senhaPaciente, $paciente->senhaPaciente)) {
            return response()->json(['error' => 'Senha incorreta'], 401);
        }

        $token = $paciente->createToken('paciente_token')->plainTextToken;

        return response()->json([
            'paciente' => $paciente,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        set_time_limit(120);
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Logout realizado']);
    }

    public function perfil(Request $request)
    {
        set_time_limit(120);
        return response()->json($request->user());
    }
}
