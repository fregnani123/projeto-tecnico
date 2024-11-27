import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import imgTablet from './assets/img/tablet.png';
import Shopper from './assets/img/shopper.png';
import './App.css';

interface Driver {
  id: number;
  nome: string;
  descricao: string;
  carro: string;
  avaliacao: number;
  custoCorrida: number;
}

interface Tempo {
  horas: number;
  minutos: number;
  segundos: number;
}

function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [mapUrl, setMapUrl] = useState('');
  const [isDriversLoaded, setIsDriversLoaded] = useState(false);
  const [isMotoristaSelecionado, setIsMotoristaSelecionado] = useState(false);

  const [userID, setUserID] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [distancia, setDistancia] = useState(0);
  const [tempo, setTempo] = useState<Tempo>({ horas: 0, minutos: 0, segundos: 0 });
  const [custoCorrida, setCustoCorrida] = useState(0);
  const navigate = useNavigate();

  // Atualizar o tempo atual a cada segundo
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
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

  // Enviar a solicitação de rota para a API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userID || !origin || !destination) {
      alert('Por favor, preencha a origem e o destino.');
      return;
    }

    if (origin === destination) {
      alert('A origem não pode ser igual ao destino.');
      return;
    }

    // Chamada para a API
    try {
      const response = await axios.post('http://localhost:8080/api/calcular-rota', {
        origem: origin,
        destino: destination,
      });

      console.log('Resposta da API:', response.data);

      if (!response.data || !response.data.motoristas || response.data.motoristas.length === 0) {
        alert('Nenhum motorista disponível ou dados da API incompletos.');
        return;
      }

      const { motoristas, distancia, tempo, apiKey } = response.data
      setDrivers(motoristas);
      setDistancia(distancia);
     

      const horas = Math.floor(tempo / 3600); 
      const minutos = Math.floor((tempo % 3600) / 60);
      const segundos = tempo % 60; 

      // Atualiza o estado com horas, minutos e segundos
      setTempo({ horas, minutos, segundos });

      // Calcular custo total com base na distância
      const custoTotal = distancia * 2; // Ajuste o cálculo conforme necessário
      setCustoCorrida(custoTotal);

      const encodedOrigin = encodeURIComponent(origin); const encodedDestination = encodeURIComponent(destination); const url = `https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${encodedOrigin}&destination=${encodedDestination}`;
      
      setMapUrl(url);

      setIsDriversLoaded(true);

    } catch (error) {
      console.error('Erro ao calcular a rota:', error);
      alert('Erro ao calcular a rota. Verifique os dados e tente novamente.');
    }
  };

  // Enviar a solicitação da viagem
  const handleSubmiRides = async (driverId: number) => {
    if (!userID || !origin || !destination) {
      alert('Por favor, preencha todos os campos antes de escolher o motorista.');
      return;
    }

    const viagemData = {
      usuario_id: userID,
      motorista_id: driverId,
      origem: origin,
      destino: destination,
      distancia: distancia,
      duracao: tempo.horas * 3600 + tempo.minutos * 60 + tempo.segundos, // Convertendo para segundos
      valor: custoCorrida,
      data: new Date().toISOString(),
    };

    try {
      const response = await axios.post('http://localhost:8080/api/viagens', viagemData);
      console.log('Viagem confirmada:', response.data);
         // Atualizar o estado para exibir o div
             setIsMotoristaSelecionado(true);
  
    } catch (error) {
      console.error('Erro ao confirmar a viagem:', error);
      alert('Erro ao confirmar a viagem. Tente novamente.');
    }
  };

  // Navegar para a página de histórico
  const goToHistory = () => {
    navigate('/historico');
  };

  const resetViagem = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDriversLoaded(false);
    setIsMotoristaSelecionado(false);
    setUserID('');
    setOrigin('');
    setDestination('')
  }


  return (
    <div className="container">
      <img className="img-tablet" src={imgTablet} alt="Tablet Background" />
      <div className="div-form">
        <header>
          <span className="text-inicio">Início</span>
          <button className="btn-historico" onClick={goToHistory}>
            Histórico
          </button>
        </header>
        <h1>Solicitação de Viagem</h1>
        <form className="form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Digite o ID do usuário"
            value={userID}
            onChange={(e) => setUserID(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Endereço de Origem"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Endereço de Destino"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />
          <button type="submit">Estimar Viagem</button>
        </form>
        <div className="img-container">
          <img className="shopper" src={Shopper} alt="Shopper" />
        </div>
        <footer>
          <span>{formatDate(currentTime)}</span>
        </footer>
      </div>

      <div className={`drivers-container ${isDriversLoaded ? 'visible' : ''}`}>
        <div className={isMotoristaSelecionado ? 'div-viagem-confirmada': 'div-viagem-confirmada-none'} >
        <img className="img-shopper-iniciar" src={Shopper} alt="Shopper" /><div><h1 className='frase-final'>Viagem confirmada. Desejamos uma excelente viagem.</h1><button className='nova-viagem' onClick={resetViagem}>Início</button></div></div>
        {mapUrl && (
          <div className="map-container">
            <p className='p-reset'><span className='span-motorista'>Selecionar Motorista</span><button onClick={resetViagem} className='reset'>Início</button></p>
            <span>Mapa com a Rota</span>
            <iframe
              title="Mapa com Rota"
              src={mapUrl}
              width="100%"
              height="280"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </div>
        )}
        <h4>Escolha um Motorista</h4>
        {drivers.length > 0 ? (
          <ul className="drivers-list">
            {drivers.map((driver) => (
              <li className="driver-card" key={driver.id}>
                <p className="nome"><span> Id: {driver.id} - </span>{driver.nome}</p>
                <p>{driver.descricao}</p>
                <p><strong>Veículo:</strong> {driver.carro}</p>
                <p><strong>Avaliação:</strong> {driver.avaliacao}/5</p>
                <p><strong>Distância:</strong> {distancia.toFixed(2)} km</p>
                <p><strong>Tempo Aproximado:</strong> {tempo.horas} horas, {tempo.minutos} minutos e {tempo.segundos} segundos</p>
                <p><strong>Valor da Viagem:</strong> R$ {custoCorrida.toFixed(2)}</p>
                <span className="spanBtn">
                  <button className="btn-escolher" onClick={() => handleSubmiRides(driver.id)}>
                    Escolher
                  </button>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhum motorista disponível.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
