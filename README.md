# 📦 Checkout Próprio de Produtos Digitais

Sistema profissional de checkout para produtos digitais, com controle próprio de produtos, campanhas, order bumps e entrega segura de materiais digitais via link protegido por token e expiração (ex: 90 dias) usando hospedagem MinIO.


## 🚀 Objetivo
- Criar um checkout controlado internamente.
- Foco em produtos digitais, usando pagamentos via integração com o Mercado Pago e outros gatways de pagamento.
- Permitir ofertas de **Order Bump** no checkout.
- Permitir **Upsell** após o pagamento aprovado.
- Entregar material de forma segura via **link protegido por token** (expiração padrão: 90 dias) enviado ao cliente após a compra, permitindo download do produto digital durante esse período.
- Armazenar arquivos diretamente no **MinIO**.

## 🧱 Estrutura de Banco de Dados
### Usuários e Autenticação (RBAC)
- **User**: Controle de usuários do painel admin.
- **Session / Token**: Gerenciamento de login, sessões e recuperação.
- **Role / Permission / Resource**: Controle de acesso baseado em papéis (RBAC).

### Sistema de Produtos e Vendas

- **Product**: Produto principal (nome, descrição, preço, URL da página de vendas).
- **Checkout**: Configuração de preço/campanha/order bump para um produto.
- **CheckoutOrderBump**: Produtos extras vendidos no checkout com um clique.
- **Order**: Pedido realizado após checkout.
- **AccessToken**: Token gerado para acesso ao link seguro do material digital, com tempo de expiração configurável (ex: 90 dias).

## 🎯 Lógica de Fluxo de Venda

flowchart TD;
    A[Landing Page (LP)] --> B[Botão "Comprar" → Redireciona para Checkout (/checkout/{code})]
    B --> C[Usuário Preenche Formulário (nome, email, telefone)]

    C --> D[Validação Imediata do WhatsApp (Evolution API) ao sair do campo telefone]
    D -->|Número Válido| E[Permite continuar preenchendo]
    D -->|Número Inválido| F[Exibe Erro no Campo de Telefone]

    E --> G[Envia Dados para Gateway de Pagamento (Mercado Pago)]
    G --> H[Aguardando Retorno de Pagamento (Pending/Approved)]

    H -->|Pagamento Pendente| I[Exibe Tela de "Pagamento Pendente"]
    H -->|Pagamento Aprovado| J[Webhook Recebe Confirmação]

    J --> K[Criar Pedido (Order) no Banco]
    K --> L[Gerar Token de Acesso (AccessToken)]

    L --> M[Redirecionar Imediato para Página de Upsell (antes de entregar acesso)]

    M -->|Aceita Upsell| N[Adiciona Produto Extra no Pedido]
    M -->|Recusa Upsell| O[Segue para Acesso]

    N --> P[Gerar Link Seguro para Download]
    O --> P

    P --> Q[Cliente acessa página de download com token (válido por 90 dias)]

## 🛡️ Segurança

- **Login obrigatório** para acessar o painel Admin.
- Controle de permissões por **Role/Permission**.
- **Tokens de acesso únicos** para material.
- Arquivos privados servidos via **Signed URL** (MinIO).

## 🛡️ Medidas de Segurança contra Pirataria

Para proteger os materiais digitais comercializados, foram implementadas as seguintes camadas de segurança:

- **Links de acesso protegidos por token**: Cada compra gera um token único de acesso ao material, associado ao pedido do cliente. Este token possui tempo de expiração configurável (padrão: 90 dias), limitando o período em que o download é permitido.

- **Limite de tentativas de download**: Cada token poderá ser utilizado para realizar um número máximo de downloads (exemplo: 5 vezes). Após atingir o limite, o token é automaticamente invalidado.

- **Associação de material a dados do comprador**: O material pode ser entregue com marcações internas ou informações vinculadas ao comprador (como nome, email ou telefone) para rastreabilidade em caso de vazamentos.

- **Marcação de uso pessoal**: Todos os materiais são disponibilizados como pessoais e intransferíveis, com aviso explícito no momento do download.

- **Proteção via Signed URLs (MinIO)**: Todos os downloads são realizados através de URLs assinadas e temporárias, evitando acesso direto aos arquivos armazenados.

- **Cada tentativa de download do material é registrada com**: Endereço IP de origem, Navegador e dispositivo utilizados (User Agent), Data e hora do acesso

- **Implementação de marca d'água dinâmica no PDF ao servir o download.**: utilização de lib para inserir responsável pela distribuição irregular( Por exemplo: pdf-lib).

Essas informações são armazenadas vinculadas ao token de acesso e permitem monitorar e identificar possíveis usos indevidos, como compartilhamento de links ou acesso de regiões incompatíveis com a origem da compra.

## 📡 Sistema de Webhooks Internos

O checkout possui suporte nativo para Webhooks Internos, permitindo que eventos importantes do sistema sejam notificados automaticamente para URLs externas configuradas via painel administrativo.

