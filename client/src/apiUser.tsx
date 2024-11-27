import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function Users() {
  // Estados para o cadastro de usuário
  const [userName, setUserName] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Função para enviar o cadastro do usuário
  const handleRegisterUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName) {
      alert('Por favor, insira o nome do usuário.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/newUser', {
        name: userName,
      });

      if (response.status === 201) {
        setIsSuccess(true);
        setMessage('Usuário cadastrado com sucesso!');
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage('Erro ao cadastrar usuário. Tente novamente.');
      console.error('Erro ao cadastrar usuário:', error);
    }
  };

}

export default Users;
