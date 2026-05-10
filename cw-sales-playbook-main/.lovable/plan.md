

# Plano: CW Sales Playbook 2.0 — Modo Edição + Experiência Viva para Novatos

Vou entregar a evolução em **duas frentes paralelas**: um **Modo Gestor** que destrava edição completa do portal, e um **conjunto de experiências novas** que tornam a cultura tangível desde o dia 1.

---

## Parte 1 — Modo Gestor (Senha Mestre + Edição Local)

Sem login. Sem banco. Uma senha mestre destrava o **Modo Edição** no navegador do gestor. Tudo que ele alterar é salvo no `localStorage` dele e ele pode **exportar um JSON** para você aplicar de volta no código (ou compartilhar com outros gestores).

### Como funciona (UX)

- Atalho de teclado `Ctrl+Shift+E` ou rodapé discreto da sidebar abre modal pedindo senha mestre.
- Senha correta → ativa **Modo Edição** (banner roxo no topo: "MODO GESTOR ATIVO" + botão "Sair").
- Em Modo Edição, **todo bloco editável ganha um lápis ✏️ no hover**. Clicar abre painel lateral (Sheet) com formulário.
- Botão flutuante "💾 Exportar alterações" gera arquivo `.json` para backup/aplicação no código.
- Botão "📥 Importar" carrega um JSON de outro gestor.
- Botão "↺ Resetar" volta tudo ao padrão do código.

### O que é editável

| Área | O que dá pra editar |
|---|---|
| **Sidebar** | Adicionar/remover/reordenar itens, escolher ícone, mudar label e rota |
| **Mural de avisos** (Dashboard) | CRUD completo (adicionar, editar, deletar, reordenar) |
| **Berserker** | Leaderboard (nomes, squads, pontos, variação), Hall of Fame, métrica do mês |
| **Onboarding** | Adicionar dias, atividades, links, marcar/desmarcar itens como ativos |
| **Cultura** | Editar textos, destaque, badge, cor de qualquer card; adicionar novos cards |
| **Playbook** | Editar todas as 11 abas, adicionar tabs novas, editar cargos, SPIN, BANT, objeções, hacks |
| **Carreira** | Editar critérios de níveis, adicionar/remover SDRs dos tiers |
| **Gestão** | Editar notas das 5 dimensões, comportamentos de liderança, níveis Maxwell |
| **Estratégia** | Missão, visão, valores (incluindo exemplos), pilares operacionais |
| **Rituais (Agenda)** | Editar todos os campos de cada ritual, adicionar rituais novos |

### Limitação honesta

Como tudo fica no `localStorage`, **as edições são individuais** — o que o gestor A salva não aparece para o gestor B nem para os SDRs. Para distribuir, ele exporta o JSON e:
- Compartilha com outro gestor para importar, **ou**
- Te envia para que você aplique como versão oficial no código.

> Se mais tarde quiser que as edições virem realidade compartilhada para todo o time, é só ativar Lovable Cloud e migrar o storage local para o banco — a estrutura já fica preparada para isso.

---

## Parte 2 — Onboarding Expandido (13 dias completos da planilha)

A planilha tem **13 dias estruturados**, hoje só temos 3. Vou expandir para o checklist completo:

- **Dia 1**: Imersão Organizacional (14 itens)
- **Dia 2**: Checklist + 1º Roleplay
- **Dia 3**: 2º Roleplay + jornada do cliente
- **Dia 4**: Imersão técnica P1 + curso Sales Engagement + 3º Roleplay
- **Dia 5**: ICP, Rapport, BANT, SPIN (com links dos artigos) + 4º Roleplay
- **Dia 6**: Estudos de SPIN/BANT/Objeções (exercícios práticos) + 5º Roleplay
- **Dia 7**: Produto + 4 módulos do sistema + 6º Roleplay (Abertura/Rapport)
- **Dia 8**: Sandbox prático (cardápio, cupom, fidelidade, disparo, áreas) + 7º Roleplay (SPIN)
- **Dia 9**: Plataformas (Meetime, Kommo, Pipedrive) + escutar prospecções reais + 8º Roleplay (BANT)
- **Dia 10**: Métricas + cultura + 9º Roleplay (Encerramento/Compromisso)
- **Dia 11**: Avaliação final + 10º Roleplay completo
- **Dia 12-13**: Treinamento de ligações com liderança

