
# Projeto Técnico - Teste para Vaga de Desenvolvedor
<img src="https://github.com/user-attachments/assets/5186c460-fb8e-4e4d-ab15-f788ca03565e" alt="Captura de tela" width="300" /><br/>

## Introdução

Este é um projeto técnico desenvolvido como parte de um processo seletivo para a vaga de desenvolvedor. O projeto consiste em uma aplicação para transporte particular, implementada utilizando diversas tecnologias modernas.

## Tecnologias Utilizadas

- **Frontend:** React.js com Vite
- **Backend:** Node.js com Express
- **Banco de Dados:** MySQL3
- **Containerização:** Docker com Docker Compose
- **Integração:** API do Google Maps

## Estrutura do Projeto

### Etapa 1 – Teste Técnico

Na primeira fase, foi solicitado o desenvolvimento do backend e frontend de uma aplicação para transporte particular. A aplicação possui:

- **Backend:** Implementação de três endpoints e integração com a API do Google Maps.
- **Frontend:** Uma interface simples e funcional que complementa o projeto.


## Funcionalidades

1. **Endpoint 1: GET /route**
   - **Descrição:** Retorna as coordenadas geográficas dos pontos de partida e destino fornecidos pelo usuário.
   - **Resposta esperada:**
     ```json
     {
       "start_point": {
         "latitude": -23.550520,
         "longitude": -46.633308
       },
       "end_point": {
         "latitude": -22.906847,
         "longitude": -43.172897
       }
     }
     ```
   - **Documentação adicional:**
     - Utiliza a API do Google Maps para calcular a rota entre os pontos. [Documentação](https://developers.google.com/maps/documentation/routes/overview?hl=pt-br)

<img src="https://github.com/user-attachments/assets/6d43c1de-48a5-429b-b9c7-ab754198fc0e" alt="Captura de tela" width="300"><br/>
2. **Endpoint 2: POST /ride**
   - **Descrição:** Retorna a lista de motoristas disponíveis e informações sobre a rota da viagem.
   - **Exemplo de resposta:**
     ```json
     {
       "drivers": [
         {
           "id": 1,
           "name": "João Silva",
           "description": "Motorista com experiência de 5 anos.",
           "vehicle": "Toyota Corolla",
           "review": {
             "rating": 4.8,
             "comment": "Motorista muito educado e prestativo."
           },
           "value": 30.50
         }
       ],
       "routeResponse": {
         "distance": "25km",
         "duration": "30min"
       }
     }
     ```
   - **Erros esperados:**
     ```json
     {
       "status": 400,
       "error_code": "INVALID_DATA",
       "error_description": "Os dados fornecidos no corpo da requisição são inválidos."
     }
     ```
   - **Observação:** É necessário uma chave de acesso à API do Google Maps.

3. **Endpoint 3: GET /ride/{customer_id}?driver_id={driver_id}**
   - **Descrição:** Lista as viagens realizadas por um usuário, com possibilidade de filtro por motorista.
   - **Exemplo de resposta:**
     ```json
     {
       "rides": [
         {
           "id": 101,
           "distance": "12km",
           "duration": "20min",
           "driver": {
             "id": 1,
             "name": "João Silva",
             "description": "Motorista com experiência de 5 anos.",
             "vehicle": "Toyota Corolla",
             "review": {
               "rating": 4.8,
               "comment": "Motorista muito educado e prestativo."
             }
           },
           "value": 15.00
         }
       ]
     }
     ```
   - **Validações:**
     - O `customer_id` deve ser fornecido e válido.
     - Se o `driver_id` for informado, deve ser válido.
   - **Funcionalidade adicional:**
     - Ordena as viagens da mais recente para a mais antiga.
     - Filtra as viagens pelo `driver_id`, se informado.

4. **Endpoint 4: PATCH /ride/confirm**
   - **Descrição:** Confirma a viagem e registra-a no histórico do usuário.
   - **Validações:**
     - Os endereços de origem e destino não podem estar em branco.
   - **Resposta esperada:**
     ```json
     {
       "message": "Viagem confirmada com sucesso."
     }
     ```

### Observações Gerais
- Utilize a [documentação da API do Google Maps](https://developers.google.com/maps/documentation/routes/overview?hl=pt-br) para configurar os serviços necessários.
- É necessário obter uma chave de acesso à API do Google para realizar os testes.


O backend também inclui a integração com a API do Google Maps, proporcionando funcionalidades avançadas para a aplicação.

## Execução do Projeto

Para rodar a aplicação, é necessário utilizar o Docker. Siga os passos abaixo:

1. **Clone o repositório:**
    ```bash
   git clone [URL (https://github.com/fregnani123/projeto-tecnico.git) repositório]
    ```

2. **Navegue até o diretório do projeto:**
    ```bash
    Dessa forma, você pode substituir `caminho/do/seu/diretorio/projeto-tecnico
` pelo caminho específico no seu sistema quando for necessário. 😉

    ```
1 ## Configuração da API do Google Maps

Crie um arquivo `.env` na raiz do repositório no seguinte formato:

```env
GOOGLE_API_KEY=<sua_chave_da_API>

4. **Execute o Docker Compose:**
    ```bash
    docker-compose up
    ```

Isso irá iniciar os contêineres do Docker para o backend, frontend e banco de dados MySQL.

## Conclusão

Este projeto demonstra habilidades em desenvolvimento full-stack, utilizando tecnologias modernas e integração com serviços externos. É uma solução completa para transporte particular, com um backend robusto e um frontend intuitivo.


