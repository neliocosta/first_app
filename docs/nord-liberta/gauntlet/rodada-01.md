# Gauntlet — Rodada 01 (crítica da v0 → produz v1)

**Versão criticada:** `especificacao-v0.md`
**Placar:** 0/5 SATISFEITO

| Especialista | Veredito |
|---|---|
| Cliente (Ricardo) | ❌ NÃO SATISFEITO |
| Psicólogo comportamental | ❌ NÃO SATISFEITO |
| Redator / conteúdo | ❌ NÃO SATISFEITO |
| Planejador CFP (Monique) | ❌ NÃO SATISFEITO |
| Engenheiro de software | ❌ NÃO SATISFEITO |

## Diagnóstico comum

A v0 é fiel ao contexto no **esqueleto** (Vertical→Projeto→Tarefa, inventário no lugar de nota,
aderência = comportamento), mas **descreve princípios sem instanciar o produto**: faltam telas
concretas, um exemplo montado, o modelo de dados implementável e — sobretudo — a copy e o canal
(WhatsApp) que fazem a experiência acontecer.

## Bloqueantes por especialista

**Cliente (Ricardo)**
- B1 Tela de **linha do tempo / horizonte dos objetivos** (métrica-norte: "como chego lá").
- B2 **Uma devolutiva de exemplo** instanciada ponta a ponta.
- B3 **Score é caixa-preta** (fórmula = LACUNA); cercar honestamente na tela.

**Planejador CFP (Monique)**
- B1 `verticalId` em `ValorColetado` + **schema de coleta por vertical** (Riscos/Tributário/Sucessório).
- B2 **Radar/fila de triagem** do consultor (gatilhos, ordenação, SLA) — motor de escala.
- B3 **Montagem assistida da devolutiva** (módulo ↔ projetos ↔ quiz → playlist pré-sugerida).
- B4 **Reenquadrar o comitê** — eliminar autocertificação de suitability pelo cliente (fiduciário).
- B5 **Propagar proveniência aos números derivados** + declarar premissas de projeção.

**Redator**
- B1 **5 rótulos das faixas 0–100** (descrevem a situação, nunca a pessoa).
- B2 **Roteiros de WhatsApp**.
- B3 **Copy da consequência "sem moralizar"**.
- B4 Remover **"aderente/aderência"** de qualquer superfície do cliente.

**Engenheiro**
- B1 Separar **template × instância** no núcleo (senão o 101º módulo quebra).
- B2 Modelar **permissão/sugestão/proveniência + matriz de acesso + LGPD** como dado.
- B3 **Mapa de navegação + máquina de estados de fase + schema de persistência**.

**Psicólogo comportamental**
- B1 **Roteiros de WhatsApp como Prompt do B=MAP** (Fogg) — sem o cue externo, a cadência mensal não dispara.
- B2 **Fluxo de win-back/recaída** (fresh start effect).
- B3 **Métrica-norte comportamental** (não só cognitiva) — fechar o intention–action gap.
- B4 **Implementation intentions** nas tarefas (Gollwitzer) — "quando X, eu faço Y".

## Convergências (peso máximo na síntese)

1. **WhatsApp** — CFP + Redator + Psicólogo + Cliente. → nova seção completa (o "Prompt").
2. **Modelo de dados template/instância + coleta por vertical + proveniência propagada** — Eng + CFP.
3. **Montagem assistida / contrato quiz→devolutiva** — CFP + Eng.
4. **Comitê reenquadrado** (fiduciário + não virar ritual) — CFP + Psicólogo.
5. **Visão de futuro + inventário/aderência visíveis ao cliente + gain-frame do prazo** — Cliente + CFP + Psicólogo.
6. **Devolutiva de exemplo instanciada** — Cliente + CFP.

## Conflitos resolvidos (racional registrado)

- **Cliente quer números concretos × princípio "não inventar conteúdo financeiro" (§9.10).**
  Resolução: incluir **uma devolutiva de exemplo marcada `ILUSTRATIVO`** (persona fictícia
  Ricardo, números fictícios) para o cliente *ver* o produto, sem alegar metodologia oficial;
  fórmulas reais seguem `⚠ LACUNA` da consultoria.
- **"Hábito mensal" (produto) × evidência (Wood: mensal não forma automaticidade).**
  Resolução: renomear para **"rotina mensal disparada por cue externo (WhatsApp)"**; não prometer
  hábito automático.
- **"Aderência" (métrica interna, CFP/Eng) × jargão na tela (Redator).**
  Resolução: manter "aderência" como **termo interno**; na tela do cliente, "no rumo do seu plano".
- **Métrica-norte cognitiva (Cliente) × comportamental (Psicólogo).**
  Resolução: **combinar** — clareza percebida como desfecho sentido + indicadores comportamentais
  líderes (aportes feitos ÷ combinados, tarefas concluídas).

→ Todas as exigências Bloqueantes e a maioria das Importantes foram endereçadas na `especificacao-v1.md`.
