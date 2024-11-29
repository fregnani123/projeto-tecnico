import axios from 'axios';

// Função para registrar um usuário
export const registerUser = async (userName: string) => {
  if (!userName) {
    throw new Error('Por favor, insira o nome do usuário.');
  }

  const response = await axios.post('http://localhost:8080/api/newUser', { nome: userName });
  return response.data; // Retorna os dados da API
};

// Função para buscar a lista de usuários
export const fetchUsers = async () => {
  const response = await axios.get('http://localhost:8080/api/listaUser');
  
  if (response.data && Array.isArray(response.data.usuarios)) {
    return response.data.usuarios; // Retorna a lista de usuários
  } else {
    throw new Error('A resposta da API não contém a chave "usuarios" ou não é um array válido.');
  }
};
