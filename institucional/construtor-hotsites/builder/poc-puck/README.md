---
type: poc
title: POC construtor de hotsites (Puck)
created: 2026-11-17
updated: 2026-11-17
status: active
tags: [poc, puck, hotsite, eventos]
---

# POC construtor de hotsites (Puck)

Editor em que o marketing monta hotsites de evento encaixando 21 peças da iGreen, com animação de entrada ao rolar, e o licenciado gera o próprio link personalizado sem editar a página. Serve para gerar ideias com o time; o design não é o foco. O desenho está em `../2026-11-17-poc-puck-desenho.md` e o plano em `../2026-11-17-poc-puck-plano.md`.

## Como rodar

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`. Testes: `npm test`. Versão estática para GitHub Pages: `npm run build` (sai em `dist/`).

`npm run build:estatico` gera também o **HTML estático** dos exemplos em `dist/estatico/<endereço>/index.html`, mais `sitemap.xml`, `robots.txt` e `llms.txt`: é a página como o MVP vai publicar (conteúdo no HTML, SEO e dados estruturados no `<head>`). Para ver: `npm run preview -- --port 5192` e abrir `http://localhost:5192/estatico/live-mobi/`.

## Onde está cada coisa

| Arquivo | O que é |
|---|---|
| `src/puck/blocks/` | As 21 peças, uma por arquivo. Simulador e Seção livre são as especiais |
| `src/puck/ui.tsx` | Seção comum, botão, avatar e a animação de entrada (`r(ordem, tipo)` e `Conta` para números) |
| `src/lib/seo.ts` | Título, descrição, indexação, dados estruturados (Event, FAQPage, Organization) e a conferência de SEO, tudo a partir das peças |
| `src/lib/cabecalho.ts` | Monta o `<head>` (canônico, Open Graph, JSON-LD) para a página e para o HTML estático |
| `src/lib/estatico.tsx` e `estatico-runtime.js` | Gera o HTML estático e o script pequeno (animação, contagem, simulador, vídeo) que roda sem React |
| `scripts/prerender.mjs` | Gera o HTML estático dos exemplos, o sitemap, o robots.txt e o llms.txt |
| `src/puck/guia.ts` | Padrões da Seção livre (tokens, classes, movimento), modelos de partida e o texto "guia para IA" |
| `src/puck/blocks/SecaoLivre.tsx` | Peça com HTML, CSS e JavaScript próprios |
| `src/puck/fields/ArquivosField.tsx` e `src/lib/arquivos.ts` | Upload de imagens e PDF da Seção livre, usados no código como `arquivo:NOME` |
| `src/puck/fields/ImportarField.tsx` e `src/lib/importarHtml.ts` | Importar o `.html` da IA na Seção livre: separa HTML, CSS e JS, ajusta para viver numa seção e roda o JS como numa página própria |
| `src/puck/previaLivre.ts` | No editor, monta a pagininha onde o JavaScript da Seção livre roda (só o editor carrega) |
| `src/screens/editor/` | Partes do editor por cima do Puck: topo (`Topo.tsx`), painel da esquerda com Estrutura, Peças e Imagens (`PainelEsquerdo.tsx`), cabeçalho dos campos e opções lado a lado (`Campos.tsx`) |
| `src/ui/` | Ícones e menu suspenso do builder |
| `src/app.css` | Visual do builder: tokens (verde), tema do Puck, editor e telas internas. Não vale para o hotsite |
| `mockups/editor.html` | Mockup estático que comparou as três direções de cor (abre em `/mockups/editor.html` com o servidor de desenvolvimento) |
| `src/screens/PainelSeo.tsx` | Painel do editor: prévia no Google, conferência de SEO com botão para ir ao ajuste, e Baixar HTML estático |
| `src/lib/tempo.ts` | Contagem regressiva, convite de calendário (.ics e Google Agenda) e números que contam |
| `src/puck/config.tsx` | Configuração do Puck, cabeçalho e rodapé fixos |
| `src/puck/catalogo.ts` | Nome, termo técnico (Hero, Steps, FAQ…), descrição, "como funciona" e grupo de cada peça |
| `src/puck/ItemGaveta.tsx` | Card da gaveta (ilustração, nome, subtítulo) e o pop-over com prévia ao passar o mouse |
| `src/puck/ilustracoes.tsx` | Desenho esquemático de cada peça, usado nos cards da gaveta |
| `src/puck/dicionario.ts` | Interface do Puck em português ("Outline" → "Estrutura") e tamanhos de tela |
| `src/puck/fields/ImagemField.tsx` | Campo de imagem: enviar do computador, biblioteca ou link |
| `src/lib/imagens.ts` | Biblioteca de imagens e filtro de imagem segura |
| `src/templates.ts` | Começar do zero, os 3 modelos (Evento, Live, Campanha) e os 3 exemplos (evento do Thiago, Live Mobi, Migre a bandeira) |
| `src/screens/Painel.tsx` | Primeira tela: páginas com miniatura e botão Nova página |
| `src/screens/NovaPagina.tsx` | Criar página: nome e escolha de modelo ou do zero |
| `src/lib/persona.ts` | Dados do licenciado vindos do link e a troca de `{nome}` e `{cidade}` |
| `src/lib/pages.ts` | Páginas no `localStorage`: criar, duplicar, endereço, importar e exportar |
| `src/lib/submissions.ts` | Inscrições no `localStorage` e exportação em CSV |
| `src/screens/` | Painel, editor, página pública, link de licenciado e inscrições |

## Limites conhecidos

- Tudo fica no navegador: outra pessoa, outro navegador, outros dados.
- Imagem enviada é reduzida para no máximo 1600 px e guardada no próprio navegador. O espaço é pequeno (cerca de 5 MB); quando enche, o editor avisa.
- Sem login, sem publicação de verdade, sem domínio.
- A Seção livre aceita qualquer código: no MVP, só para quem tiver permissão, com revisão antes de publicar.
- Código importado: módulos (`import`), `fetch` de arquivos locais e páginas com várias telas não viram seção sozinhos. Funções do `onclick` ficam globais; duas seções com o mesmo nome de função se atrapalham.
- Na prévia do editor, o JavaScript da Seção livre roda com o mesmo poder que tem na página publicada (mesma origem). Arrastar a peça pelo conteúdo dela não funciona: use a barra da peça ou a Estrutura.
- Imagem colada por link não é comprimida. Foto de 3 MB derruba o desempenho (ver "Medições" no desenho).
