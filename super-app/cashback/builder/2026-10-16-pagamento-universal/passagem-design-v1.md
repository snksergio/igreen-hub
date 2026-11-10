---
type: doc
title: "Passagem para o design: telas do pagamento universal (v1)"
created: 2026-10-22
updated: 2026-10-26
status: active
source: workspace
tags: [growth, pagamento-universal, design, passagem]
---
# Passagem para o design: telas do pagamento universal (v1)

> Guardado no workspace em 26/10/2026, a partir da pasta temporária da sessão que fez o trabalho. Os caminhos temporários citados abaixo não valem mais: o protótipo está em `telas/` desta pasta.

> ⚠ **Regras e valores fictícios.** O protótipo foi feito para testar as skills de UX. Nada aqui é regra da iGreen.

## O pedido

Redesenhar as 3 telas do protótipo v1 **no padrão de design desta sessão**: cores, tipografia, espaçamento, componentes, ícones e ilustrações.

**O que muda:** só o visual.

**O que fica igual:** a estrutura das telas, a ordem dos blocos, os textos, os números e o comportamento. Isso já foi decidido.

Se algum bloco ou texto não couber no padrão, pergunte ao Sergio antes de cortar ou trocar.

## Onde está o protótipo

- **Para ver, abra no navegador: `http://localhost:8766/index.html`.** Serve o Chrome ou o navegador do próprio app.
- **Não abra o `index.html` pelo visualizador de arquivos.** As telas são desenhadas por JavaScript, e lá aparece só a parte fixa: título, cartão da fatura e "Como pagar". O resto fica vazio.
- **Se o link não abrir,** é porque o servidor local parou. Ele roda na sessão que fez o protótipo e para quando ela fecha. Suba de novo com:
  `node "C:\Users\sergi\AppData\Local\Temp\claude\D--Workspace\bdfb246f-ba0f-4e6e-8011-9da7db281cc7\scratchpad\servidor-local.js" "C:\Users\sergi\AppData\Local\Temp\claude\D--Workspace\bdfb246f-ba0f-4e6e-8011-9da7db281cc7\scratchpad\pagamento-universal\telas" 8766`
- **Prints:** o Sergio pode mandar junto.
- **A pasta é temporária,** de outra sessão. Se for usar o arquivo por muito tempo, peça ao Sergio para copiar para um lugar fixo.

## As 3 telas

A página mostra as três lado a lado, cada uma dentro de um celular. Os botões acima de cada celular trocam o estado da tela.

### 1. Pagar fatura

- **Cabeçalho:** voltar e "Pagar fatura · Conta de energia".
- **Cartão da fatura:**
  - "Fatura de outubro · Vence em 23/10 · R$ 129,20 ›";
  - faixa amarela "Pague até 23/10 e mantenha os 15%".
- **Toque na fatura** abre uma folha de baixo com:
  - conta sem a iGreen, R$ 152,00;
  - desconto iGreen (15%), − R$ 22,80;
  - valor da fatura, R$ 129,20;
  - aviso "Depois de 23/10, o desconto cai para 10%" e o texto "Pagando com atraso, esta fatura fica R$ 7,60 mais cara".
- **Cartão do cashback:**
  - "Usar meu cashback · R$ 9,20 disponíveis", com uma chave;
  - desligado, mostra "Use e pague R$ 120,00";
  - ligado, mostra "Usando R$ 9,20 de cashback · Abatido da fatura agora" e as linhas Fatura, Cashback e Falta pagar.
- **"Como pagar":**
  - Saldo iGreen Pay (R$ 250,00 disponíveis), com a faixa verde "Ganhe R$ X de cashback com o Pay";
  - Pix ("Na hora · último usado"), que já vem marcado;
  - Boleto ("Compensa em até 2 dias úteis");
  - Cartão de crédito (Visa •••• 4821);
  - "Adicionar cartão de crédito".
- **Sem o Pay ativado,** aparece a faixa "Ative o Pay e ganhe R$ X · Ativar".
- **Rodapé fixo:**
  - selo "+ R$ X de cashback até 20/10", só com o Pay;
  - botão "Pagar com <forma> • <valor>", que passa para "Pagando…" e depois para "Fatura paga ✓".

### 2. Comprovante