Esta funcionalidade possibilita a integração com sistemas de terceiros, automações externas, CRMs, ERPs, entre outros, aumentando a flexibilidade e o poder de expansão da plataforma.

### 🔔 Funcionamento dos Webhooks

1. **Evento gerado automaticamente:**
   - Sempre que ocorre uma ação relevante (ex: novo pedido, pagamento confirmado, download realizado), um evento interno é criado.
2. **Consulta de webhooks ativos:**
   - O sistema verifica se existem URLs cadastradas para receber notificações sobre o evento.
3. **Envio de notificações:**
   - Cada URL configurada recebe uma requisição HTTP POST contendo informações padronizadas sobre o evento (nome do evento, timestamp, dados relacionados).
4. **Segurança opcional:**
   - O sistema pode incluir uma assinatura (`X-Webhook-Signature`) nos headers da requisição, validando a origem dos eventos enviados.

### 📋 Eventos Inicialmente Disponíveis

- `order.created` – Quando um novo pedido é criado no sistema.
- `payment.approved` – Quando um pagamento é confirmado via integração com o gateway.
- `download.performed` – Quando o cliente realiza o download do material digital.

> **Observação:** Novos tipos de eventos poderão ser adicionados conforme evolução da plataforma.

### 🛡️ Estrutura do Payload Enviado

Cada evento enviado via webhook carrega um payload no formato JSON:

```json
{
  "event": "order.created",
  "timestamp": "2025-04-29T14:00:00-03:00",
  "data": {
    "orderId": "123",
    "productName": "Nome do Produto",
    "customerEmail": "cliente@exemplo.com"
  }
}
```

## 🚀 Tecnologias Utilizadas

- **Next.js** (Frontend + Backend Serverless)
- **PostgreSQL** (Banco de dados principal)
- **Prisma ORM** (Modelagem e queries)
- **MinIO** (Armazenamento de arquivos)
- **Mercado Pago** (Pagamento via PIX e Cartão de Crédito)
- **TypeScript** (Código tipado)
- **TailwindCSS**
- **Shadcn**

## 📚 Estrutura de Pastas

```bash
/src/
  /app/
    (suas rotas já existentes)
  /components/
    (seus componentes atuais)
  /hooks/
    (seus hooks atuais)
  /lib/
    auth.ts
    logger.ts
    prisma.ts
    utils.ts
    /emails/
      index.ts
      /services/
        email-service.interface.ts
        email.service.ts
        nodemailer.service.ts
        send-email.ts
      /templates/
        /auth/
          reset-password.template.ts
          set-initial-password.template.ts
          verification.template.ts
    /masks/
      cep.ts
      cpf.ts
      phone.ts
    /services/
      cep.service.ts
      whatsapp.service.ts
      /payment/
        payment.service.ts         // Nova pasta para serviços de pagamento
        mercado-pago.service.ts     // Implementação específica
      /storage/
        storage.service.ts          // Nova pasta para serviços de storage
        minio-storage.service.ts    // Implementação para MinIO
      /webhook/
        webhook-dispatcher.service.ts  // Serviço para envio de webhooks
    /validations/
      cep.ts
      cpf.ts
      phone.ts
    /interfaces/
      storage-service.interface.ts
      payment-service.interface.ts
      whatsapp-validation-service.interface.ts
      webhook-service.interface.ts
      logger-service.interface.ts
  /providers/
    (seus providers atuais)
  /styles/
    globals.css
  /types/
    (seus tipos atuais)

```

## 🚀 Implementações Futuras

- **Gestão de Expiração e Renovação de Tokens**: Opção para o cliente solicitar renovação do link de download, com aprovação manual ou automática, e notificações antes do vencimento.
- **Painel do Cliente Simplificado**: Página para o cliente consultar status do pedido, histórico de downloads e solicitar reenvio do link.
- **Monitoramento de Compartilhamento**: Alertas automáticos para o admin em caso de uso suspeito do token (múltiplos IPs, regiões, etc) e relatórios de tentativas negadas.
- **Customização de Marca D’água**: Marcação visível (nome/email) ou invisível (metadados), customizável por produto.
- **Dashboard de Logs e Auditoria**: Visualização e exportação de tentativas de download, alertas e estatísticas por produto.
- **Integração com Antifraude**: Checagem de e-mails descartáveis, blacklist de IPs e bloqueio automático para países não permitidos.
- **Melhorias na Experiência do Cliente**: E-mails profissionais, página de download responsiva e FAQ automatizado.
- **Webhooks e Integração com Sistemas Externos**: Integração com CRM, ERP, automação de marketing e notificações para o admin.
- **APIs para Parceiros**: Consulta de vendas e geração de relatórios via API autenticada para afiliados.
- **Backup e Disaster Recovery**: Rotinas automáticas de backup dos arquivos e banco de dados, com testes de restauração.

## 📋 Próximos Passos

