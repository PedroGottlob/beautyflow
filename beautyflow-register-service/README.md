# 📋 Cadastro Service — BeautyFlow

## 📌 Visão Geral
Microsserviço responsável pelo gerenciamento de **Clientes** e **Profissionais** do sistema BeautyFlow.
Faz parte de uma arquitetura de microsserviços e se comunica com o restante do sistema através do API Gateway.

---

## 🏗️ Arquitetura
```
Angular (4200)
    ↓
API Gateway (8080)
    ↓
Cadastro Service (8081) ← você está aqui
    ↓
MongoDB (beautyflow_cadastro)
```

---

## 🛠️ Tecnologias
| Tecnologia | Versão | Função |
|---|---|---|
| Java | 25 | Linguagem principal |
| Spring Boot | 3.4.0 | Framework principal |
| Spring Data MongoDB | 3.4.0 | Persistência de dados |
| Spring Validation | 3.4.0 | Validação de dados de entrada |
| MongoDB | 7.x | Banco de dados NoSQL |
| Gradle | 9.4 | Gerenciador de build |

---

## 📁 Estrutura do Projeto
```
src/main/java/com/example/beautyflowcadastroservice/
├── controller/
│   ├── ClienteController.java      # Endpoints REST de clientes
│   └── ProfissionalController.java # Endpoints REST de profissionais
├── model/
│   ├── Cliente.java                # Documento MongoDB de cliente
│   └── Profissional.java           # Documento MongoDB de professional
├── repository/
│   ├── ClienteRepository.java      # Interface de acesso ao banco
│   └── ProfissionalRepository.java
└── service/
    ├── ClienteService.java         # Regras de negócio de clientes
    └── ProfissionalService.java    # Regras de negócio de profissionais
```

---

## ⚙️ Configuração
**application.properties**
```properties
server.port=8081
spring.application.name=cadastro-service
spring.data.mongodb.uri=mongodb://localhost:27017/beautyflow_cadastro
spring.data.mongodb.database=beautyflow_cadastro
```

---

## 🚀 Como Rodar
### Pré-requisitos
- Java 21+
- MongoDB rodando na porta 27017
- Gradle

### Comando
```bash
.\gradlew.bat bootRun
```
Servidor sobe em: **http://localhost:8081**

---

## 📡 Endpoints

### Clientes
| Método | Rota | Descrição |
|---|---|---|
| GET | /clientes | Lista todos os clientes |
| GET | /clientes?nome=X | Busca clientes por nome |
| GET | /clientes/{id} | Busca cliente por ID |
| POST | /clientes | Cria novo cliente |
| PUT | /clientes/{id} | Atualiza cliente |
| DELETE | /clientes/{id} | Remove cliente |

### Profissionais
| Método | Rota | Descrição |
|---|---|---|
| GET | /profissionais | Lista todos os profissionais |
| GET | /profissionais?apenasAtivos=true | Lista só os ativos |
| GET | /profissionais/{id} | Busca por ID |
| POST | /profissionais | Cria novo professional |
| PUT | /profissionais/{id} | Atualiza professional |
| PATCH | /profissionais/{id}/toggle-ativo | Ativa/Desativa professional |
| DELETE | /profissionais/{id} | Remove professional |

---

## 📦 Exemplos de Requisição

### Criar Cliente
```json
POST /clientes
{
    "nome": "Maria Silva",
    "telefone": "11999999999",
    "email": "maria@email.com",
    "observacoes": "Cliente VIP"
}
```

### Criar Profissional
```json
POST /profissionais
{
    "nome": "João Cabeleireiro",
    "especialidade": "Cabeleireiro",
    "telefone": "11988888888",
    "email": "joao@beautyflow.com"
}
```

---

## 🗄️ Modelo de Dados

### Cliente
```json
{
    "id": "ObjectId gerado pelo MongoDB",
    "nome": "string (obrigatório)",
    "email": "string (opcional)",
    "telefone": "string (obrigatório, único)",
    "observacoes": "string (opcional)",
    "criadoEm": "LocalDateTime (automático)"
}
```

### Profissional
```json
{
    "id": "ObjectId gerado pelo MongoDB",
    "nome": "string (obrigatório)",
    "especialidade": "string (obrigatório)",
    "telefone": "string (opcional)",
    "email": "string (opcional)",
    "servicosIds": ["array de IDs de serviços"],
    "ativo": "boolean (padrão: true)"
}
```

---

## 🧠 Conceitos Importantes

### Por que MongoDB?
MongoDB é um banco **NoSQL orientado a documentos**. Em vez de tabelas e linhas (como SQL),
ele armazena dados em documentos **JSON/BSON**. É ideal para dados flexíveis como clientes
que podem ter campos opcionais.

### Por que Spring Data MongoDB?
O Spring Data MongoDB elimina a necessidade de escrever queries manualmente.
Basta declarar métodos com nomes específicos na interface Repository e o Spring
gera a implementação automaticamente:
```java
// Spring traduz isso para: db.clientes.find({ nome: /texto/i })
List<Cliente> findByNomeContainingIgnoreCase(String nome);
```

### Camadas da Aplicação
- **Controller**: Recebe as requisições HTTP e devolve respostas
- **Service**: Contém as regras de negócio (validações, lógica)
- **Repository**: Faz a comunicação com o MongoDB
- **Model**: Representa os documentos do banco de dados

---

## ⚠️ Melhorias Futuras
- [ ] Implementar paginação nas listagens
- [ ] Adicionar cache com Redis
- [ ] Comunicação com agendamento-service via OpenFeign
- [ ] Testes unitários e de integração
- [ ] Documentação com Swagger/OpenAPI
