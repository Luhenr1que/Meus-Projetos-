<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;

class paciente extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'tb_paciente';
    protected $primaryKey = 'idPaciente';
    protected $hidden = ['senhaPaciente'];
    public $timestamps = true;
    protected $fillable = [
        'nomePaciente'
        ,'emailPaciente'
        ,'senhaPaciente'
        ,'status'
    ];

    //Muda a coluna de identificação do auth
    public function getAuthIdentifierName()
    {
        return 'emailPaciente';
    }
    //Muda o valor q password recebe no auth
    public function getAuthPassword()
    {
        return $this->senhaPaciente;
    }
}
