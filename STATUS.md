# Operation Reclaim — Documentação do Projeto

## Visão Geral

SaaS B2C de saúde digital e desenvolvimento pessoal que combina ciência comportamental (Hábitos Atômicos de James Clear) com mecânicas de RPG e gamificação profunda para ajudar pessoas a superar três vícios digitais: **redes sociais**, **pornografia** e **jogos eletrônicos**.

**Stack:** Next.js 16 + TypeScript + Supabase + Stripe  
**Deploy:** Vercel (produção)  
**Repo:** https://github.com/mtslmdcnc637/operation-reclaim  
**Produção:** https://operation-reclaim.vercel.app

---

## ✅ O que foi feito

### Frontend (Completo)

- **Landing Page** — Tema dark cinematográfico com:
  - Hero com animação typewriter
  - Seção "A Verdade" com estatísticas
  - Seção "Os Três Inimigos" (3 cards)
  - Seção "O Protocolo" (baseado em Hábitos Atômicos)
  - Seção de Pricing (3 planos)
  - CTA final
  - Partículas flutuantes de fundo
  - Responsivo (mobile/tablet/desktop)

- **Sistema de Autenticação** — Modal de login/registro com:
  - Validação de campos
  - Integração com Supabase Auth
  - Persistência de sessão

- **Dashboard** com sidebar responsiva:
  - **Painel Central** — Quote diária, stats (nível, XP, streak, missões), status dos bosses
  - **Missões** — Lista de missões diárias com dificuldade, XP, dano ao boss
  - **Inimigos** — 3 bosses com HP bar, botão de ataque, estados visuais
  - **Conquistas** — 12 achievements com raridades
  - **Perfil** — Stats detalhados, progressão de ranks

- **Sistema de Gamificação** (client-side via Zustand):
  - XP com multiplicadores de streak (1x → 3x)
  - 50 níveis com 9 ranks (Recruta → Mito)
  - 18 missões no pool (3 geradas por dia)
  - 12 conquistas com condições
  - Modo de Emergência (timer + respiração)
  - Notificações toast
  - Modal de Level Up

### Backend (Completo — 9 API Routes)

| Rota | Método | Função |
|------|--------|--------|
| `/api/auth/register` | POST | Registro com Supabase Auth |
| `/api/auth/login` | POST | Login com Supabase Auth |
| `/api/auth/logout` | POST | Logout |
| `/api/game/state` | GET | Buscar estado completo do jogo |
| `/api/game/checkin` | POST | Check-in diário (streak + XP + dano) |
| `/api/game/mission` | POST | Completar missão (XP + dano + bônus) |
| `/api/game/attack` | POST | Ataque manual ao boss |
| `/api/stripe/checkout` | POST | Criar sessão de pagamento Stripe |
| `/api/stripe/webhook` | POST | Webhook do Stripe |

### Database (Supabase — Completo)

**5 tabelas com RLS:**
- `profiles` — Dados do usuário (email, code_name, plano)
- `game_states` — Estado do jogo (nível, XP, streak, conquistas)
- `addictions` — Poder dos 3 vícios (0-100)
- `mission_history` — Histórico de missões completadas
- `checkin_history` — Histórico de check-ins

**3 functions:**
- `handle_new_user()` — Auto-cria perfil + game_state + addictions no signup
- `damage_all_addictions()` — Reduz poder de todos os vícios
- `update_updated_at()` — Auto-atualiza timestamp

**3 triggers:** Auto-update de timestamps

### Pagamentos (Stripe — Completo)

- Produto "Agente" → R$29/mês (`price_1TQxYsRmRF7GfyG9uqjrm3OD`)
- Produto "Diretor" → R$79/mês (`price_1TQxYzRmRF7GfyG9al7vTxJM`)
- Checkout Session API
- Webhook handler

### Infraestrutura

- **Vercel** — Deploy automático do GitHub
- **8 Environment Variables** configuradas no Vercel
- **CSS Puro** — Sem Tailwind, CSS escrito na mão (17KB)
- **GitHub** — Repo público com 6 commits

---

## ❌ O que falta fazer

### Prioridade Alta

1. ~~**Integrar Supabase Auth no frontend**~~ ✅ FEITO
   - AuthModal usa `supabase.auth.signUp()` e `signInWithPassword()`
   - Landing page verifica sessão Supabase
   - Dashboard carrega estado do Supabase via `loadState()`

2. ~~**Integrar game state com Supabase**~~ ✅ FEITO
   - Store chama API routes (`/api/game/*`) em vez de localStorage
   - Check-in, missões e ataques salvos no banco via API
   - `loadState()` busca profile, game_state e addictions do Supabase

3. **Configurar Webhook do Stripe** — Precisa de ação manual
   - Stripe Dashboard → Developers → Webhooks → Add endpoint
   - URL: `https://operation-reclaim.vercel.app/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`

4. **Testar fluxo completo**
   - Registro → Login → Check-in → Missões → Ataque → Level Up
   - Pricing → Checkout Stripe → Atualização de plano

