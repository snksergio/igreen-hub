---
type: sandbox
title: Apresentação — pagamento universal com cashback
created: 2026-10-26
updated: 2026-10-26
status: active
source: workspace
tags: [sandbox, growth, pagamento-universal, cashback, apresentacao]
---

# Apresentação — pagamento universal com cashback

Apresentação em HTML para os heads da iGreen, refeita para ter menos texto, mais imagem e animação. A ordem:

1. A motivação e como os dados foram analisados: base interna (OS), Contexts e mercado.
2. O problema:
   - como cada produto cobra;
   - o que a base respondeu sobre o cashback de hoje;
   - as certezas, suposições e dúvidas sobre o cliente.
3. O que o mercado faz.
4. A proposta com cashback, vista em números.
5. A evolução do protótipo.
6. O UX conduzindo e os agentes de growth ajudando.
7. O que ainda é suposição e o que falta rastrear.
8. O pedido e as 5 decisões que destravam o cashback.
9. Os próximos passos e o agradecimento.

São 21 slides para cerca de 15 minutos, mais 3 de apêndice. As regras e os valores do protótipo são fictícios, e cada slide tem um selo que diz se o conteúdo é fato, fonte pública, fictício, simulado ou sem dado.

## Onde está publicada

| O quê | Link |
|---|---|
| Apresentação | https://snksergio.github.io/igreen-cashback-prototipo/ |
| Protótipo | https://snksergio.github.io/igreen-cashback-prototipo/prototipo/prototipo-cashback.html |
| Repositório | https://github.com/snksergio/igreen-cashback-prototipo (público) |

A cópia publicada é a desta pasta em 26/10/2026. Mudanças feitas aqui não sobem sozinhas: é preciso enviar de novo ao repositório.

## Como usar

| Ação | Como |
|---|---|
| Abrir | Dois cliques em `index.html` (Chrome ou Edge). A fonte Manrope vem da internet; sem conexão, cai numa fonte do sistema |
| Navegar | Setas, espaço, Page Up e Page Down; Home e End; no celular, deslizar |
| Notas do apresentador | Tecla N ou o botão de notas, no canto de baixo |
| Tela cheia | Tecla F |
| Ir a um slide | `index.html#12` |
| Exportar PDF | Ctrl+P → Salvar como PDF, com "Gráficos de fundo" ligado. Sai um slide por página, sem animação |
| Protótipo ao vivo | Botão "Abrir o protótipo" (slides 9 e 20), que abre `prototipo/prototipo-cashback.html` numa aba |

## Visual e animação

- Direção tirada das pastas "Relume Demo" (decks e prints de referência) e "Motion teste" (vídeos em HyperFrames), na Área de Trabalho do Sergio.
- Visual:
  - fundo verde-escuro alternando com claro;
  - título em duas linhas, a segunda em verde;
  - um número ou imagem dominante por slide.
- Movimento:
  - títulos que sobem por trás de uma máscara;
  - números que contam;
  - linhas que se desenham;
  - celulares que flutuam;
  - troca de slide por subida, ou por corte diagonal quando muda a cor.
- Tudo em CSS e na Web Animations API, sem biblioteca externa. Respeita "reduzir movimento" do sistema.

## Arquivos

| Pasta ou arquivo | O que é |
|---|---|
| `index.html` | A apresentação |
| `telas/` | Capturas limpas do protótipo: só a tela, sem moldura e sem sombra. A moldura do celular é desenhada na apresentação. Tem 33 telas; 15 estão em uso, e as outras ficam para trocar se precisar |
| `telas/v1-*.png` | As 3 telas da primeira versão, de `03-areas/growth/investigacoes/2026-10-16-pagamento-universal/telas/index.html` |
| `img/` | Ilustrações 3D do próprio projeto: carteira (`Relume Demo/igreen-plus/public/assets/ilustracao9.png`); alvo, lâmpada, celular com conta, cofrinho e moedas (`Nova pasta/ilustracoes-3d/objetos-dos-banners/`); ícone do app (`Nova pasta/ilustracoes-3d/novas-icone-e-cartao/`) |
| `prototipo/prototipo-cashback.html` | Cópia do protótipo atual (o original fica no OneDrive, em `Área de Trabalho\Nova pasta`) |

Base: a investigação em `03-areas/growth/investigacoes/2026-10-16-pagamento-universal/`. Os números do slide "Uma conta de luz" são os da tela de detalhe da fatura do protótipo; R$ 178,33 é conta nossa (R$ 212,30 − R$ 33,97).
