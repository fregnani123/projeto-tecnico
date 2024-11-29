import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import imgTablet from './assets/img/tablet.png';
import Shopper from './assets/img/shopper.png';
import Clock from './components/clock';
import './App.css';
import { registerUser, fetchUsers } from './userService';
import { resetViagem } from './navigationUtils';
import { handleClick } from './navigationUtils';


function Home() {

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [mapUrl, setMapUrl] = useState('');
  const [isDriversLoaded, setIsDriversLoaded] = useState(false);
  const [isMotoristaSelecionado, setIsMotoristaSelecionado] = useState(false);
  const [userID, setUserID] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [distancia, setDistancia] = useState(0);
  const [tempo, setTempo] = useState<Tempo>({ horas: 0, minutos: 0, segundos: 0 });
  const [userName, setUserName] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [apiKey, setApiKey] = useState('');
  const [isApiKeyLoaded, setIsApiKeyLoaded] = useState(false);

  const navigate = useNavigate();

  // Função para obter a chave da API
  const getApiKey = async () => {
    const url = 'http://localhost:8080/api/acessMap';
    try {
      const response = await axios.get(url);
      const data = response.data;
      setApiKey(data.apiKey);
      setIsApiKeyLoaded(true); // Indicando que a chave foi carregada
      console.log(data);
    } catch (err) {
      console.error('Error fetching API key:', err);
    }
  };

  useEffect(() => {
    getApiKey();
  }, []);

  // Função para carregar a API do Google Maps
  useEffect(() => {
    if (isApiKeyLoaded) {
      const loadGoogleMapsAPI = () => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
          const autocompleteOrigin = new window.google.maps.places.Autocomplete(
            document.getElementById('origin') as HTMLInputElement,
            { types: ['address'] }
          );
          const autocompleteDestination = new window.google.maps.places.Autocomplete(
            document.getElementById('destination') as HTMLInputElement,
            { types: ['address'] }
          );

          autocompleteOrigin.addListener('place_changed', () => {
            const place = autocompleteOrigin.getPlace();
            if (place && place.formatted_address) {
              setOrigin(place.formatted_address);
            }
          });

          autocompleteDestination.addListener('place_changed', () => {
            const place = autocompleteDestination.getPlace();
            if (place && place.formatted_address) {
              setDestination(place.formatted_address);
            }
          });
        };
      };

      loadGoogleMapsAPI();
    }
  }, [isApiKeyLoaded, apiKey]);


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

      const { motoristas, distancia, tempo, apiKey } = response.data;
      setDrivers(motoristas);
      setDistancia(distancia);

      const horas = Math.floor(tempo / 3600);
      const minutos = Math.floor((tempo % 3600) / 60);
      const segundos = tempo % 60;

      // Atualiza o estado com horas, minutos e segundos
      setTempo({ horas, minutos, segundos });

      const encodedOrigin = encodeURIComponent(origin);
      const encodedDestination = encodeURIComponent(destination);
      const url = `https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${encodedOrigin}&destination=${encodedDestination}`;
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

    // Encontre o motorista selecionado
    const motoristaSelecionado = drivers.find((driver) => driver.id === driverId);

    if (!motoristaSelecionado) {
      alert('Motorista não encontrado.');
      return;
    }

    const viagemData = {
      usuario_id: userID,
      motorista_id: driverId,
      origem: origin,
      destino: destination,
      distancia: distancia,
      duracao: tempo.horas * 3600 + tempo.minutos * 60 + tempo.segundos,
      valor: motoristaSelecionado.custoCorrida,
      data: new Date().toISOString(),
    };

    try {
      const response = await axios.post('http://localhost:8080/api/viagens', viagemData);
      console.log('Viagem confirmada:', response.data);

      // Atualizar o estado para exibir o div de confirmação
      setIsMotoristaSelecionado(true);
    } catch (error) {
      console.error('Erro ao confirmar a viagem:', error);
      alert('Erro ao confirmar a viagem. Tente novamente.');
    }
  };

  const handleRegisterUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await registerUser(userName);
      setUserID(data.id);
      setMessage('Usuário cadastrado com sucesso!');
      setIsSuccess(true);
      setUserName('');
      const updatedUsers = await fetchUsers();
      setUsers(updatedUsers);
    } catch (error: any) {
      setMessage(error.message || 'Erro ao cadastrar o usuário.');
      setIsSuccess(false);
    }
  };

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersList = await fetchUsers();
        setUsers(usersList);
      } catch (error) {
        console.error('Erro ao carregar os usuários:', error);
      }
    };
    loadUsers();
  }, []);

  return (
    <div className="container">
      <img className="img-tablet" src={imgTablet} alt="Tablet Background" />
      <div className="div-form">
        <div className="container-users">
          <div className="usurs">
            <h5>Cadastro Usuários (P/Testes)</h5>
            <form className="form-users" onSubmit={handleRegisterUser}> {/* Associar o evento onSubmit */}
              <input className="name-input"
                type="text"
                placeholder="Digite o nome do usuário"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
              <button className="btn-user" type="submit">Cadastrar</button>
            </form>
            {message && (
              <div className={isSuccess ? 'success-message' : 'error-message'}>
                {message}
              </div>
            )}
            <div>
              <ul className='userCadastrados'>
                <li>Usuários para Teste</li>
                {users.map((user) => (
                  <li key={user.id}>
                    ID: {user.id} - Nome: {user.nome}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <header>
          <span className="text-inicio">Início</span>
          <button className="btn-historico" onClick={() => navigate('/historico')}>Histórico</button>
        </header>
        <h1>Solicitação de Viagem</h1>
        <form className="form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Digite o ID do usuário"
            value={userID}
            onChange={(e) => {
              const onlyNumbers = e.target.value.replace(/[^0-9]/g, '');
              setUserID(onlyNumbers);
            }}
            required
          />
          <input
            id="origin"
            type="text"
            placeholder="Endereço de origem"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            required
          />
          <input
            id="destination"
            type="text"
            placeholder="Endereço de destino"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />
          <button type="submit" className="btn-submit">Calcular Rota</button>
        </form>
        <div className="img-container">
          <img className="shopper" src={Shopper} alt="Shopper" />
        </div>
        <footer>
          <Clock />
        </footer>
      </div>
      {isDriversLoaded && (
        <div className={`drivers-container ${isDriversLoaded ? 'visible' : ''}`}>
          <div className={isMotoristaSelecionado ? 'div-viagem-confirmada' : 'div-viagem-confirmada-none'} >
            <div>
              {isMotoristaSelecionado && (
                <div className="confirmation">
                  <h2 className='final'>Viagem Confirmada!</h2>
                  <p>Motorista: {drivers[0].nome}</p>
                  <p>Origem: {origin}</p>
                  <p>Destino: {destination}</p>
                  <p>Distância: {distancia} km</p>
                  <p>Tempo Estimado: {tempo.horas}h {tempo.minutos}m {tempo.segundos}s</p>
                  <h2 className='frase-final'>Desejamos uma excelente viagem.</h2>
                  <img className="img-shopper-iniciar" src={Shopper} alt="Shopper" />
                </div>
              )}
              <button className="nova-viagem" onClick={(e) => handleClick(e, setIsDriversLoaded, setIsMotoristaSelecionado, setUserID, setOrigin, setDestination)}>
                Início
              </button>

            </div></div>
          {mapUrl && (
            <div className="map-container">
              <p className='p-reset'><span className='span-motorista'>Selecionar Motorista</span><button className='btn-inicio-map' onClick={(e) => handleClick(e, setIsDriversLoaded, setIsMotoristaSelecionado, setUserID, setOrigin, setDestination)}>
               Início
              </button></p>
              <span>Mapa com a Rota</span>
              <iframe
                title="Mapa com Rota"
                src={mapUrl}
                width="100%"
                height="260"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          )}
          <h3>Motoristas Disponíveis</h3>
          <ul className="drivers-list">
            {drivers.map((driver) => (
              <li className="driver-card" key={driver.id}>
                <div>
                  <h3>{driver.nome}</h3>
                  <p>{driver.descricao}</p>
                  <p>Carro: {driver.carro}</p>
                  <p>Avaliação: {driver.avaliacao} estrelas</p>
                  <p>Custo: R$ {Number(driver.custoCorrida).toFixed(2)}</p>
                  <span className='confirmar'><button className='btn-escolher ' onClick={() => handleSubmiRides(driver.id)}>
                    Confirmar viagem
                  </button></span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}


    </div>
  );
}

export default Home;
