# 🐳 BeautyFlow — Docker Compose

## 📌 Visão Geral
Arquivo de orquestração Docker que sobe todo o sistema BeautyFlow com um único comando.
Gerencia todos os containers, redes e volumes necessários para rodar o sistema completo.

---

## 🏗️ Arquitetura

```
docker-compose up
        ↓
┌─────────────────────────────────────────┐
│           Docker Network                │
│                                         │
│  ┌─────────┐     ┌──────────────────┐  │
│  │ MongoDB │◄────│ cadastro-service  │  │
│  │  :27017 │     │     :8081        │  │
│  │         │◄────│ agendamento-svc  │  │
│  └─────────┘     │     :8082        │  │
│                  └──────────────────┘  │
│                         ▲              │
│                  ┌──────┴───────┐      │
│                  │ api-gateway  │      │
│                  │    :8080     │      │
│                  └──────┬───────┘      │
│                         ▲              │
│                  ┌──────┴───────┐      │
│                  │   frontend   │      │
│                  │    :4200     │      │
│                  └─────────────┘      │
└─────────────────────────────────────────┘
```

---

## 🛠️ Serviços

| Serviço | Container | Porta | Descrição |
|---|---|---|---|
| MongoDB | beautyflow-mongodb | 27018 | Banco de dados NoSQL |
| Cadastro Service | beautyflow-cadastro | 8081 | Clientes e Profissionais |
| Agendamento Service | beautyflow-agendamento | 8082 | Agendamentos e Serviços |
| API Gateway | beautyflow-gateway | 8080 | Ponto de entrada único |
| Frontend | beautyflow-frontend | 4200 | Interface Angular |

---

## 📁 Estrutura de Projetos

```
C:\Users\Pedro\IdeaProjects\
├── BeautyFlow/                        ← você está aqui
│   └── docker-compose.yml
├── BeautyFlowCadastro-service/        ← microsserviço de cadastro
│   └── Dockerfile
├── BeautyFlowAgendamento-service/     ← microsserviço de agendamento
│   └── Dockerfile
├── BeautyFlowGateway/                 ← api gateway
│   └── Dockerfile
└── beautyflow-frontend/               ← frontend angular
    ├── Dockerfile
    └── nginx.conf
```

---

## 🚀 Como Rodar

### Pré-requisitos
- Docker Desktop instalado e **rodando** (verifique o ícone 🐳 na barra de tarefas)

### Subir tudo
```powershell
cd C:\Users\Pedro\IdeaProjects\BeautyFlow
docker-compose up
```

### Subir e recompilar (após alterações no código)
```powershell
docker-compose up --build
```

### Rodar em background (sem travar o terminal)
```powershell
docker-compose up -d
```

### Parar tudo
```powershell
docker-compose down
```

### Parar e remover os dados do banco
```powershell
docker-compose down -v
```

> ⚠️ O `-v` remove o volume do MongoDB — todos os dados serão perdidos!

---

## 🌐 Acessando o Sistema

Após subir os containers, acesse:

```
http://localhost:4200
```

---

## 🗄️ Banco de Dados

### MongoDB Compass
Para visualizar os dados use o **MongoDB Compass** (https://www.mongodb.com/try/download/compass):

| Ambiente | Connection String | Banco |
|---|---|---|
| Docker | `mongodb://localhost:27018` | beautyflow_cadastro, beautyflow_agendamento |
| Local | `mongodb://localhost:27017` | beautyflow_cadastro, beautyflow_agendamento |

> 💡 O Docker usa a porta **27018** para não conflitar com o MongoDB local (27017).

### Persistência de dados
Os dados são salvos no volume `mongodb_data` e **persistem** entre reinicializações do Docker.
Para verificar os volumes existentes:
```powershell
docker volume ls
```

---

## 🔧 Comandos Úteis

### Ver status dos containers
```powershell
docker-compose ps
```

### Ver logs de um serviço específico
```powershell
docker-compose logs cadastro-service
docker-compose logs agendamento-service
docker-compose logs api-gateway
docker-compose logs frontend
```

### Ver logs em tempo real
```powershell
docker-compose logs -f
```

### Acessar o terminal de um container
```powershell
docker exec -it beautyflow-cadastro sh
docker exec -it beautyflow-mongodb mongosh
```

### Reiniciar um serviço específico
```powershell
docker-compose restart cadastro-service
```

---

## 🧠 Conceitos Importantes

### O que é Docker?
Docker é uma plataforma que empacota aplicações em **containers** — ambientes isolados e portáteis.
Em vez de instalar Java, Node.js e MongoDB na sua máquina, o Docker cuida de tudo automaticamente.

### O que é docker-compose?
O `docker-compose.yml` é um arquivo que define e orquestra múltiplos containers.
Com um único `docker-compose up`, ele sobe todos os serviços na ordem correta.

### O que são Volumes?
Volumes são como pastas compartilhadas entre o container e a máquina host.
O `mongodb_data` garante que os dados do banco não sejam perdidos quando o container é reiniciado:
```yaml
volumes:
  - mongodb_data:/data/db
```

### O que são Redes (Networks)?
A `beautyflow-network` é uma rede interna do Docker que permite os containers se comunicarem
usando os **nomes dos serviços** como hostname:
```yaml
# Dentro do Docker, os serviços se comunicam assim:
http://cadastro-service:8081   # não precisa de IP!
http://agendamento-service:8082
http://mongodb:27017
```

### O que é o depends_on?
Define a ordem de inicialização dos containers:
```yaml
api-gateway:
  depends_on:
    - cadastro-service    # gateway só sobe depois do cadastro
    - agendamento-service # e depois do agendamento
```

### Build em duas etapas (Multi-stage build)
Os Dockerfiles usam duas etapas para criar imagens menores e mais eficientes:
```dockerfile
# Etapa 1: compilar o código (imagem grande com JDK)
FROM eclipse-temurin:21-jdk-alpine AS build
RUN ./gradlew bootJar

# Etapa 2: rodar o código (imagem pequena com JRE)
FROM eclipse-temurin:21-jre-alpine
COPY --from=build /app/build/libs/*.jar app.jar
```
A imagem final só contém o necessário para rodar, não para compilar.

---

## ⚠️ Troubleshooting

### Docker Desktop não está rodando
```
unable to get image: failed to connect to the docker API
```
**Solução:** Abra o Docker Desktop e aguarde o ícone 🐳 aparecer na barra de tarefas.

### Porta já em uso
```
Bind for 0.0.0.0:8080 failed: port is already allocated
```
**Solução:** Pare o serviço que está usando a porta ou mude a porta no docker-compose.yml.

### Dados não aparecem
Os dados do Docker ficam no volume `mongodb_data`, separados do MongoDB local.
Use a connection string `mongodb://localhost:27018` no Compass para ver os dados do Docker.

### Recompilar após mudanças no código
```powershell
docker-compose down
docker-compose up --build
```

---

## 🔒 Melhorias Futuras
- [ ] Variáveis de ambiente em arquivo `.env`
- [ ] Health checks nos containers
- [ ] Autenticação no MongoDB
- [ ] Configuração para produção (nginx com HTTPS)
- [ ] CI/CD com GitHub Actions
