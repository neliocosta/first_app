# Projeto: Nord Liberta — fase de especificação

> Este repositório está, nesta fase, dedicado a **especificar** a plataforma Nord Liberta
> (consultoria de planejamento financeiro da Nord Investimentos) — **não a escrever código do
> produto ainda**. O código Rails presente na raiz é herança do esqueleto do repositório e não
> faz parte do produto Nord Liberta.

## Como esta fase funciona

Estamos usando um **Gauntlet Loop**: um painel de 5 agentes especialistas critica a
especificação em rodadas sucessivas até convergência (5/5 satisfeitos).

## Mapa dos documentos

- `docs/nord-liberta/00-contexto-v5.md` — **contexto e metodologia do produto** (leia primeiro).
- `docs/nord-liberta/gauntlet/metodologia-gauntlet.md` — como o loop de crítica funciona.
- `docs/nord-liberta/gauntlet/rodada-NN.md` — log de cada rodada de crítica.
- `docs/nord-liberta/especificacao/` — a especificação sendo iterada (+ `README.md` com o estado).
- `.claude/agents/` — os 5 agentes especialistas do painel.

## Princípios invioláveis do produto

Ver `docs/nord-liberta/00-contexto-v5.md` §9. Em resumo: o exame diagnostica (não prescreve);
aderência mede comportamento, não mercado; silêncio nunca é zero; não infantilizar a tarefa
adulta; linguagem literal no trabalho, metáfora só na celebração; **nunca inventar conteúdo
financeiro** — marcar `⚠ LACUNA`.
