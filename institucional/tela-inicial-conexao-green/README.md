# Conexão Green · tela inicial do cadastro com simulador

Proposta da tela inicial do cadastro Conexão Green com um simulador de economia: a pessoa informa quanto paga de luz por mês e vê quanto economiza por mês e por ano, numa simulação com 20% de desconto, e quanto a conta passa a custar. Uma página estática (HTML, CSS e JavaScript puros, num arquivo só), sem build.

Cópia da pasta `06-sandbox/2026-10-20-simulador-conexao-green` do workspace local, que não tem repositório git (versão de 27/10/2026). O original continua lá e é a fonte: ajustes são feitos nele e copiados de novo para esta pasta.

| Página | Arquivo | No hub |
| --- | --- | --- |
| Tela inicial com simulador | `index.html` | https://igreen-hub.pages.dev/institucional/tela-inicial-conexao-green/ |

## Estrutura

```
index.html              a tela inteira: HTML, CSS e JS num arquivo só. As árvores da floresta
                        e a imagem parada do tema Light vão embutidas no próprio HTML
video/
  hero-2160.mp4         ilustração do tema Escuro (2160×1440, H.264, sem áudio)
  hero-light-2160.mp4   ilustração do tema Light, com fundo branco puro (2160×1440, H.264, sem áudio)
```

## Rodar localmente

Abra o `index.html` direto no navegador ou sirva a pasta:

```bash
npx serve .
```

## Temas

- Dois temas, Escuro e Light. O seletor fica no canto de cima e a escolha fica guardada no navegador (`localStorage`, chave `simulador-tema`).
- Sem escolha guardada, segue o tema do aparelho.
- No Light, o vídeo entra com `mix-blend-mode: multiply`: o branco do vídeo vira a cor da página (`#F3F2F0`), sem emenda.

## Parâmetros de URL

| Parâmetro | O que faz |
| --- | --- |
| `?tema=escuro` ou `?tema=light` | Abre no tema escolhido |
| `?desconto=15` | Simula com outro percentual (de 1 a 60). Sem ele, 20% |

## Regras da simulação

- O campo começa vazio. Conta mínima de R$ 120 por mês: abaixo disso aparece um aviso e o resultado fica fechado.
- Economia por mês = conta × desconto. Economia em 1 ano = economia por mês × 12. Conta nova = conta − economia por mês.
- O controle deslizante vai de R$ 120 a R$ 3.000. Acima disso, só digitando.
- A floresta atrás do campo cresce com o valor da conta: de 1 a 13 árvores.

## Ponto de integração

O botão "Garantir meu desconto" dispara o evento `simulador:continuar` no `document`, com `contaMensal`, `desconto`, `economiaMensal`, `economiaAnual` e `novaConta` em `detail`. Nesta página, um aviso na tela mostra o que aconteceria: a pessoa seguiria para o cadastro com a conta já informada.

## Dependências externas

- Fonte Inter, pelo Google Fonts.
- As logos (as duas versões) e, no tema Escuro, a imagem parada e o vídeo de reserva vêm de `dev-green.igreenenergy.com.br`. Se esse ambiente mudar ou tirar os arquivos, eles deixam de carregar.

## No original

O pacote para o desenvolvedor (a mesma tela com HTML, CSS e JS separados e um README técnico) e as versões anteriores ficam no original, na pasta da sandbox.