**Novidades visuais**:
- Cada item tem ícone de tipo (📖 leitura, 🎬 vídeo, 🎯 prática, 🗣️ roleplay, 🔗 link)
- Itens com link viram botões clicáveis (não só checkbox)
- **Tracker de Roleplays** dedicado: 10 cards (1º ao 10º) onde o novato registra feedback positivo e construtivo de cada um
- **Banco de perguntas SPIN** (formulário para preencher Situação/Problema/Implicação/Necessidade nos 3 cenários da planilha)
- **Banco de objeções** (formulário para escrever contornos de "Uso outro sistema", "Achei caro", etc.)
- **1ª Reunião de 1:1** (template com as 14 perguntas da planilha para o novato preparar)

---

## Parte 3 — Página "Comece Por Aqui" (`/start`)

Landing dedicada para os primeiros 30 dias. Detecta visitante novo via `localStorage` e oferece tour.

Conteúdo:
- **Hero**: vídeo de boas-vindas (slot que o gestor preenche) + nome do padrinho de plantão
- **Próximas tarefas**: top 3 itens não-concluídos do onboarding com CTA direto
- **Quem é quem**: grid de cards com fotos, nomes, cargos e "como me chamar" (Slack handle) — editável pelo gestor
- **Glossário CW**: BANT, SPIN, ICP, SAL, MQL, Tier, Cumbuca, Berserker, Hora de Ouro, Squad — com definição em 1 frase
- **Linha do tempo da empresa**: 2014 → 2024 → visão 2040, marcos importantes
- **FAQ do novato**: "Posso errar no roleplay?", "Quanto tempo até bater meta?", "O que acontece se eu não ler a Cumbuca?"

---

## Parte 4 — Cultura Interativa (não só cards)

Reforma da seção `/cultura` para sair do estático:

- **Mural do time**: galeria de fotos (gestor faz upload) com legendas — comemorações, off-sites, batidas de meta
- **Hall de Histórias de Vitória**: cases reais de SDRs (texto + foto + métrica) — "Como o Marcos virou o jogo no Berserker de Janeiro"
- **Depoimentos rápidos**: card carrossel com falas de veteranos sobre cada valor
- **"A semana na CW"**: timeline horizontal com momentos da semana atual (gestor adiciona)
- **Grito de Guerra interativo**: botão grande que toca som da buzina (arquivo MP3) + animação confetti laranja/roxa
- **Mood meter**: enquete semanal anônima (1-5) "como foi sua semana?" — salva local

---

## Parte 5 — Gamificação Leve para Novatos

Sem ranking, só celebração:

- **Barra de XP do Onboarding** no header (% concluído com cor evoluindo de roxo claro → roxo intenso)
- **Badges desbloqueáveis** ao completar marcos:
  - 🌱 "Primeiro Dia" (Dia 1 completo)
  - 📚 "Estudioso" (todas as leituras de SPIN/BANT)
  - 🎭 "Roleplayer" (5 roleplays registrados)
  - ⚙️ "Mestre do Sandbox" (Dia 8 completo)
  - 🚀 "Pronto para Voar" (Dia 11 — avaliação final)
- **Celebração visual** (modal + confete) ao desbloquear badge
- **Página /badges** mostra todos com "bloqueado/desbloqueado"
- **Easter egg**: ao completar 100% do onboarding, libera animação especial + mensagem do CEO

---

## Parte 6 — Melhorias menores transversais

