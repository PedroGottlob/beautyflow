# 🎨 Frontend — BeautyFlow

## 📌 Visão Geral
Interface web do sistema BeautyFlow desenvolvida em **Angular 19** com **Angular Material**.
Permite gerenciar clientes, profissionais, serviços e agendamentos de um salão de beleza.

---

## 🏗️ Arquitetura
```
BeautyFlow Frontend (4200)
    ↓
API Gateway (8080) → microsserviços
```
O frontend **nunca fala diretamente** com os microsserviços.
Toda comunicação passa pelo API Gateway na porta 8080.

---

## 🛠️ Tecnologias
| Tecnologia | Versão | Função |
|---|---|---|
| Angular | 19 | Framework principal |
| Angular Material | 19 | Componentes visuais prontos |
| TypeScript | 5.x | Linguagem (JavaScript com tipos) |
| RxJS | 7.x | Programação reativa (Observables) |
| Node.js | 24 | Ambiente de execução |
| npm | 11 | Gerenciador de pacotes |

---

## 📁 Estrutura do Projeto
```
src/
├── app/
│   ├── core/                        # Código compartilhado por toda a app
│   │   ├── guards/
│   │   │   └── auth.guard.ts        # Protege rotas de usuários não logados
│   │   ├── models/
│   │   │   └── models.ts            # Interfaces TypeScript (tipos de dados)
│   │   └── services/
│   │       └── api.service.ts       # Todas as chamadas HTTP para a API
│   ├── features/                    # Uma pasta por tela da aplicação
│   │   ├── login/
│   │   │   └── login.ts            # Tela de login
│   │   ├── dashboard/
│   │   │   └── dashboard.ts        # Tela inicial com resumo
│   │   ├── clientes/
│   │   │   └── clientes.ts         # CRUD de clientes
│   │   ├── profissionais/
│   │   │   └── profissionais.ts    # CRUD de profissionais
│   │   ├── servicos/
│   │   │   └── servicos.ts         # CRUD de serviços
│   │   └── agendamentos/
│   │       └── agendamentos.ts     # CRUD de agendamentos
│   ├── app.ts                       # Componente raiz (sidebar + layout)
│   ├── app.html                     # Template HTML do componente raiz
│   ├── app.css                      # Estilos do componente raiz
│   ├── app.routes.ts                # Definição de todas as rotas
│   └── app.config.ts                # Configuração global da aplicação
├── environments/
│   └── environment.ts               # Variáveis de ambiente (URL da API)
├── main.ts                          # Ponto de entrada da aplicação
├── styles.css                       # Estilos globais
└── index.html                       # HTML principal
```

---

## ⚙️ Configuração

### URL da API
`src/environments/environment.ts`
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080' // aponta para o API Gateway
};
```

---

## 🚀 Como Rodar

### Pré-requisitos
- Node.js 18+
- Angular CLI instalado globalmente:
```bash
npm install -g @angular/cli
```

### Instalar dependências
```bash
npm install
```

### Rodar em desenvolvimento
```bash
ng serve
```
Acesse em: **http://localhost:4200**

> ⚠️ Para o sistema funcionar completamente, os backends também precisam estar rodando!

---

## 🧠 Conceitos Importantes

### O que é Angular?
Angular é um **framework** para construir aplicações web. Ele organiza o código
em **componentes** — cada tela ou parte da tela é um componente com seu próprio
HTML, CSS e TypeScript.

### O que é TypeScript?
TypeScript é JavaScript com **tipagem estática**. Em vez de:
```javascript
// JavaScript — sem tipo, pode dar erro em runtime
let preco = "oitenta"; // string em vez de número!
```
Usamos:
```typescript
// TypeScript — erro detectado antes de rodar
let preco: number = "oitenta"; // ERRO em tempo de compilação
```

### O que são Componentes?
Cada tela é um componente com 3 partes:
```typescript
@Component({
  selector: 'app-clientes',    // tag HTML que representa o componente
  template: `<h1>Clientes</h1>`, // HTML da tela
  styles: [`.titulo { color: red }`] // CSS da tela
})
export class ClientesComponent {
  clientes = []; // dados da tela
  
