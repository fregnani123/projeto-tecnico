declare module "*.png" {
    const value: string;
    export default value;
  }
  
declare global {
  interface Window {
    initMap: any; // Ajuste o tipo conforme necessário
  }
}

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

declare global {
  interface Window {
    google: any; // Declaração para acessar o objeto google
  }
}
