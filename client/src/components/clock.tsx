import React, { useState, useEffect } from 'react';

function Clock() {
  // Definindo o estado de currentTime dentro do componente
  const [currentTime, setCurrentTime] = useState(new Date());

  // Atualizar o tempo atual a cada segundo
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer); // Limpar o intervalo ao desmontar o componente
  }, []);

  // Formatação da data
  const formatDate = (date: Date): string => {
    return date.toLocaleString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return <span>{formatDate(currentTime)}</span>;
}

export default Clock;