  carregar() { // lógica da tela
    // busca clientes da API
  }
}
```

### O que são Rotas?
As rotas definem qual componente mostrar para cada URL:
```typescript
// app.routes.ts
{ path: 'clientes', component: ClientesComponent }
// quando acessar /clientes → mostra ClientesComponent
```

### O que são Observables (RxJS)?
Quando fazemos uma requisição HTTP, ela não retorna o dado imediatamente.
Ela retorna um **Observable** — um objeto que "emitirá" o dado quando chegar:
```typescript
// Fazendo a requisição
this.api.getClientes().subscribe({
  next: (clientes) => {
    // aqui os dados chegaram!
    this.clientes = clientes;
  },
  error: (erro) => {
    // aqui deu algum erro
    console.error(erro);
  }
});
```

### O que é Angular Material?
É uma biblioteca de componentes visuais prontos baseados no **Material Design** do Google.
Em vez de criar botões, tabelas e formulários do zero, usamos componentes prontos:
```html
<!-- Botão do Angular Material -->
<button mat-raised-button color="primary">Salvar</button>

<!-- Tabela do Angular Material -->
<table mat-table [dataSource]="clientes">...</table>

<!-- Campo de texto do Angular Material -->
<mat-form-field>
  <input matInput [(ngModel)]="nome" />
</mat-form-field>
```

### O que é o AuthGuard?
O Guard protege rotas que precisam de login.
Antes de carregar a tela, ele verifica se existe um token salvo:
```typescript
export const authGuard: CanActivateFn = () => {
  const token = localStorage.getItem('beautyflow_token');
  if (token) {
    return true; // deixa acessar a rota
  }
  return router.createUrlTree(['/login']); // redireciona para login
};
```

### O que é o ApiService?
É um serviço centralizado com todos os métodos de comunicação com a API.
Em vez de cada componente fazer suas próprias requisições HTTP, todos
usam o ApiService:
```typescript
// ApiService tem todos os métodos
getClientes()           // GET /clientes
criarCliente(cliente)   // POST /clientes
atualizarCliente(id, c) // PUT /clientes/{id}
deletarCliente(id)      // DELETE /clientes/{id}
```

### Two-way Data Binding com [(ngModel)]
O `[(ngModel)]` sincroniza automaticamente o valor do campo HTML
com a variável TypeScript:
```html
<!-- quando o usuário digita, this.nome é atualizado automaticamente -->
<input [(ngModel)]="nome" />
```

### *ngIf e *ngFor
Diretivas que controlam o HTML dinamicamente:
```html
<!-- mostra o elemento só se modalAberto for true -->
<div *ngIf="modalAberto">Modal aqui</div>

<!-- repete o elemento para cada cliente na lista -->
<tr *ngFor="let cliente of clientes">
  <td>{{ cliente.nome }}</td>
</tr>
```

---

## 📡 Fluxo de uma Requisição

Exemplo: usuário clica em "Salvar" para criar um cliente.

```
1. Usuário clica no botão "Salvar"
        ↓
2. clientes.ts → método salvar() é chamado
        ↓
3. ApiService → criarCliente(form) é chamado
        ↓
4. HttpClient → POST http://localhost:8080/clientes
        ↓
5. API Gateway (8080) → redireciona para cadastro-service (8081)
        ↓
6. cadastro-service → salva no MongoDB
        ↓
7. Resposta volta para o Angular
        ↓
8. clientes.ts → lista é recarregada com o novo cliente
        ↓
9. Tela atualiza automaticamente
```

---

## 🗂️ Telas do Sistema

### Login (`/login`)
- Formulário de e-mail e senha
- Salva o token no `localStorage`
- Redireciona para o Dashboard

### Dashboard (`/dashboard`)
- Cards com totais: agendamentos do dia, clientes, profissionais, serviços
- Ações rápidas para criar novos registros
- Dados carregados em paralelo com `forkJoin`

### Clientes (`/clientes`)
- Tabela com todos os clientes
- Busca por nome em tempo real
- Modal para criar/editar
- Botão para deletar

### Profissionais (`/profissionais`)
- Tabela com todos os profissionais
- Badge de status (Ativo/Inativo)
- Toggle para ativar/desativar sem deletar
- Modal para criar/editar

### Serviços (`/servicos`)
- Tabela com nome, duração, preço e status
- Preço formatado em R$ com `currency pipe`
- Modal para criar/editar

### Agendamentos (`/agendamentos`)
- Tabela com data, cliente, profissional, serviço e status
- Filtro por data
- Botões de concluir e cancelar
- Modal para criar novo agendamento com selects

---

## ⚠️ Melhorias Futuras
- [ ] Autenticação real com JWT (integrar com auth-service)
- [ ] Interceptor HTTP para adicionar token nas requisições
- [ ] Tratamento global de erros
- [ ] Loading spinner durante requisições
- [ ] Paginação nas tabelas
- [ ] Tema dark mode
- [ ] Testes unitários com Jasmine/Karma
- [ ] Build de produção com `ng build`
