# ✂️ BeautyFlow — Sistema de Agendamento para Salão de Beleza

![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.0-green)
![Angular](https://img.shields.io/badge/Angular-19-red)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green)
![Docker](https://img.shields.io/badge/Docker-Compose-blue)

## 📌 Visão Geral

BeautyFlow é um sistema completo de agendamento para salões de beleza, desenvolvido com arquitetura de **microsserviços**. O sistema permite gerenciar clientes, profissionais, serviços e agendamentos de forma simples e eficiente.

---

## 🏗️ Arquitetura

```
beautyflow/
├── beautyflow-auth-service/        → Autenticação JWT (porta 8083)
├── beautyflow-register-service/    → Clientes e Profissionais (porta 8081)
├── beautyflow-scheduling-service/  → Agendamentos e Serviços (porta 8082)
├── BeautyFlowGateway/              → API Gateway (porta 8080)
├── beautyflow-frontend/            → Interface Angular (porta 4200)
└── BeautyFlow/                     → Docker Compose
```

### Fluxo de Comunicação

```
Usuário (Navegador)
        ↓
Frontend Angular (4200)
        ↓
API Gateway (8080) ← valida JWT
        ├── /auth/**         → auth-service (8083)
        ├── /clientes/**     → register-service (8081)
        ├── /profissionais/**→ register-service (8081)
        ├── /servicos/**     → scheduling-service (8082)
        └── /agendamentos/** → scheduling-service (8082)
```

---

## 🛠️ Tecnologias

### Backend
| Tecnologia | Versão | Função |
|---|---|---|
| Java | 21 | Linguagem principal |
| Spring Boot | 3.4.0 | Framework principal |
| Spring Cloud Gateway | 2024.0.0 | API Gateway |
| Spring Security | 3.4.0 | Segurança |
| Spring Data MongoDB | 3.4.0 | Persistência |
| JWT (jjwt) | 0.12.3 | Autenticação |
| SpringDoc OpenAPI | 2.3.0 | Documentação Swagger |
| Gradle | 9.4 | Build tool |

### Frontend
| Tecnologia | Versão | Função |
|---|---|---|
| Angular | 19 | Framework principal |
| Angular Material | 19 | Componentes visuais |
| TypeScript | 5.x | Linguagem |
| RxJS | 7.x | Programação reativa |

### Infraestrutura
| Tecnologia | Versão | Função |
|---|---|---|
| MongoDB | 7 | Banco de dados NoSQL |
| Docker | - | Containerização |
| Docker Compose | - | Orquestração |
| Nginx | Alpine | Servidor web (frontend) |

---

## 📦 Microsserviços

### 🔐 Auth Service (porta 8083)
Responsável pela autenticação e autorização do sistema.
- Registro de usuários
- Login com geração de token JWT
- Validação de token
- Banco: `beautyflow_auth`
- Swagger: `http://localhost:8083/swagger-ui.html`

### 👥 Register Service (porta 8081)
Responsável pelo cadastro de clientes e profissionais.
- CRUD de Clientes
- CRUD de Profissionais (com ativar/desativar)
- Banco: `beautyflow_cadastro`
- Swagger: `http://localhost:8081/swagger-ui.html`

### 📅 Scheduling Service (porta 8082)
Responsável pelo gerenciamento de serviços e agendamentos.
- CRUD de Serviços (Treatments)
- CRUD de Agendamentos (Schedulings)
- Verificação de conflito de horários
- Banco: `beautyflow_agendamento`
- Swagger: `http://localhost:8082/swagger-ui.html`

### 🔀 API Gateway (porta 8080)
Ponto de entrada único da aplicação.
- Roteamento de requisições
- Validação de JWT
- Configuração de CORS

---

## 🚀 Como Rodar

### Pré-requisitos
- [Docker Desktop](https://www.docker.com/products/docker-desktop) instalado e rodando

### Subir tudo com Docker

```bash
cd BeautyFlow
docker-compose up --build
```

Aguarde todos os containers subirem e acesse:

```
http://localhost:4200
```

### Parar os containers

```bash
docker-compose down
```

---

## 🔑 Primeiro Acesso

1. Acesse `http://localhost:4200`
2. Clique em **Registrar** ou use o Swagger do auth-service para criar um usuário:

```
POST http://localhost:8083/auth/register
{
  "name": "Admin",
  "email": "admin@beautyflow.com",
  "password": "123456"
}
```

3. Faça login com as credenciais criadas

---

## 📡 Endpoints Principais

### Auth
| Método | Rota | Descrição |
|---|---|---|
| POST | /auth/register | Registrar usuário |
| POST | /auth/login | Login |
| GET | /auth/validate | Validar token |

### Clientes
| Método | Rota | Descrição |
|---|---|---|
| GET | /clientes | Listar todos |
| POST | /clientes | Criar cliente |
| PUT | /clientes/{id} | Atualizar cliente |
| DELETE | /clientes/{id} | Deletar cliente |

### Profissionais
| Método | Rota | Descrição |
|---|---|---|
| GET | /profissionais | Listar todos |
| POST | /profissionais | Criar profissional |
| PATCH | /profissionais/{id}/toggle-ativo | Ativar/Desativar |

### Serviços
| Método | Rota | Descrição |
|---|---|---|
| GET | /servicos | Listar todos |
| POST | /servicos | Criar serviço |
| PUT | /servicos/{id} | Atualizar serviço |

### Agendamentos
| Método | Rota | Descrição |
|---|---|---|
| GET | /agendamentos | Listar todos |
| GET | /agendamentos/dia?data=... | Agenda do dia |
| POST | /agendamentos | Criar agendamento |
| PATCH | /agendamentos/{id}/status | Atualizar status |

---

## 🗄️ Banco de Dados

O sistema usa **MongoDB** com três bancos isolados:

| Banco | Serviço | Coleções |
|---|---|---|
| beautyflow_auth | auth-service | users |
| beautyflow_cadastro | register-service | clients, professionals |
| beautyflow_agendamento | scheduling-service | treatments, schedulings |

### Visualizar dados (MongoDB Compass)

| Ambiente | Connection String |
|---|---|
| Docker | `mongodb://localhost:27018` |
| Local | `mongodb://localhost:27017` |

---

## 🖥️ Telas do Sistema

| Tela | Descrição |
|---|---|
| Login | Autenticação com e-mail e senha |
| Dashboard | Resumo com gráficos de agendamentos, faturamento e estatísticas |
| Agendamentos | Gerenciamento completo com filtro por data |
| Clientes | Cadastro e busca de clientes |
| Profissionais | Cadastro com ativar/desativar |
| Serviços | Cadastro com preço e duração |

---

## 🔒 Segurança

- Senhas criptografadas com **BCrypt**
- Autenticação via **JWT** (validade de 24h)
- Gateway valida o token em **todas as requisições**
- Rotas públicas: apenas `/auth/**`

---

## 🐳 Containers Docker

| Container | Imagem | Porta |
|---|---|---|
| beautyflow-mongodb | mongo:7 | 27018 |
| beautyflow-auth | eclipse-temurin:21 | 8083 |
| beautyflow-register | eclipse-temurin:21 | 8081 |
| beautyflow-scheduling | eclipse-temurin:21 | 8082 |
| beautyflow-gateway | eclipse-temurin:21 | 8080 |
| beautyflow-frontend | nginx:alpine | 4200 |

---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais e de processo seletivo.

---

## 👨‍💻 Desenvolvedor

**Pedro Gottlob**
- GitHub: [@PedroGottlob](https://github.com/PedroGottlob)
