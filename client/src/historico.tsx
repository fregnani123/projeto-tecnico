import React from 'react';
import imgTablet from './assets/img/tablet.png';
import Shopper from './assets/img/lupa.png';
import { format } from 'date-fns';
import './App.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

// Interface para tipar os dados das viagens
interface Ride {
  id: string;
  date: string;
  driver: {
    name: string;
  };
  origin: string;
  destination: string;
  distance: number;
  duration: string | number;
  valor: number;
}

function Historico() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [driverId, setDriverId] = useState('');
  const [rides, setRides] = useState<Ride[]>([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
 

  const goHome = () => {
    navigate('/');
  };

  const handleFilter = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Construir a URL da API com os parâmetros
      const url = `http://localhost:8080/api/viagens?usuario_id=${userId}&motorista_id=${driverId}`;

      // Fazer a requisição à API
      const response = await axios.get(url);
      const data = response.data;

      if (data && data.rides) {
        console.log('Resposta da API Histórico de viagens:', data);

        // Ordenar as viagens pela data (se necessário)
        const sortedRides = data.rides.sort((a: Ride, b: Ride) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime(); // Ordenação decrescente
        });

        // Atualizar o estado com as viagens ordenadas
        setRides(sortedRides);
      } else {
        setRides([]);
      }
    } catch (err: any) {
      console.error('Erro ao buscar os dados:', err);
      setError('Erro ao buscar os dados do servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy - HH:mm:ss');
  };

  const formatDuration = (seconds: string | number): string => {
    const parsedSeconds = parseFloat(seconds.toString());

    if (isNaN(parsedSeconds) || parsedSeconds < 0) {
      return 'Duração inválida';
    }

    const hours = Math.floor(parsedSeconds / 3600);
    const minutes = Math.floor((parsedSeconds % 3600) / 60);
    const remainingSeconds = parsedSeconds % 60;

    return `${hours}h ${minutes}m ${remainingSeconds.toFixed(0)}s`;
  };

  const motoristas = [
    {id:1, nome: "Homer Simpson" },
    {id:2, nome: "Dominic Toretto" },
    {id:3, nome: "James Bond" },
    {id:4,  nome: "Mario Andretti" },
    {id:5, nome: "Vincent Vega" },
    {id:6, nome: "Mad Max" },
    {id:7, nome: "Lightning McQueen" },
    {id:8, nome: "Elwood Blues" }
  ];

  return (
    <div className="container">
       <div className='div-motorista'><h2>Lista de Motorista Cadastrados</h2>
       <ul>
      {motoristas.map((motorista, index) => (
        <li key={index}>Id: {motorista.id} - {motorista.nome}</li>
      ))}
    </ul>
       </div>
      <img className="img-tablet" src={imgTablet} alt="Tablet Background" />
      <div className="div-form">
        <header>
          <span className="text-historico">Histórico</span>
          <button className="btn-home" onClick={goHome}>Início</button>
        </header>

        <form className="form" onSubmit={handleFilter}>
          <input
            className="input-id-historico"
            type="number"
            placeholder="ID do Usuário"
            value={userId}
            onChange={(e) => setUserId(e.target.value.replace(/\D/, ''))} 
            required
          />

          <input
            className="select-motorista"
            type="number"
            placeholder="ID do Motorista"
            value={driverId}
            onChange={(e) => setDriverId(e.target.value.replace(/\D/, ''))} 
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Carregando...' : 'Aplicar Filtro'}
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}

        <div className="rides-list">
          <h2>Lista de Viagens</h2>
          {rides.length > 0 ? (
            <ul className="ul-list">
              {rides.map((ride) => (
                <li className="list-li" key={ride.id}>
                  <p>Data e Hora: {formatDate(ride.date)}</p>
                  <p>Motorista: {ride.driver.name}</p>
                  <p>Origem: {ride.origin}</p>
                  <p>Destino: {ride.destination}</p>
                  <p>Distância: {ride.distance} km</p>
                  <p>Tempo: {formatDuration(ride.duration)}</p>
                  <p>Valor: R$ {Number(ride.valor).toFixed(2)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="ul-list">
              <img className="lupa" src={Shopper} alt="Shopper" />
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Historico;




