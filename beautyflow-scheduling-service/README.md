# 📅 Agendamento Service — BeautyFlow

## 📌 Visão Geral
Microsserviço responsável pelo gerenciamento de **Serviços** (ex: corte, manicure)
e **Agendamentos** do sistema BeautyFlow.

---

## 🏗️ Arquitetura
```
Angular (4200)
    ↓
API Gateway (8080)
    ↓
Agendamento Service (8082) ← você está aqui
    ↓
MongoDB (beautyflow_agendamento)
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
src/main/java/com/example/beautyflowagendamentoservice/
├── controller/
│   ├── ServicoController.java      # Endpoints REST de serviços
│   └── AgendamentoController.java  # Endpoints REST de agendamentos
├── model/
│   ├── Servico.java                # Documento MongoDB de serviço
│   └── Agendamento.java            # Documento MongoDB de scheduling
├── repository/
│   ├── ServicoRepository.java
│   └── AgendamentoRepository.java
└── service/
    ├── ServicoService.java
    └── AgendamentoService.java
```

---

## ⚙️ Configuração
```properties
server.port=8082
spring.application.name=scheduling-service
spring.data.mongodb.uri=mongodb://localhost:27017/beautyflow_agendamento
spring.data.mongodb.database=beautyflow_agendamento
```

---

## 🚀 Como Rodar
```bash
.\gradlew.bat bootRun
```
Servidor sobe em: **http://localhost:8082**

---

## 📡 Endpoints

### Serviços
| Método | Rota | Descrição |
|---|---|---|
| GET | /servicos | Lista todos os serviços |
| GET | /servicos?apenasAtivos=true | Lista só os ativos |
| GET | /servicos/{id} | Busca por ID |
| POST | /servicos | Cria novo serviço |
| PUT | /servicos/{id} | Atualiza serviço |
| DELETE | /servicos/{id} | Remove serviço |

### Agendamentos
| Método | Rota | Descrição |
|---|---|---|
| GET | /agendamentos | Lista todos |
| GET | /agendamentos/dia?data=2024-03-15T00:00:00 | Agenda do dia |
| GET | /agendamentos/cliente/{clienteId} | Por cliente |
| GET | /agendamentos/{id} | Busca por ID |
| POST | /agendamentos | Cria scheduling |
| PATCH | /agendamentos/{id}/status?status=CONCLUIDO | Atualiza status |
| DELETE | /agendamentos/{id} | Remove scheduling |

---

## 📦 Exemplos de Requisição

### Criar Serviço
```json
POST /servicos
{
    "nome": "Corte Feminino",
    "descricao": "Corte com lavagem e secagem",
    "preco": 80.00,
    "duracaoMinutos": 60
}
```

### Criar Agendamento
```json
POST /agendamentos
{
    "clienteId": "id_do_cliente",
    "profissionalId": "id_do_profissional",
    "servicoId": "id_do_servico",
    "dataHora": "2024-03-15T10:00:00",
    "observacoes": "Cliente prefere produtos naturais"
}
```

---

## 🗄️ Modelo de Dados

### Serviço
```json
{
    "id": "ObjectId",
    "nome": "string (obrigatório)",
    "descricao": "string (opcional)",
    "preco": "Double",
    "duracaoMinutos": "Integer",
    "ativo": "boolean (padrão: true)"
}
```

### Agendamento
```json
{
    "id": "ObjectId",
    "clienteId": "string (referência ao cliente)",
    "profissionalId": "string (referência ao profissional)",
    "servicoId": "string (referência ao serviço)",
    "dataHora": "LocalDateTime",
    "status": "AGENDADO | CONCLUIDO | CANCELADO",
    "observacoes": "string (opcional)",
    "criadoEm": "LocalDateTime (automático)"
}
```

---

## 🧠 Conceitos Importantes

### Referências por ID no MongoDB
Diferente do SQL onde usamos JOIN e chaves estrangeiras, no MongoDB
armazenamos apenas o **ID** do documento relacionado:
```java
private String clienteId;      // apenas o ID, não o objeto inteiro
private String profissionalId;
private String servicoId;
```
Isso mantém os serviços **desacoplados** — o scheduling-service não
precisa conhecer a estrutura interna do cadastro-service.

### Verificação de Conflito de Horário
Antes de salvar um scheduling, o sistema verifica se o profissional
já possui outro scheduling no mesmo horário:
```java
private void verificarConflito(Agendamento novo) {
    List<Agendamento> conflitos = schedulingRepository
        .findByProfissionalIdAndDataHoraBetween(
            novo.getProfissionalId(),
            novo.getDataHora().minusMinutes(1),
            novo.getDataHora().plusMinutes(1)
        );
    if (!conflitos.isEmpty()) {
        throw new RuntimeException("Profissional já possui scheduling neste horário");
    }
}
```

### Status do Agendamento
O scheduling usa um **Enum** para controlar os possíveis estados:
```java
public enum StatusAgendamento {
    AGENDADO,   // Estado inicial
    CONCLUIDO,  // Atendimento realizado
    CANCELADO   // Cancelado pelo cliente ou salão
}
```

---

## ⚠️ Melhorias Futuras
- [ ] Notificações por e-mail ao criar/cancelar scheduling
- [ ] Buscar nome do cliente/profissional via OpenFeign
- [ ] Relatório de faturamento por período
- [ ] Testes unitários e de integração
- [ ] Documentação com Swagger/OpenAPI
