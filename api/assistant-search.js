/** Busca inteligente do Assistente CW — usa Gemini pra interpretar a pergunta em
 *  linguagem natural e escolher qual seção do app melhor responde.
 *  Só é chamado quando a busca local por palavra-chave não encontra nada
 *  (ver src/components/FloatingSearch.tsx). */
const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

/** Espelha (em id/label/descrição) os destinos de src/components/FloatingSearch.tsx.
 *  Se adicionar uma seção nova lá, adicione aqui também. */
const DESTINOS_SDR = [
  { id: 'calculadora', label: 'Calculadora', descricao: 'Montar e comparar propostas de planos' },
  { id: 'totem-faq', label: 'Totem — FAQ', descricao: 'Dúvidas sobre o Totem de Autoatendimento' },
  { id: 'faq', label: 'FAQ', descricao: 'Perguntas frequentes sobre produto e planos' },
  { id: 'changelog', label: 'Changelog', descricao: 'Últimas atualizações da plataforma' },
  { id: 'avisos', label: 'Mural de Avisos', descricao: 'Comunicados e atualizações do time' },
  { id: 'planos-precos', label: 'Planos & Preços', descricao: 'Tabela de planos, módulos e descontos' },
  { id: 'objecoes', label: 'Objeções', descricao: 'Matriz de objeções com scripts prontos' },
  { id: 'spin', label: 'SPIN Selling', descricao: 'Perguntas SPIN por funcionalidade' },
  { id: 'cold-call-aida', label: 'Cold Call — AIDA', descricao: 'Roteiro completo de prospecção' },
  { id: 'hacks', label: 'Hacks de Pré-vendas', descricao: 'Scripts para situações difíceis' },
  { id: 'produto', label: 'Produto', descricao: 'Funcionalidades e integrações do produto (chatbot, IA, KDS, iFood etc.)' },
  { id: 'bant', label: 'BANT', descricao: 'Metodologia de qualificação de leads' },
  { id: 'passagem-bastao', label: 'Passagem de Bastão', descricao: 'Checklist SDR → Closer' },
  { id: 'cultura-estrategia', label: 'Cultura & Estratégia', descricao: 'Missão, visão e valores da CW' },
  { id: 'primeiros-passos', label: 'Primeiros Passos', descricao: 'Primeiro acesso ao portal, senha, planos e cardápios demonstrativos' },
  { id: 'gestao', label: 'Gestão', descricao: 'Gestão de pedidos, mesas, comandas, KDS, caixa, desempenho, catálogo, delivery, clientes, avaliações, fiado, administrativo, configurações, impressora' },
  { id: 'automacao', label: 'Automação', descricao: 'Disparo de campanhas via WhatsApp, chatbot Cardapinho, integrações' },
  { id: 'aumento-vendas', label: 'Aumento de Vendas', descricao: 'Cupons de desconto, fidelidade e cashback' },
  { id: 'modulos-sistema', label: 'Módulos do Sistema', descricao: 'Estoque avançado, módulo financeiro, gestão de entregadores, integração com marketplaces, módulo fiscal' },
  { id: 'suporte', label: 'Suporte', descricao: 'Canais e horários de atendimento, acesso remoto' },
  { id: 'comece-aqui', label: 'Comece Aqui', descricao: 'Boas-vindas, onboarding e glossário' },
  { id: 'historias-sucesso', label: 'Histórias de Sucesso', descricao: 'Hall da fama do time' },
  { id: 'pipeline', label: 'Pipeline', descricao: 'Visão do pipeline de vendas' },
];

const DESTINOS_CLOSER = [
  { id: 'closer-planos', label: 'Planos e Preços', descricao: 'Planos, módulos e franquias' },
  { id: 'closer-descontos', label: 'Descontos', descricao: 'Códigos de desconto (parcerias, negociação, reopen)' },
  { id: 'closer-templates', label: 'Templates', descricao: 'Mensagens prontas para copiar e enviar' },
  { id: 'closer-metas', label: 'Metas', descricao: 'Meta do mês e módulos' },
  { id: 'closer-objecoes', label: 'Objeções', descricao: 'Contorno de objeções com discurso de solução' },
  { id: 'closer-processo', label: 'Processo de Venda', descricao: 'Funis, SPIN, etapas, checklists, critérios e follow-up' },
  { id: 'closer-rotina', label: 'Rotina & Progressão', descricao: 'Hora Ouro, CRM e níveis de carreira' },
  { id: 'closer-concorrentes', label: 'Concorrentes', descricao: 'Comparativo com os principais concorrentes' },
  { id: 'comece-aqui', label: 'Comece Aqui', descricao: 'Boas-vindas, onboarding e glossário' },
  { id: 'historias-sucesso', label: 'Histórias de Sucesso', descricao: 'Hall da fama do time' },
  { id: 'pipeline', label: 'Pipeline', descricao: 'Visão do pipeline de vendas' },
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'POST') return res.status(405).json({ ok: false, erro: 'Método não permitido' });
  if (!API_KEY) return res.status(500).json({ ok: false, erro: 'GEMINI_API_KEY não configurado' });

  const { query, papel } = req.body || {};
  if (!query || typeof query !== 'string') return res.status(400).json({ ok: false, erro: 'query obrigatória' });

  const destinos = papel === 'Closer' ? DESTINOS_CLOSER : DESTINOS_SDR;
  const lista = destinos.map(d => `- id="${d.id}": ${d.label} — ${d.descricao}`).join('\n');

  const prompt = `Você ajuda a rotear a busca de um assistente interno de vendas para a seção certa do app.
Dada a pergunta do vendedor e a lista de seções abaixo, responda com um JSON no formato {"id": "<id-da-secao>"} usando exatamente um dos ids listados, ou {"id": null} se nenhuma seção responder bem à pergunta.

Seções disponíveis:
${lista}

Pergunta do vendedor: "${query}"`;

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json', temperature: 0 },
        }),
      }
    );
    const json = await r.json();
    if (!r.ok) return res.status(502).json({ ok: false, erro: json?.error?.message || 'Erro na API do Gemini' });

    const texto = json?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    let parsed;
    try { parsed = JSON.parse(texto); } catch { parsed = {}; }

    const id = destinos.some(d => d.id === parsed.id) ? parsed.id : null;
    res.status(200).json({ ok: true, id });
  } catch (e) {
    res.status(500).json({ ok: false, erro: String(e) });
  }
}