### Prioridade Média

5. **Migrar auth para Supabase Auth real**
   - Usar `@supabase/ssr` para cookies de sessão
   - Middleware para proteger rotas `/dashboard/*`
   - Atualizar AuthModal para usar Supabase Auth

6. **Adicionar Supabase no client**
   - Criar client Supabase com `createBrowserClient`
   - Usar para queries diretas quando necessário

7. **Melhorar o sistema de missões**
   - Salvar missões do dia no Supabase (não só no client)
   - Evitar repetição de missões nas últimas 48h
   - Pool de missões expansível

8. **Adicionar mais missões ao pool**
   - Atualmente 18 missões no pool
   - PRD sugere expansão contínua
   - Adicionar missões de dificuldade "Lendária" (Fase 2)

### Prioridade Baixa

9. **Ranking global (Fase 2)**
   - Leaderboard de usuários
   - Tela de ranking no dashboard

10. **Modo Accountability (Fase 2)**
    - Sistema de parceiros
    - Desbloqueado no nível 15

11. **Coach virtual com IA (Fase 2)**
    - Integração com LLM
    - Desbloqueado no nível 20

12. **Comunidade secreta (Fase 2)**
    - Acesso desbloqueado no nível 40
    - Pode ser Discord ou forum integrado

13. **Referência de amigo (Fase 2)**
    - Sistema de referral
    - +500 XP por referência

14. **Personalização de avatar (Fase 2)**
    - Desbloqueado no nível 7
    - Opções visuais progressivas

15. **LGPD Compliance**
    - Consentimento explícito no registro
    - Direito ao esquecimento
    - Exportação de dados

16. **Testes**
    - Testes unitários para game engine
    - Testes de integração para API routes
    - Testes E2E para fluxos críticos

---

## 🔧 Como rodar localmente

```bash
# 1. Clone o repo
git clone https://github.com/mtslmdcnc637/operation-reclaim.git
cd operation-reclaim

# 2. Instale dependências
npm install

# 3. Configure variáveis de ambiente
cp .env.local.example .env.local
# Preencha com suas credenciais do Supabase e Stripe

# 4. Rode o schema SQL no Supabase
# Copie o conteúdo de supabase-schema.sql e cole no SQL Editor do Supabase

# 5. Rode o projeto
npm run dev
```

Acesse `http://localhost:3000`

---

## 📊 Métricas Alvo (12 meses)

| Métrica | Meta |
|---------|------|
| Usuários registrados | 50.000 |
| MAU | 15.000 |
| Conversão Free → Paid | 8–12% |
| MRR | R$ 120.000 |
| Churn mensal | < 5% |
| NPS | > 60 |
| Retenção D30 | > 40% |
| Retenção D90 | > 25% |

---

## 🗂 Estrutura do Projeto

```
operation-reclaim/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing Page
│   │   ├── layout.tsx                  # Root Layout
│   │   ├── globals.css                 # CSS puro (17KB)
│   │   ├── dashboard/
│   │   │   ├── layout.tsx              # Dashboard Layout (sidebar)
│   │   │   ├── page.tsx                # Painel Central
│   │   │   ├── missions/page.tsx       # Missões
│   │   │   ├── enemies/page.tsx        # Boss Battles
│   │   │   ├── achievements/page.tsx   # Conquistas
│   │   │   └── profile/page.tsx        # Perfil
│   │   └── api/
│   │       ├── auth/                   # Login, Register, Logout
│   │       ├── game/                   # State, Checkin, Mission, Attack
│   │       └── stripe/                 # Checkout, Webhook
│   ├── components/auth/                # AuthModal
│   ├── lib/
│   │   ├── store/                      # Zustand (estado global)
│   │   ├── game-engine/                # XP, levels, ranks, missões
│   │   /data/                          # Constantes (missões, ranks, quotes)
│   │   ├── supabase/                   # Client Supabase
│   │   └── stripe/                     # Integração Stripe
│   └── types/                          # TypeScript types
├── supabase-schema.sql                 # Schema do banco de dados
├── .env.local.example                  # Template de variáveis
└── README.md                           # Documentação principal
```

---

## 🔑 Variáveis de Ambiente

| Variável | Descrição | Onde obter |
|----------|-----------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave pública do Supabase | Supabase → Settings → API → anon |
| `STRIPE_SECRET_KEY` | Chave secreta do Stripe | Stripe → Developers → API keys |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Chave pública do Stripe | Stripe → Developers → API keys |
| `STRIPE_PRICE_AGENTE` | Price ID do plano Agente | Stripe → Products → Price |
| `STRIPE_PRICE_DIRETOR` | Price ID do plano Diretor | Stripe → Products → Price |
| `STRIPE_WEBHOOK_SECRET` | Secret do webhook Stripe | Stripe → Webhooks → Signing secret |
| `NEXT_PUBLIC_APP_URL` | URL do app em produção | Vercel |

---

*Documento gerado em 28 de Abril de 2026*
