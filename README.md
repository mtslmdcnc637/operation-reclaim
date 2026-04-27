# Operation Reclaim — SaaS de Superação de Vícios Gamificado

Sistema B2C de saúde digital que combina ciência comportamental (Hábitos Atômicos) com mecânicas de RPG para ajudar pessoas a superar vícios digitais: redes sociais, pornografia e jogos.

## 🚀 Stack Tecnológico

- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend/DB:** Supabase (PostgreSQL + Auth + RLS)
- **Pagamentos:** Stripe (Checkout + Webhooks)
- **Estado:** Zustand (client-side)
- **Deploy:** Vercel-ready

## 📦 Estrutura do Projeto

```
src/
├── app/
│   ├── page.tsx              # Landing Page
│   ├── layout.tsx            # Root Layout
│   ├── globals.css           # Global Styles
│   ├── dashboard/
│   │   ├── layout.tsx        # Dashboard Layout (sidebar + auth)
│   │   ├── page.tsx          # Painel Central (home)
│   │   ├── missions/         # Missões diárias
│   │   ├── enemies/          # Boss Battles
│   │   ├── achievements/     # Conquistas
│   │   └── profile/          # Perfil do usuário
│   └── api/
│       └── stripe/
│           ├── checkout/     # Criar sessão de pagamento
│           └── webhook/      # Webhook do Stripe
├── components/
│   ├── auth/                 # Modal de Login/Registro
│   ├── landing/              # Componentes da landing
│   └── dashboard/            # Componentes do dashboard
├── lib/
│   ├── supabase/             # Client Supabase
│   ├── stripe/               # Integração Stripe
│   ├── store/                # Zustand Store
│   ├── game-engine/          # Engine de gamificação
│   └── data/                 # Constantes (missões, ranks, etc.)
└── types/                    # TypeScript types
```

## 🎮 Funcionalidades

### Gamificação Completa
- **Sistema de XP** com multiplicadores de sequência (1x → 3x)
- **50 Níveis** com 9 ranks (Recruta → Mito)
- **18 missões** diárias com 3 dificuldades
- **3 Boss Battles** (redes sociais, pornografia, jogos)
- **12 conquistas** com raridades (Comum → Épica)
- **Streak system** com tolerância de 48h
- **Modo de Emergência** para momentos de crise

### Autenticação
- Login/Registro com email + senha
- Persistência via localStorage (migrável para Supabase Auth)
- Auto-login ao retornar

### Pagamentos (Stripe)
- 3 planos: Recruta (Grátis), Agente (R$29/mês), Diretor (R$79/mês)
- Checkout via Stripe
- Webhooks para atualização de plano

## ⚙️ Setup

### 1. Clone e instale

```bash
cd operation-reclaim
npm install
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.local.example .env.local
```

Edite `.env.local` com suas credenciais:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_sua_key
STRIPE_SECRET_KEY=sk_test_sua_key
STRIPE_WEBHOOK_SECRET=whsec_seu_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Configure o Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Vá para o SQL Editor
3. Execute o conteúdo de `supabase-schema.sql`
4. Copie a URL e anon key para `.env.local`

### 4. Configure o Stripe

1. Crie uma conta no [Stripe](https://stripe.com)
2. Crie 2 produtos com preços:
   - **Agente:** R$29/mês (recurring)
   - **Diretor:** R$79/mês (recurring)
3. Copie os Price IDs para as variáveis de ambiente
4. Configure o webhook apontando para `https://seu-dominio.com/api/stripe/webhook`
5. Os eventos do webhook: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`

### 5. Rode o projeto

```bash
npm run dev
```

Acesse `http://localhost:3000`

## 🚀 Deploy (Vercel)

```bash
npm i -g vercel
vercel
```

Configure as variáveis de ambiente no painel do Vercel.

## 📊 Métricas Alvo (12 meses)

| Métrica | Meta |
|---------|------|
| Usuários registrados | 50.000 |
| MAU | 15.000 |
| Conversão Free → Paid | 8–12% |
| MRR | R$ 120.000 |
| Churn mensal | < 5% |

## 🔒 Segurança

- Row Level Security (RLS) no Supabase
- Dados de vícios nunca compartilhados
- Senhas hasheadas pelo Supabase Auth
- HTTPS obrigatório em produção
- LGPD compliant

## 📝 Licença

Proprietário — Operation Reclaim © 2026
