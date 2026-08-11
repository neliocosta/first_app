# Nord Liberta — demo navegável v1.0

Protótipo front-end da plataforma Nord Liberta. **Dados mockados**, sem backend e sem auth.
Escopo e decisões: `../docs/nord-liberta/decisoes-v1-demo.md`.
Especificação que ele materializa: `../docs/nord-liberta/especificacao/especificacao-v3.md`.

## Rodar

```bash
cd demo
npm install
npm run dev      # http://localhost:5173
```

## O que dá para navegar

**Cliente (mobile-first, navy full-bleed)**
- **Exame** — 33 perguntas reais, uma por tela, 6 condicionais, barra adaptativa que nunca
  retrocede, input de moeda com chips + "varia muito". A pergunta 14 espelha os bens marcados
  na 13 (correção do bug de produção).
- **Resultado** — score 0–100 com smart animate, faixa que descreve a situação (nunca a pessoa)
  e o aviso honesto de que a fórmula oficial é lacuna.
- **Devolutiva** — 7 capítulos, cada um em 4 telas: conceito (vídeo) → os seus números (com
  "como chegamos nesse número" e proveniência) → a decisão → as tarefas nascem.
- **Seu plano de ação** — as 7 tarefas por mês, cada uma com ↩ link ao capítulo de origem,
  e a cascata de prioridade co-decidida.
- **Início** — próximo objetivo como herói, ciclo mensal completo (tarefas, comitê, aporte,
  reciclagem, fecho de progresso) e o mock da tela do WhatsApp.
- **Minha jornada** — todos os objetivos na linha do tempo, incluindo a venda da ótica em 2036;
  botão que simula o mês apertado e mostra o prazo recuando **com o caminho de volta ao lado**.
- **Plano** — inventário por vertical; Gestão de Ativos com o selo "aguardando metodologia".
- **Minhas informações** — proveniência humana por campo, lacunas cinza e "sugerir correção".
- **Educação** — coleção (vitrine) + 1 quiz jogável.

**Consultor (desktop)** — radar/fila de triagem com SLA e capacidade; montagem assistida da
devolutiva (playlist pré-sugerida com liga/desliga).

**Controles do protótipo** (barra superior): switch cliente/consultor, "pular o exame" e
"reiniciar" (limpa o namespace `nl:v1:cliente:*` do localStorage e recarrega o seed).

## Pendências

- **Logos oficiais**: colocar `nord-liberta-color.png` e `nord-liberta-white.png` em
  `public/assets/logo/`. Enquanto isso, o símbolo é uma recriação em SVG.
- Números e copy marcados como demonstração; itens de consultoria/compliance no Anexo A da spec.
