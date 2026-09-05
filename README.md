# Duolingo Adulto 🏠❤️

Jogo do casal para tarefas da casa e cuidados com o relacionamento.
Mobile-first, paleta rosa bebê + azul marinho.

## Stack

- **Next.js 15** (App Router) — frontend + BFF nas rotas `/api/*`
- **Prisma** + **Postgres** (Supabase)
- **Tailwind CSS**
- Deploy: **Vercel**

## Rodando localmente

```bash
cp .env.example .env
# edite .env colocando DATABASE_URL e DIRECT_URL do Supabase

npm install
npx prisma migrate deploy   # ou: npx prisma db push
npm run db:seed             # popula atividades + jogadores
npm run dev
```

Abra http://localhost:3000

## Deploy na Vercel

1. Crie um projeto Postgres no Supabase.
2. Copie:
   - **Connection Pooling** (porta 6543, `?pgbouncer=true`) → `DATABASE_URL`
   - **Direct connection** (porta 5432) → `DIRECT_URL`
3. Faça push do repo pro GitHub e importe na Vercel.
4. Em **Environment Variables**, adicione `DATABASE_URL` e `DIRECT_URL`.
   (Opcional: `PLAYER_NAVY_NAME`, `PLAYER_PINK_NAME`.)
5. No primeiro deploy o build roda `prisma migrate deploy`.
6. Rode o seed uma vez:
   ```bash
   npx prisma db seed
   ```
   Ou acesse `GET /api/setup` (cria os jogadores).
   Para popular as atividades, rode o seed local com o `DATABASE_URL` da produção.

## Rotas BFF

- `GET /api/setup` — cria os 2 jogadores (idempotente)
- `GET /api/activities?category=CASA|CASAL&q=texto`
- `POST /api/completions` — `{ activityId, playerId }`
- `DELETE /api/completions?id=...`
- `GET /api/stats` — placar por jogador × categoria (mês/ano/total)
- `GET /api/calendar?category=CASA|CASAL&days=180`

## Regras dos calendários

- **Casa**: 6+ atividades no dia → nível máximo.
- **Casal**: 3+ atividades no dia → nível máximo.
- Contagem é por número de atividades, **não** por pontos.
