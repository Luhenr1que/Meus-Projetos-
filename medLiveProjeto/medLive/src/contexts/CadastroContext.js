import React, { createContext, useContext, useState } from 'react';

const CadastroContext = createContext();

export const CadastroProvider = ({ children }) => {
  const [dadosCadastro, setDadosCadastro] = useState({
    // ETAPA 1 - Dados Pessoais
    nomePaciente: '',
    dataNascimento: '',
    emailPaciente: '',
    telefonePaciente: '',
    senhaPaciente: '',
    
    // ETAPA 2 - Endereço
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    
    // ETAPA 3 - Saúde (APENAS UMA VEZ)
    peso: '',
    altura: '',
    tipoSanguineo: ''
    // REMOVA completamente 'informacoesSaude'
  });

  const atualizarDados = (novosDados) => {
    setDadosCadastro(prev => ({
      ...prev,
      ...novosDados
    }));
  };

  const limparDados = () => {
    setDadosCadastro({
      nomePaciente: '',
      dataNascimento: '',
      emailPaciente: '',
      telefonePaciente: '',
      senhaPaciente: '',
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      peso: '',
      altura: '',
      tipoSanguineo: ''
    });
  };

  return (
    <CadastroContext.Provider value={{ dadosCadastro, atualizarDados, limparDados }}>
      {children}
    </CadastroContext.Provider>
  );
};

export const useCadastro = () => {
  const context = useContext(CadastroContext);
  if (!context) {
    throw new Error('useCadastro deve ser usado dentro de CadastroProvider');
  }
  return context;
};