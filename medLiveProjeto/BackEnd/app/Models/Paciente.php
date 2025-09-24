<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Paciente extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $table = 'tb_paciente'; // Mudei para 'pacientes' (sem underscore)
    protected $primaryKey = 'idPaciente';
    
    protected $hidden = ['senhaPaciente'];
    public $timestamps = true;
    
  protected $fillable = [
    'nomePaciente',
    'dataNascimento',
    'emailPaciente', 
    'telefonePaciente',
    'senhaPaciente',
    'cep',
    'logradouro',
    'numero',
    'complemento',
    'bairro',
    'cidade',
    'estado',
    'peso',
    'altura',
    'tipoSanguineo',
    'fotoPerfil',
    'status'
];

    protected $casts = [
        'dataNascimento' => 'date',
        'peso' => 'decimal:2',
        'altura' => 'decimal:2',
    ];

    // Muda a coluna de identificação do auth
    public function getAuthIdentifierName()
    {
        return 'emailPaciente';
    }
    
    // Muda o valor que password recebe no auth
    public function getAuthPassword()
    {
        return $this->senhaPaciente;
    }
}