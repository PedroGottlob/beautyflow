# 🔀 API Gateway — BeautyFlow

## 📌 Visão Geral
O API Gateway é o **ponto de entrada único** do sistema BeautyFlow.
Todo o tráfego do frontend passa por ele, que redireciona para o
microsserviço correto com base na rota da requisição.

---

## 🏗️ Arquitetura
```
Angular (4200)
    ↓
API Gateway (8080) ← você está aqui
    ├── /clientes/**      → cadastro-service (8081)
    ├── /profissionais/** → cadastro-service (8081)
    ├── /servicos/**      → agendamento-service (8082)
    └── /agendamentos/**  → agendamento-service (8082)
```

---

## 🛠️ Tecnologias
| Tecnologia | Versão | Função |
|---|---|---|
| Java | 25 | Linguagem principal |
| Spring Boot | 3.4.0 | Framework principal |
| Spring Cloud Gateway | 2024.0.0 | Roteamento de requisições |
| Spring WebFlux | 3.4.0 | Servidor reativo (Netty) |
| Gradle | 9.4 | Gerenciador de build |

---

## ⚙️ Configuração
```properties
server.port=8080
spring.application.name=api-gateway

# Rota 1: Clientes → cadastro-service
spring.cloud.gateway.routes[0].id=cadastro-clientes
spring.cloud.gateway.routes[0].uri=http://localhost:8081
spring.cloud.gateway.routes[0].predicates[0]=Path=/clientes/**

# Rota 2: Profissionais → cadastro-service
spring.cloud.gateway.routes[1].id=cadastro-profissionais
spring.cloud.gateway.routes[1].uri=http://localhost:8081
spring.cloud.gateway.routes[1].predicates[0]=Path=/profissionais/**

# Rota 3: Serviços → agendamento-service
spring.cloud.gateway.routes[2].id=agendamento-servicos
spring.cloud.gateway.routes[2].uri=http://localhost:8082
spring.cloud.gateway.routes[2].predicates[0]=Path=/servicos/**

# Rota 4: Agendamentos → agendamento-service
spring.cloud.gateway.routes[3].id=agendamento-agendamentos
spring.cloud.gateway.routes[3].uri=http://localhost:8082
spring.cloud.gateway.routes[3].predicates[0]=Path=/agendamentos/**

# CORS — permite requisições do Angular
spring.cloud.gateway.globalcors.cors-configurations.[/**].allowedOrigins[0]=http://localhost:4200
spring.cloud.gateway.globalcors.cors-configurations.[/**].allowedMethods[0]=GET
spring.cloud.gateway.globalcors.cors-configurations.[/**].allowedMethods[1]=POST
spring.cloud.gateway.globalcors.cors-configurations.[/**].allowedMethods[2]=PUT
spring.cloud.gateway.globalcors.cors-configurations.[/**].allowedMethods[3]=PATCH
spring.cloud.gateway.globalcors.cors-configurations.[/**].allowedMethods[4]=DELETE
spring.cloud.gateway.globalcors.cors-configurations.[/**].allowedMethods[5]=OPTIONS
spring.cloud.gateway.globalcors.cors-configurations.[/**].allowedHeaders[0]=*
spring.cloud.gateway.globalcors.cors-configurations.[/**].allowCredentials=true
```

---

## 🚀 Como Rodar
```bash
.\gradlew.bat bootRun
```
Servidor sobe em: **http://localhost:8080**

---

## 🧠 Conceitos Importantes

### Por que usar um API Gateway?
Sem o Gateway, o frontend precisaria conhecer o endereço de cada microsserviço:
```
# Sem Gateway (ruim)
http://localhost:8081/clientes
http://localhost:8082/servicos

# Com Gateway (bom)
http://localhost:8080/clientes
http://localhost:8080/servicos
```

### Spring WebFlux vs Spring MVC
O Gateway usa **WebFlux** (programação reativa) em vez do Spring MVC tradicional.
Isso significa que ele usa o servidor **Netty** em vez do Tomcat, sendo mais
eficiente para rotear muitas requisições simultâneas.

### CORS (Cross-Origin Resource Sharing)
O browser bloqueia requisições de uma origem (localhost:4200) para outra
(localhost:8080) por segurança. O CORS configurado no Gateway libera
essas requisições do Angular.

> ⚠️ **Importante**: O CORS deve ser configurado APENAS no Gateway.
> Se configurado também nos microsserviços, causa conflito de headers
> duplicados e as requisições falham.

### Predicates (Condições de Roteamento)
Os predicates definem **quando** uma rota deve ser ativada:
```
Path=/clientes/** → qualquer rota que comece com /clientes/
```
O `**` é um wildcard que aceita qualquer continuação da URL.

---

## 🔒 Melhorias Futuras
- [ ] Autenticação JWT no Gateway (validar token antes de repassar)
- [ ] Rate Limiting (limitar requisições por IP)
- [ ] Circuit Breaker com Resilience4j
- [ ] Service Discovery com Eureka
- [ ] Load Balancing entre instâncias