- **Topo:** voltar e baixar.
- **Topo da tela:** check verde, "Fatura paga" e o valor grande.
- **Cartão com o logo redondo sobreposto ao topo:**
  - "Fatura de energia · outubro · iGreen Energia";
  - linhas Valor da fatura e Cashback usado (esta, quando houver);
  - selos verdes "Você economizou R$ 22,80 nesta fatura" e "Você ganhou + R$ 1,20 de cashback". Sem o Pay, o segundo vira o selo neutro "Só o saldo Pay rende cashback";
  - recorte de ticket;
  - "Detalhes do pagamento", que abre e fecha (forma, situação, data, hora, quando o cashback cai, ID);
  - "Você pagou R$ X".
- **Rodapé fixo:** Início e Compartilhar.
- **Variante Seguro:**
  - "Pagamento feito · R$ 89,90";
  - "Seguro não rende cashback";
  - linha do tempo da apólice: pagamento confirmado → apólice em ativação (até 30 min) → apólice ativa.

### 3. Hub "Retorno iGreen"

- **Barra:** só o voltar. Abas embaixo: Início, Pagar, Retorno (ativa) e Perfil.
- **Topo:**
  - "A iGreen já te devolveu" e "Economia e cashback desde maio de 2026";
  - valor grande;
  - selo "+ R$ X em outubro";
  - ilustração de um raio com moedas.
- **Cartão branco:**
  - "Seu cashback · R$ X · Ver cashback";
  - por dentro, a linha "R$ 1,20 a receber · cai até 20/10".
- **"Dá pra ganhar mais":**
  - carrossel de cartões com ilustração: Pague com o saldo Pay, Indique e ganhe, Pague em dia;
  - bolinhas embaixo;
  - troca sozinho a cada 4,5 s e para quando a pessoa toca.
- **"Seus ganhos",** com o link "Ver detalhes" e um ícone de gráfico. Mosaico com três cartões:
  - um grande de economia: "R$ X de economia nas suas contas", kWh de energia limpa e "Ver economia";
  - um de cashback: "R$ 46,50 de cashback em indicações e no Pay" e "Ganhe mais";
  - um do Club: "5 cupons para usar no Club" e "Ver cupons".
- **"Origem dos seus ganhos":** cartões na horizontal, um por produto (Energia, Telecom, Seguros), com valor, % do total, barra e a divisão Desconto | Cashback.
- **"Ajuda e regras":** Como calculamos seus ganhos, Regras do cashback e Como funciona o desconto.
- **Telas internas,** pelos botões acima do celular:
  - análise da economia;
  - histórico da economia;
  - Meu cashback;
  - extrato.

  Veja cada uma no protótipo.

## O comportamento que precisa continuar

- **Um modelo só liga as três telas.** Pagar na tela 1 muda o comprovante e o hub. Por exemplo, a economia de outubro vai de R$ 10,00 para R$ 32,80, e o total do hub, de R$ 198,60 para R$ 221,40.
- **Os detalhes abrem em folhas de baixo.**
- **O carrossel para quando a pessoa toca** e respeita "reduzir movimento".

## Valores do protótipo (fictícios)

- Fatura de R$ 129,20, com desconto de 15% (R$ 22,80).
- Cashback disponível de R$ 9,20.
- Pagar com o Pay rende 1%, com teto de R$ 5,00. Dá R$ 1,20 com o cashback ligado e R$ 1,29 sem ele, e cai até 20/10.

## Para saber, não para aplicar

Existem uma v2 e uma v2.1 na mesma pasta, com correções que saíram de um teste simulado:
- **v2 (`index-v2.html`):** a faixa do prazo diz o que se perde, o Pay se explica, o comprovante destaca o valor pago, o boleto não paga sozinho e o hub mostra primeiro o que dá para usar hoje.
- **v2.1 (`index-v21.html`):** Pix com QR e copia e cola, e boleto pendente fácil de achar.

O Sergio pediu a **v1**. Não traga nada da v2 nem da v2.1 sem ele pedir.

## Como entregar

- Faça um arquivo novo. Não sobrescreva o `index.html`.
- Mostre ao Sergio antes de gravar qualquer coisa no workspace. A regra do workspace é aprovação item por item.
