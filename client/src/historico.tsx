import React from 'react';
import imgTablet from './assets/img/tablet.png';
import Shopper from './assets/img/lupa.png';
import { format } from 'date-fns'
import './App.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

function Historico() {
    const navigate = useNavigate();
    const [userId, setUserId] = useState('');
    const [driverId, setDriverId] = useState('');
    const [rides, setRides] = useState<any[]>([]);
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
                console.log('Resposta da API:', data);

                // Atualizar o estado com os dados recebidos
                setRides(data.rides);
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

    const formatDate = (dateString:Date) => { const date = new Date(dateString); return format(date, 'dd/MM/yyyy - HH:mm:ss');}

    function formatDuration(seconds: any): string {
        // Tente converter para número, se não for um
        const parsedSeconds = parseFloat(seconds);

        if (isNaN(parsedSeconds) || parsedSeconds < 0) {
            return "Invalid duration";
        }

        const hours = Math.floor(parsedSeconds / 3600);
        const minutes = Math.floor((parsedSeconds % 3600) / 60);
        const remainingSeconds = parsedSeconds % 60;

        return `${hours}h ${minutes}m ${remainingSeconds.toFixed(0)}s`;
    }

    return (
        <div className="container">
            <img className="img-tablet" src={imgTablet} alt="Tablet Background" />
            <div className="div-form">
                <header>
                    <span className="text-historico">Histórico</span>
                    <button className="btn-home" onClick={goHome}>Início</button>
                </header>

                <form className="form" onSubmit={handleFilter}>
                    <input
                        className="input-id-historico"
                        type="text"
                        placeholder="ID do Usuário"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                    />
                    <input
                        className="select-motorista"
                        type="text"
                        placeholder="ID do Motorista"
                        value={driverId}
                        onChange={(e) => setDriverId(e.target.value)}
                    >
                    </input>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Carregando...' : 'Aplicar Filtro'}
                    </button>
                </form>

                {error && <p className="error-message">{error}</p>}

                <div className="rides-list">
                    <h2>Lista de Viagens</h2>
                    {rides.length > 0 ? (
                        <ul className="ul-list">
                            {rides.map((ride: any) => (
                                <li className="list-li" key={ride.id}>
                                    <p>Data e Hora: {formatDate(ride.date)}</p>
                                    <p>Motorista:  {ride.driver.name}</p>
                                    
                                    <p>Origem: {ride.origin}</p>
                                    <p>Destino: {ride.destination}</p>
                                    <p>Distância: {ride.distance} km</p>
                                    <p>Tempo: {formatDuration(ride.duration)}</p>
                                    <p>Valor: R$ {ride.valor.toFixed(2)}</p>
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
