<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Paciente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class PacienteController extends Controller
{
    public function cadastrar(Request $request)
    {
        set_time_limit(120);
        
        $request->validate([
            // Etapa 1 - Dados Pessoais
            'nomePaciente' => 'required|string|max:255',
            'dataNascimento' => 'required|date',
            'emailPaciente' => 'required|email|unique:tb_paciente,emailPaciente',
            'telefonePaciente' => 'required|string|max:20',
            'senhaPaciente' => 'required|string|min:4',
            
            // Etapa 2 - Endereço
            'cep' => 'required|string|max:10',
            'logradouro' => 'required|string|max:255',
            'numero' => 'required|string|max:10',
            'complemento' => 'nullable|string|max:100',
            'bairro' => 'required|string|max:100',
            'cidade' => 'required|string|max:100',
            'estado' => 'required|string|size:2',
            
            // Etapa 3 - Dados Médicos
            'peso' => 'nullable|numeric|between:0,300',
            'altura' => 'nullable|numeric|between:0,3',
            'tipoSanguineo' => 'nullable|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
            
            // Etapa 4 - Foto
            'fotoPerfil' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // máximo 2MB
            
        ], [
            // Dados Pessoais
            'nomePaciente.required' => 'Campo nome obrigatório.',
            'nomePaciente.string' => 'O nome deve ser um texto válido.',
            'nomePaciente.max' => 'O nome não pode ter mais que 255 caracteres.',
            
            'dataNascimento.required' => 'Data de nascimento obrigatória.',
            'dataNascimento.date' => 'Data de nascimento inválida.',
            
            'emailPaciente.required' => 'Campo e-mail obrigatório.',
            'emailPaciente.email' => 'Insira um email válido.',
            'emailPaciente.unique' => 'Este e-mail já está cadastrado.',
            
            'telefonePaciente.required' => 'Telefone obrigatório.',
            
            'senhaPaciente.required' => 'Campo senha obrigatório.',
            'senhaPaciente.string' => 'A senha deve ser um texto.',
            'senhaPaciente.min' => 'A senha deve ter pelo menos 4 caracteres.',
            
            // Endereço
            'cep.required' => 'CEP obrigatório.',
            'logradouro.required' => 'Logradouro obrigatório.',
            'numero.required' => 'Número obrigatório.',
            'bairro.required' => 'Bairro obrigatório.',
            'cidade.required' => 'Cidade obrigatória.',
            'estado.required' => 'Estado obrigatório.',
            'estado.size' => 'Estado deve ter 2 caracteres.',
            
            // Dados Médicos
            'peso.numeric' => 'Peso deve ser um número.',
            'peso.between' => 'Peso deve estar entre 0 e 300 kg.',
            'altura.numeric' => 'Altura deve ser um número.',
            'altura.between' => 'Altura deve estar entre 0 e 3 metros.',
            'tipoSanguineo.in' => 'Tipo sanguíneo inválido.',
            
            // Foto
            'fotoPerfil.image' => 'Arquivo enviado não é uma imagem válida.',
            'fotoPerfil.mimes' => 'A imagem deve ser jpeg, png, jpg ou gif.',
            'fotoPerfil.max' => 'A imagem não pode ter mais que 2MB.',
        ]);

        $paciente = new Paciente();
        
        // Etapa 1 - Dados Pessoais
        $paciente->nomePaciente = $request->input('nomePaciente');
        $paciente->dataNascimento = $request->input('dataNascimento');
        $paciente->emailPaciente = $request->input('emailPaciente');
        $paciente->telefonePaciente = $request->input('telefonePaciente');
        $paciente->senhaPaciente = bcrypt($request->input('senhaPaciente'));
        
        // Etapa 2 - Endereço
        $paciente->cep = $request->input('cep');
        $paciente->logradouro = $request->input('logradouro');
        $paciente->numero = $request->input('numero');
        $paciente->complemento = $request->input('complemento');
        $paciente->bairro = $request->input('bairro');
        $paciente->cidade = $request->input('cidade');
        $paciente->estado = $request->input('estado');
        
        // Etapa 3 - Dados Médicos
        $paciente->peso = $request->input('peso');
        $paciente->altura = $request->input('altura');
        $paciente->tipoSanguineo = $request->input('tipoSanguineo');
        
        // Etapa 4 - Foto (se enviada)
        if ($request->hasFile('fotoPerfil') && $request->file('fotoPerfil')->isValid()) {
            $foto = $request->file('fotoPerfil');
            $filename = 'perfil_' . time() . '_' . uniqid() . '.' . $foto->getClientOriginalExtension();
            $path = $foto->storeAs('perfis', $filename, 'public');
            $paciente->fotoPerfil = $path;
        }
        
        $paciente->status = 'ativo';
        $paciente->save();

        return response()->json([
            'success' => true,
            'message' => 'Paciente cadastrado com sucesso!',
            'paciente' => $paciente
        ], 201);
    }

    public function logar(Request $request)
    {
        set_time_limit(120);
        $request->validate([
            'emailPaciente' => 'required|email',
            'senhaPaciente' => 'required|min:4'
        ], [
            'emailPaciente.required' => 'Campo email obrigatório.',
            'emailPaciente.email' => 'Insira um email válido.',
            'senhaPaciente.required' => 'Campo senha obrigatório',
            'senhaPaciente.min' => 'Senha deve ter mínimo de 4 dígitos'
        ]);

        $paciente = Paciente::where('emailPaciente', $request->emailPaciente)->first();

        if (!$paciente) {
            return response()->json(['error' => 'Usuário não encontrado'], 401);
        }
        
        if (!Hash::check($request->senhaPaciente, $paciente->senhaPaciente)) {
            return response()->json(['error' => 'Senha incorreta'], 401);
        }

        $token = $paciente->createToken('paciente_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'paciente' => $paciente,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        set_time_limit(120);
        $request->user()->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout realizado com sucesso'
        ]);
    }

    public function perfil(Request $request)
    {
        set_time_limit(120);
        return response()->json([
            'success' => true,
            'paciente' => $request->user()
        ]);
    }
    public function atualizarFoto(Request $request, $id)
{
    $request->validate([
        'fotoPerfil' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
    ], [
        'fotoPerfil.required' => 'Nenhuma imagem enviada.',
        'fotoPerfil.image' => 'Arquivo enviado não é uma imagem válida.',
        'fotoPerfil.mimes' => 'A imagem deve ser jpeg, png, jpg ou gif.',
        'fotoPerfil.max' => 'A imagem não pode ter mais que 2MB.',
    ]);

    $paciente = Paciente::find($id);
    if (!$paciente) {
        return response()->json(['error' => 'Paciente não encontrado'], 404);
    }

    if ($request->hasFile('fotoPerfil') && $request->file('fotoPerfil')->isValid()) {
        $foto = $request->file('fotoPerfil');
        $filename = 'perfil_' . time() . '_' . uniqid() . '.' . $foto->getClientOriginalExtension();
        $path = $foto->storeAs('perfis', $filename, 'public');
        $paciente->fotoPerfil = $path;
        $paciente->save();
    }

    return response()->json([
        'success' => true,
        'message' => 'Foto atualizada com sucesso!',
        'paciente' => $paciente
    ]);
}
}