- **Busca global** (`Ctrl+K`) que pesquisa em rituais, valores, cargos, glossário, objeções
- **Breadcrumbs** em todas as páginas internas
- **Modo "imprimir"** para playbook (PDF-friendly)
- **Atalhos de teclado** (`g d` = dashboard, `g a` = agenda, etc.)
- **Botão "Copiar"** ao lado de cada objeção/SPIN para o SDR usar na ligação

---

## Detalhes técnicos

**Estrutura nova de arquivos**:
```text
src/
├── admin/
│   ├── EditorContext.tsx          # Estado global de Modo Edição
│   ├── PasswordGate.tsx           # Modal de senha mestre
│   ├── EditorBanner.tsx           # Faixa "MODO GESTOR ATIVO"
│   ├── EditButton.tsx             # Lápis ✏️ que aparece no hover
│   ├── EditPanel.tsx              # Sheet lateral com formulário dinâmico
│   ├── ExportImport.tsx           # Botões de JSON
│   └── schemas.ts                 # Zod schemas por tipo de conteúdo
├── store/
│   └── contentStore.ts            # Zustand + persist (localStorage)
│       # Mescla dados padrão (data/*.ts) com overrides locais
├── hooks/
│   ├── useEditableContent.ts      # Hook por seção (substitui imports diretos)
│   ├── useBadges.ts               # Cálculo de badges desbloqueados
│   └── useGlobalSearch.ts         # Cmd+K
├── pages/
│   ├── Start.tsx                  # /start
│   └── Badges.tsx                 # /badges
├── components/
│   ├── search/CommandPalette.tsx
│   ├── cultura/MuralFotos.tsx
│   ├── cultura/HistoriasVitoria.tsx
│   ├── cultura/SemanaCW.tsx
│   ├── onboarding/RoleplayTracker.tsx
│   ├── onboarding/SpinBank.tsx
│   ├── onboarding/ObjecoesBank.tsx
│   ├── onboarding/PrimeiroOneOnOne.tsx
│   └── start/(WelcomeHero|TimeGrid|Glossario|TimelineEmpresa|FAQ).tsx
└── data/
    ├── onboarding.ts              # expandido para 13 dias
    ├── badges.ts                  # definições e regras de desbloqueio
    ├── glossario.ts
    ├── time.ts                    # quem é quem
    └── timelineEmpresa.ts
```

**Padrão de edição**: cada componente que renderiza conteúdo editável usa `useEditableContent('chave')` em vez de importar do `data/*.ts` direto. O hook devolve a versão final (override do localStorage OU padrão). O `EditButton` só aparece se `EditorContext.isEditing === true`.

**Senha mestre**: armazenada como hash SHA-256 no código (ex.: `cw-berserker-2026`). Não é segurança real — é portão. Limitação será comunicada ao usuário.

**Persistência**: Zustand com middleware `persist` em `localStorage` chave `cw-portal-overrides`. Schema versionado para permitir migrações futuras.

**Export/Import**: JSON com `{ version, exportedAt, overrides }`. Validado com Zod no import.

**Roteamento novo**: `/start`, `/badges` adicionados ao `App.tsx`. Sidebar ganha link "🚀 Comece Aqui" no topo (visível só nos primeiros 30 dias do usuário, controlado por flag local).

**Som da buzina**: arquivo MP3 em `/public/sounds/buzina.mp3` (placeholder — gestor pode trocar pelo modo edição).

---

## Ordem de entrega sugerida

1. Infraestrutura do Modo Gestor (PasswordGate + Context + Store + Export/Import) — base que destrava o resto
2. Onboarding expandido para 13 dias + Roleplay Tracker + bancos SPIN/Objeções
3. Página `/start` com Hero, Time, Glossário, Timeline, FAQ
4. Gamificação (Badges + XP bar)
5. Cultura Interativa (Mural, Histórias, Buzina sonora)
6. Edição inline em todas as áreas (Cultura, Playbook, Berserker, Sidebar, etc.)
7. Polimentos: busca global, breadcrumbs, atalhos

Posso entregar tudo em sequência num único ciclo grande, ou quebrar em entregas menores se preferir validar passo a passo.

