import { NavigateFunction } from 'react-router-dom';
import React from 'react';

// Navegar para a página de histórico
export const goToHistory = (navigate: NavigateFunction) => {
  navigate('/historico');
};

// Resetar a viagem
export const resetViagem = (
  setIsDriversLoaded: React.Dispatch<React.SetStateAction<boolean>>,
  setIsMotoristaSelecionado: React.Dispatch<React.SetStateAction<boolean>>,
  setUserID: React.Dispatch<React.SetStateAction<string>>,
  setOrigin: React.Dispatch<React.SetStateAction<string>>,
  setDestination: React.Dispatch<React.SetStateAction<string>>
) => {
  // Resetar os estados
  setIsDriversLoaded(false);
  setIsMotoristaSelecionado(false);
  setUserID('');
  setOrigin('');
  setDestination('');
};

// Função para tratar o clique do botão
export const handleClick = (
  e: React.MouseEvent<HTMLButtonElement>, 
  setIsDriversLoaded: React.Dispatch<React.SetStateAction<boolean>>, 
  setIsMotoristaSelecionado: React.Dispatch<React.SetStateAction<boolean>>, 
  setUserID: React.Dispatch<React.SetStateAction<string>>, 
  setOrigin: React.Dispatch<React.SetStateAction<string>>, 
  setDestination: React.Dispatch<React.SetStateAction<string>>
) => {
  // Chamar a função resetViagem
  resetViagem(
    setIsDriversLoaded,
    setIsMotoristaSelecionado,
    setUserID,
    setOrigin,
    setDestination
  );
};