- Criar endpoints:
  - Criar pedido
  - Validar pagamento
  - Gerar e enviar token seguro por e-mail (com expiração de 90 dias)
  - Entregar material via página protegida por token (sem área de membros)
- Painel Admin para:
  - Cadastrar Produtos
  - Cadastrar Checkouts
  - Associar Order Bumps
  - Ver Pedidos
  - Implementar página de upsell controlada por configuração.

## 🧪 Testes Automatizados

Para garantir a qualidade e a robustez do sistema, implementamos uma estratégia de testes em múltiplas camadas:

### Testes Unitários
- **Framework**: Jest
- **Cobertura alvo**: 80% mínimo para componentes críticos
- **Foco**: Serviços, controladores e funções utilitárias

### Testes de Integração
- **Framework**: Supertest + Jest
- **Escopo**: APIs, integrações com serviços externos, fluxo de pagamento
- **Banco de dados**: Instância isolada para testes

### Testes End-to-End
- **Framework**: Cypress
- **Cenários**: Fluxo completo de checkout, acesso aos materiais, painel administrativo

### Execução Automatizada
- Testes unitários e de integração: executados em cada commit/PR
- Testes E2E: executados diariamente e antes de cada deploy para produção

## 📚 Documentação de API

Todas as APIs do sistema são documentadas utilizando o padrão OpenAPI/Swagger, acessível diretamente pelo endpoint `/api/docs` em ambiente de desenvolvimento.

### Principais Endpoints

- **GET /api/products**: Lista produtos disponíveis
- **GET /api/checkouts/{code}**: Obtém dados de um checkout específico
- **POST /api/orders**: Cria um novo pedido
- **GET /api/downloads/{token}**: Valida e serve o download de um produto

A documentação completa inclui:
- Esquemas de requisição e resposta
- Códigos de status e mensagens de erro
- Autenticação e autorização necessárias
- Exemplos de uso

## 🔄 CI/CD e Controle de Versão

### Estratégia de Branches
- **main**: Código em produção
- **develop**: Código para próxima release
- **feature/***: Desenvolvimento de novas funcionalidades
- **hotfix/***: Correções urgentes para produção

### Pipeline de CI/CD (GitHub Actions)
1. **Build e Testes**: Acionado em cada push/PR
   - Verificação de tipos TypeScript
   - Execução de testes unitários e de integração
   - Análise estática de código (ESLint)

2. **Deploy para Staging**: Automático ao mesclar com develop
   - Execução de testes E2E
   - Provisionamento de infraestrutura via IaC

3. **Deploy para Produção**: Aprovação manual após mesclar com main
   - Deploy com estratégia de blue/green
   - Monitoramento pós-deploy

## 🌐 Internacionalização

O sistema foi projetado com suporte nativo à internacionalização desde o início:

- **Framework**: next-intl
- **Idiomas iniciais**: Português (Brasil), Inglês
- **Escopo**: Interfaces de usuário, e-mails, mensagens de erro
- **Adaptação regional**: Formatos de moeda, data/hora e números

## 📊 Análise e Monitoramento

### Monitoramento de Aplicação
- **Performance**: New Relic / Datadog
- **Logs**: Centralização em ELK Stack / Loki
- **Erros**: Sentry para rastreamento de exceções

### Métricas de Negócio
- Dashboard em tempo real com:
  - Conversão de checkout
  - Taxa de aprovação de pagamentos
  - Downloads por produto
  - Alertas de uso suspeito

### Alertas Proativos
- Notificações via e-mail/Slack para:
  - Erros críticos em produção
  - Picos de tráfego anormais
  - Tentativas suspeitas de acesso
  - Expiração iminente de tokens

## ✍️ Observação Final

O projeto foi planejado desde o início para ser **modular**, **desacoplado** e pronto para escalar.
A entrega do material é feita via link seguro com token e expiração, sem necessidade de área de membros, facilitando o acesso do cliente e reduzindo barreira de uso. Cada integração é abstraída via interfaces, facilitando troca de provedores ou expansão futura.
- **Monitoramento de Compartilhamento**: Alertas automáticos para o admin em caso de uso suspeito do token (múltiplos IPs, regiões, etc) e relatórios de tentativas negadas.
- **Customização de Marca D'água**: Marcação visível (nome/email) ou invisível (metadados), customizável por produto.
- **Dashboard de Logs e Auditoria**: Visualização e exportação de tentativas de download, alertas e estatísticas por produto.
- **Integração com Antifraude**: Checagem de e-mails descartáveis, blacklist de IPs e bloqueio automático para países não permitidos.
- **Melhorias na Experiência do Cliente**: E-mails profissionais, página de download responsiva e FAQ automatizado.
- **Webhooks e Integração com Sistemas Externos**: Integração com CRM, ERP, automação de marketing e notificações para o admin.
- **APIs para Parceiros**: Consulta de vendas e geração de relatórios via API autenticada para afiliados.
- **Backup e Disaster Recovery**: Rotinas automáticas de backup dos arquivos e banco de dados, com testes de restauração.