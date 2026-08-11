/**
 * ADIÇÕES À COLETA — sugeridas pelo painel do Gauntlet (Rodada 5)
 *
 * Cada campo carrega `sugeridoPor` para rastreabilidade. Nada aqui inventa metodologia:
 * onde a resposta depende de política da consultoria, o campo está marcado `⚠ LACUNA`
 * na `nota` e não alimenta cálculo nenhum.
 *
 * Convergências (mais de um agente pediu a mesma coisa) vêm primeiro em cada seção.
 */
/** Tipos duplicados aqui para evitar ciclo de import com coleta.js. */
const TIPO = {
  TEXTO: 'texto', MOEDA: 'moeda', NUMERO: 'numero', DATA: 'data', MES: 'mes',
  EMAIL: 'email', TEL: 'tel', SIMNAO: 'simNao', SELECAO: 'selecao', MULTI: 'multi',
  ESCALA: 'escala', AREA: 'area', ARQUIVO: 'arquivo', CALCULADO: 'calculado',
};

export const SECOES_NOVAS = [
  {
    id: 's12', numero: '12', titulo: 'A sua empresa', vertical: 'tributario', icone: 'trending-up',
    nota: 'Seção nova. Para o cliente empresário, é onde mora a maior parte do patrimônio, toda a renda e a maior alavanca tributária — e o formulário atual não tinha um único campo sobre isso.',
    grupos: [
      {
        titulo: 'Estrutura e regime', campos: [
          { chave: 'emp.participacao', rotulo: 'Qual a sua participação na empresa?', tipo: TIPO.NUMERO, unidade: '%', sugeridoPor: 'CFP' },
          { chave: 'emp.regime', rotulo: 'Regime tributário da empresa', tipo: TIPO.SELECAO,
            opcoes: ['Simples Nacional', 'Lucro Presumido', 'Lucro Real', 'Não sei'], sugeridoPor: 'CFP',
            ajuda: 'Determina a eficiência da retirada e se há contribuição ao INSS' },
          { chave: 'emp.proLabore', rotulo: 'Pró-labore mensal', tipo: TIPO.MOEDA, sugeridoPor: 'CFP' },
          { chave: 'emp.dividendos', rotulo: 'Distribuição de lucros mensal', tipo: TIPO.MOEDA, sugeridoPor: 'CFP' },
          { chave: 'emp.contribuiINSS', rotulo: 'Você contribui para o INSS?', tipo: TIPO.SIMNAO, sugeridoPor: 'CFP',
            ajuda: 'Pré-condição legal do benefício do PGBL — sem isso a dedução é zero' },
          { chave: 'emp.socios', rotulo: 'Quantos sócios, e quem são?', tipo: TIPO.AREA, sugeridoPor: 'CFP' },
          { chave: 'emp.acordoSocios', rotulo: 'Existe acordo de sócios?', tipo: TIPO.SIMNAO, sugeridoPor: 'CFP' },
          { chave: 'emp.clausulaFalecimento', rotulo: 'O contrato social diz o que acontece se um sócio morrer?', tipo: TIPO.SIMNAO,
            sugeridoPor: 'CFP + Cliente', revelaSe: { campo: 'emp.acordoSocios', igual: 'Sim' } },
        ],
      },
      {
        titulo: 'Valor e venda', campos: [
          { chave: 'emp.valorEstimado', rotulo: 'Quanto vale a empresa hoje?', tipo: TIPO.MOEDA, sugeridoPor: 'CFP + Cliente' },
          { chave: 'emp.baseAvaliacao', rotulo: 'De onde vem esse valor?', tipo: TIPO.SELECAO,
            opcoes: ['Laudo de avaliação', 'Múltiplo de faturamento', 'Proposta recebida', 'Estimativa do cliente'],
            sugeridoPor: 'CFP + Cliente',
            nota: '⚠ LACUNA: a política de avaliação (qual múltiplo, quando exigir laudo) precisa vir da consultoria.' },
          { chave: 'emp.valorSemVoce', rotulo: 'Quanto vale a empresa se você não estiver nela?', tipo: TIPO.MOEDA,
            sugeridoPor: 'Cliente', ajuda: 'É este número, e não o valor de mercado, que a família herda' },
          { chave: 'emp.custoAquisicao', rotulo: 'Custo de aquisição da participação', tipo: TIPO.MOEDA, sugeridoPor: 'CFP' },
          { chave: 'emp.dataAquisicao', rotulo: 'Data de aquisição', tipo: TIPO.DATA, sugeridoPor: 'CFP' },
          { chave: 'emp.custoNaDIRPF', rotulo: 'Esse custo consta na sua declaração de IR?', tipo: TIPO.SIMNAO, sugeridoPor: 'CFP',
            ajuda: 'Ganho de capital na venda = preço − custo. É o campo de maior impacto aritmético do plano' },
          { chave: 'emp.formatoVenda', rotulo: 'Como você imagina a venda: à vista, parcelada, com earn-out?', tipo: TIPO.AREA, sugeridoPor: 'Cliente' },
          { chave: 'emp.planoB', rotulo: 'E se não aparecer comprador, qual é o plano B?', tipo: TIPO.AREA, sugeridoPor: 'Cliente' },
          { chave: 'emp.filhosSucessao', rotulo: 'Seus filhos querem — e conseguem — tocar a empresa?', tipo: TIPO.AREA,
            sugeridoPor: 'Cliente', ajuda: 'Define se o caso é sucessão familiar ou venda' },
        ],
      },
      {
        titulo: 'Renda, dependência e o vão até a aposentadoria', campos: [
          { chave: 'emp.rendaEntreVendaEAposentadoria', rotulo: 'Entre a venda e a aposentadoria, de onde vem sua renda mensal?', tipo: TIPO.AREA,
            sugeridoPor: 'Cliente',
            ajuda: 'O plano manda aportar até a aposentadoria, mas a fonte da renda acaba na venda. É o vão que nenhuma tela via' },
          { chave: 'emp.custoDeVidaPelaEmpresa', rotulo: 'Quanto do seu custo de vida passa hoje pela empresa?', tipo: TIPO.MOEDA,
            sugeridoPor: 'Cliente', ajuda: 'Carro, combustível, plano de saúde, celular, contador — migram para o bolso no dia da venda' },
          { chave: 'emp.variacaoRenda', rotulo: 'Quanto sua renda varia entre o pior e o melhor mês do ano?', tipo: TIPO.AREA,
            sugeridoPor: 'Cliente', ajuda: 'Renda fixa é ficção para dono de negócio — e o ciclo mensal cobra por igual' },
          { chave: 'emp.dependeDeVoce', rotulo: 'O faturamento depende da sua presença pessoal?', tipo: TIPO.ESCALA,
            opcoes: ['1 - Nada', '2', '3', '4', '5 - Totalmente'], sugeridoPor: 'CFP' },
          { chave: 'emp.mesesSemVoce', rotulo: 'Se você ficar doente ou inválido amanhã, quantos meses a empresa funciona sem você?', tipo: TIPO.NUMERO,
            unidade: 'meses', sugeridoPor: 'Cliente', ajuda: 'Para dono de negócio, invalidez costuma ser pior que morte: a renda para e o custo continua' },
          { chave: 'emp.avalPessoal', rotulo: 'Você deu aval ou garantia pessoal em dívida da empresa?', tipo: TIPO.SIMNAO, sugeridoPor: 'Cliente' },
          { chave: 'emp.bemEmGarantia', rotulo: 'Qual bem seu está dado em garantia?', tipo: TIPO.AREA,
            sugeridoPor: 'Cliente', revelaSe: { campo: 'emp.avalPessoal', igual: 'Sim' },
            ajuda: 'Um aval pode consumir o patrimônio pessoal inteiro — e hoje isso não aparece em lugar nenhum' },
        ],
      },
    ],
  },
  {
    id: 's13', numero: '13', titulo: 'Sucessão', vertical: 'sucessorio', icone: 'users',
    nota: 'Seção nova. O formulário tinha um único campo de texto livre para toda a vertical sucessória — e o produto prescrevia testamento sem conhecer regime de bens nem herdeiros.',
    grupos: [
      {
        titulo: 'Base legal da sucessão', campos: [
          { chave: 'suc.regimeBens', rotulo: 'Qual o regime de bens do seu casamento ou união estável?', tipo: TIPO.SELECAO,
            opcoes: ['Comunhão parcial', 'Comunhão universal', 'Separação total convencional', 'Separação obrigatória',
                     'Participação final nos aquestos', 'União estável sem contrato escrito', 'Não sei'],
            sugeridoPor: 'CFP + Cliente', obrigatorio: true, ancora: true,
            revelaSe: { campo: 'pes.estadoCivil', diferenteDe: 'Solteiro(a)' },
            ajuda: 'Define meação x herança. Sem isto, recomendar testamento é palpite — e pode ser materialmente errado' },
          { chave: 'suc.ufDomicilio', rotulo: 'UF de domicílio fiscal', tipo: TIPO.SELECAO, sugeridoPor: 'CFP',
            opcoes: ['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'PE', 'CE', 'GO', 'DF', 'Outra'],
            nota: '⚠ LACUNA: a tabela de alíquotas de ITCMD por UF e a premissa de custo de inventário precisam vir da consultoria.' },
        ],
      },
      {
        titulo: 'Herdeiros', repetivel: true, rotuloItem: 'Herdeiro', sugeridoPor: 'CFP',
        nota: 'Conjunto diferente de "Dependentes" (seção 07): dependente é custeio, herdeiro é sucessão. Um filho adulto independente não é dependente e é herdeiro necessário.',
        campos: [
          { chave: 'nome', rotulo: 'Nome', tipo: TIPO.TEXTO },
          { chave: 'relacao', rotulo: 'Relação', tipo: TIPO.SELECAO, opcoes: ['Filho(a)', 'Cônjuge/companheiro(a)', 'Pai/Mãe', 'Neto(a)', 'Outro'] },
          { chave: 'necessario', rotulo: 'É herdeiro necessário?', tipo: TIPO.SIMNAO },
          { chave: 'relacionamentoAnterior', rotulo: 'É de relacionamento anterior?', tipo: TIPO.SIMNAO },
          { chave: 'curatela', rotulo: 'Tem deficiência ou curatela?', tipo: TIPO.SIMNAO },
        ],
      },
      {
        titulo: 'Instrumentos já existentes', campos: [
          { chave: 'suc.instrumentos', rotulo: 'Quais destes já existem?', tipo: TIPO.MULTI, sugeridoPor: 'CFP + Cliente', ancora: true,
            opcoes: ['Testamento', 'Holding familiar', 'Doação com reserva de usufruto',
                     'Acordo de sócios com cláusula sucessória', 'Seguro com finalidade sucessória'],
            opcaoNenhum: 'Nenhum' },
          { chave: 'suc.ultimaRevisao', rotulo: 'Data da última revisão', tipo: TIPO.DATA, sugeridoPor: 'CFP' },
          { chave: 'suc.ondeEsta', rotulo: 'Onde estão guardados?', tipo: TIPO.AREA, sugeridoPor: 'CFP' },
          { chave: 'suc.quemSabe', rotulo: 'Além de você, quem sabe onde estão seus documentos, apólices e senhas?', tipo: TIPO.AREA,
            sugeridoPor: 'CFP', ajuda: 'Uma linha de formulário que resolve o cenário de "a família descobre tudo no pior dia"' },
          { chave: 'suc.desejo', rotulo: 'O que você quer que aconteça com o seu patrimônio?', tipo: TIPO.AREA, sugeridoPor: 'CFP',
            ajuda: 'Substitui o campo genérico de "perpetuidade", que virava dado não consultável' },
        ],
      },
    ],
  },
  {
    id: 's14', numero: '14', titulo: 'Como o seu mês funciona', vertical: null, icone: 'calendar',
    nota: 'Seção nova. O formulário configurava o PLANO e não configurava o CICLO — a espinha mensal do produto não tinha um único campo que a definisse.',
    grupos: [
      {
        titulo: 'O ritmo do seu dinheiro', campos: [
          { chave: 'ciclo.diaDaRenda', rotulo: 'Que dia do mês o dinheiro entra na sua conta?', tipo: TIPO.NUMERO, sugeridoPor: 'Psicólogo',
            ajuda: 'Define o dia do lembrete e o "quando" padrão de toda tarefa nova — hábito é contexto, não força de vontade' },
          { chave: 'ciclo.maiorGasto', rotulo: 'Qual o maior gasto do mês, e quando ele sai?', tipo: TIPO.AREA, sugeridoPor: 'Psicólogo' },
          { chave: 'ciclo.mesDificil', rotulo: 'Nos últimos 12 meses, em qual mês sobrou menos? O que aconteceu?', tipo: TIPO.AREA,
            sugeridoPor: 'Psicólogo', ajuda: 'Gera o calendário de meses difíceis: nesses meses o combinado é renegociado antes, não cobrado depois' },
        ],
      },
      {
        titulo: 'O pacto de acompanhamento', campos: [
          { chave: 'ciclo.pactoDeCobranca', rotulo: 'Como você prefere que eu te procure quando o mês não fechar?', tipo: TIPO.SELECAO,
            opcoes: ['Me manda o número e pronto', 'Me liga', 'Não fala nada, vemos na semestral', 'Combine comigo antes de cobrar'],
            sugeridoPor: 'Psicólogo', ajuda: 'É o consentimento explícito para o nudge — sem ele, lembrete é intrusão' },
          { chave: 'ciclo.quemDecide', rotulo: 'Quem mais participa das decisões de dinheiro na sua casa?', tipo: TIPO.AREA,
            sugeridoPor: 'Psicólogo', ajuda: 'Causa nº 1 de tarefa não cumprida: o cônjuge que não estava na sala' },
          { chave: 'ciclo.conjuge', rotulo: 'Qual a renda e o patrimônio de quem divide a vida financeira com você?', tipo: TIPO.AREA,
            sugeridoPor: 'Cliente', ajuda: 'O formulário pede "só o que é sua responsabilidade" e devolve meio orçamento como se fosse o todo' },
        ],
      },
      {
        titulo: 'Histórico e sentido', campos: [
          { chave: 'ciclo.jaTentou', rotulo: 'O que você já tentou fazer sozinho e não deu certo?', tipo: TIPO.AREA, sugeridoPor: 'Psicólogo',
            ajuda: 'Prescrever de novo o método já abandonado é a receita da desistência no segundo mês' },
          { chave: 'ciclo.arrependimento', rotulo: 'Qual foi a última decisão financeira de que você se arrependeu? E uma que deu certo?', tipo: TIPO.AREA,
            sugeridoPor: 'Psicólogo', ajuda: 'Revela a heurística de decisão e evita repetir o quadro que já queimou este cliente' },
          { chave: 'ciclo.seNaoFizer', rotulo: 'Se você não fizer nada disto, o que você imagina que acontece?', tipo: TIPO.AREA,
            sugeridoPor: 'Psicólogo', ajuda: 'Autopersuasão: a consequência dita pelo cliente é a única que ele não pode descartar' },
          { chave: 'ciclo.segundaFeira', rotulo: 'Quando você imagina parar de trabalhar, o que está fazendo na segunda-feira de manhã?', tipo: TIPO.AREA,
            sugeridoPor: 'Psicólogo', ajuda: 'Torna concreto o eu futuro — e faz a renda desejada deixar de ser um chute' },
          { chave: 'ciclo.valeuAPena', rotulo: 'O que precisa ser verdade daqui a um ano para você dizer que valeu a pena?', tipo: TIPO.AREA,
            sugeridoPor: 'Psicólogo', fechamento: true,
            ajuda: 'Pergunta de fecho da reunião. Vira a manchete da semestral e a frase de celebração mensal — escrita pelo cliente, não pelo redator' },
        ],
      },
    ],
  },
];

/** Campos acrescentados a seções que já existiam. */
export const CAMPOS_NOVOS_EM_SECOES_EXISTENTES = [
  { secao: 's03', grupo: 'Dívidas', repetivel: true, rotuloItem: 'Contrato', sugeridoPor: 'CFP + Cliente',
    campos: ['Credor', 'Saldo devedor', 'Taxa (% a.a.)', 'Prazo restante', 'Sistema (SAC/Price)', 'Garantia'],
    motivo: 'A decisão antecipar-versus-investir é aritmética pura. Hoje vira tarefa do cliente ("reunir os contratos") — trabalho que o formulário deveria ter feito.' },
  { secao: 's03', grupo: 'Exterior', sugeridoPor: 'CFP',
    campos: ['Possui bens, contas ou investimentos no exterior?', 'Tipo', 'Valor'],
    motivo: 'Lei 14.754/2023 mudou a tributação de offshores; há obrigação de declaração CBE. Se ninguém pergunta, é passivo oculto num plano assinado por CFP.' },
  { secao: 's04', grupo: 'Beneficiários', repetivel: true, rotuloItem: 'Beneficiário', sugeridoPor: 'CFP',
    campos: ['Nome', 'Relação', 'Percentual', 'Data da última atualização'],
    motivo: 'Seguro de vida e VGBL não entram em inventário — é a liquidez que paga o ITCMD. A coleta pegava valor e prêmio e não perguntava quem recebe.' },
  { secao: 's04', grupo: 'Segurabilidade', sugeridoPor: 'CFP + Cliente', sensivel: 'saude',
    campos: ['Condição de saúde preexistente ou tratamento em curso?', 'Fuma?', 'Já teve proposta de seguro recusada ou agravada?'],
    motivo: 'O plano manda pedir 3 cotações de seguro. Se o cliente for inassegurável ou tiver agravo, o instrumento correto muda — e ele volta frustrado da tarefa nº 1. ⚠ Dado sensível (LGPD art. 11): exige consentimento específico.' },
  { secao: 's04', grupo: 'Proteção do negócio', sugeridoPor: 'CFP',
    campos: ['Existe seguro de vida entre sócios ou acordo buy-sell?', 'Existe RC profissional?', 'Cobertura para invalidez por doença'],
    motivo: 'Sem buy-sell, a família herda uma sociedade com o sócio remanescente e nenhuma liquidez para sair. O módulo de proteção resolvia metade do problema.' },
  { secao: 's06', grupo: 'Dedutíveis efetivos', sugeridoPor: 'CFP',
    campos: ['Despesas médicas anuais', 'Despesas de instrução anuais', 'Nº de dependentes na DIRPF', 'Recebe aluguel (carnê-leão)?'],
    motivo: 'Torna o card do PGBL condicional em vez de genérico. Hoje ele é publicado para todos, e para parte dos clientes é simplesmente falso.' },
  { secao: 's09', grupo: 'Conhecimento e experiência em investimentos', sugeridoPor: 'CFP', suitability: true,
    campos: ['Produtos já utilizados', 'Tempo de experiência', 'Já teve uma perda relevante? O que você fez?'],
    motivo: 'É a terceira perna obrigatória do suitability (Res. CVM 30: objetivos, situação financeira e conhecimento). A trava tinha duas pernas, ambas julgamento do consultor sem instrumento.' },
  { secao: 's09', grupo: 'Régua de confiança', sugeridoPor: 'Psicólogo',
    campos: ['De 0 a 10, quanto você acredita que consegue cumprir isto?', 'E por que não um número menor?'],
    motivo: 'Entrevista Motivacional. Nota abaixo de 7 significa tarefa grande demais — a resposta certa é encolher a tarefa, não insistir. ⚠ LACUNA: boa evidência em saúde, sem validação em planejamento financeiro; tratar como hipótese instrumentada.' },
  { secao: 's11', grupo: 'Rede de profissionais', sugeridoPor: 'CFP',
    campos: ['Contador (nome/contato)', 'Advogado', 'Corretor de seguros'],
    motivo: 'Metade das tarefas sucessórias e tributárias é executada por terceiros; sem o contato, cada tarefa vira um ping do consultor.' },
];

export const RESUMO_ADICOES = {
  secoesNovas: SECOES_NOVAS.length,
  camposNovos: SECOES_NOVAS.flatMap((s) => s.grupos.flatMap((g) => g.campos)).length,
  gruposNovosEmSecoesExistentes: CAMPOS_NOVOS_EM_SECOES_EXISTENTES.length,
};
