# Eletroposto · contexto para o vídeo de motion

Esta pasta tem todas as telas e fluxos do app **Eletroposto** (iGreen), o app de recarga de carro elétrico. Ela existe para você montar um vídeo com animações a partir das telas reais do design.

## Leia primeiro

1. **`FLUXOS.md`**: o que cada um dos 28 fluxos faz, as regras do produto, cada tela com prévia e os caminhos entre as telas (o que dispara cada passo).
2. **`dados/fluxos.json`**: a mesma estrutura em JSON, para gerar sequências por código. Cada tela tem `id`, `titulo`, `altura`, `png` e `html`, e cada caminho tem `de`, `para` e `gatilho`.
3. **`index.html`**: galeria de todas as telas no navegador.

## Arquivos

- `telas/NN-MM-Nome.png`: a tela em PNG a 2x (780 px de largura). Use para referência, stills e frames estáticos.
- `html/NN-MM-Nome.html`: a mesma tela em HTML estático e independente. **É a fonte para animar.**
- `assets/*.webp`: as fotos e ilustrações usadas pelas telas. Os HTML apontam para `../assets/`.

O id `NN-MM-Nome` é igual nos três lugares. `NN` é o fluxo, `MM` é a ordem da tela dentro dele e `Nome` é o nome do quadro no design. Exemplo: `06-02-PagCarregando`.

**Não edite os originais.** Copie os HTML e assets para o projeto do vídeo e trabalhe nas cópias.

## Roteiros prontos (sequências de telas)

| Roteiro | Telas |
|---|---|
| Recarga do mapa ao recibo (caminho principal) | `02-02` Home → `03-01` Mapa → `03-02` Posto e carregadores → `05-02` Confira e inicie → `06-01` Conecte o cabo → `06-02` Carregando → `06-09` Recarga concluída |
| Recarga pelo QR no posto | `03-04` Chegou ao posto → `04-02` Ler o QR → `04-03` Conectores → `05-02` Confira e inicie → `06-01` → `06-02` |
| Saldo que não cobre, com Pix | `05-02` → `05-03` Faltam R$ 13,60 → `05-04` Pix da diferença → `06-01` (começa sozinha quando o Pix cai) |
| Primeiro acesso completo | `01-01` → `01-02` → `01-03` Boas-vindas → `13-01` Identificação → `13-02` Canal → `13-03` Código → `13-04` Senha → `13-05` Biometria → `01-04` Localização → `01-05` Notificações → `01-06` a `01-09` Cadastro do carro → `02-02` Home |
| Avise-me quando liberar | `27-01` Carregador ocupado → `27-02` Aviso ativado → `27-05` Aviso na home → `27-06` Alerta no app → `27-09` Posto com o carregador livre |
| Fim da recarga e recibos | `06-02` → `06-07` Encerrar? → `06-08` Encerrada · ou `06-09` Limite · `06-10` Bateria cheia · `06-11` No cartão |
| Carro verde (teste visual) | `28-01` Home Tesla → `28-02` Carregando · `28-04` Home GWM → `28-05` Carregando |

Quando o roteiro pedir outros caminhos, siga `caminhos` em `dados/fluxos.json`.

## Como os HTML são construídos

- O HTML é estático: não tem JavaScript e usa só estilos inline, com um bloco `<style>` mínimo no topo.
- A raiz de cada tela é `<div data-tela="NN-MM-Nome" style="width: 390px; height: …px; overflow: hidden; position: relative; isolation: isolate; …">`. Use `[data-tela]` para pegar a tela.
- A largura é sempre **390 px**. A altura padrão é 844 px, mas telas longas (homes, recibos, listas) passam disso. A altura está em `dados/fluxos.json`. Para simular rolagem, recorte um viewport de 390 × 844 e mova o conteúdo em Y.
- A fonte é **Manrope** (400 a 800), carregada do Google Fonts. Para renderizar sem internet, baixe a Manrope e troque o `<link>`.
- As imagens estão em `../assets/<id>.webp`, com caminho relativo. Mantenha a estrutura de pastas ou ajuste os caminhos.
- As telas com sheet trazem a tela de trás congelada num `div[aria-hidden="true"]` com `position: absolute; inset: 0`. É a mesma tela do passo anterior, o que ajuda a transição a ficar contínua.

## O que vale animar e como achar no HTML

| Peça | Como achar | Sugestão |
|---|---|---|
| Sheet (bottom sheet) | `[role="dialog"]` com `bottom: 0` + fundo irmão `background: rgba(17,21,19,0.46)` | fundo 0 → 1 e sheet `translateY(100%)` → 0 |
| Rodapé com botão principal | `div` com `position: absolute; left: 0; right: 0; bottom: 0` e degradê | entra subindo 16 px, com fade |
| Telas de status (sucesso, aviso, erro) | aura `div[aria-hidden]` com `filter: blur(44px)`; selo redondo de vidro com dois anéis (`inset: -14px` e `-28px`); card "casca" com rodapé `[role="note"]` | aura respirando devagar, anéis em ripple (escala 1 → 1,15, some), card sobe |
| Bateria da recarga | `[role="meter"]`: SVG com as faces da barra (`url(#inicioFrente)` azul = início, `url(#cargaFrente)` verde = ganho, tracejado = onde vai parar) e o carro (`img`) por cima | encher do início até a % atual; contar o número grande (ex.: 20 → 69) |
| Números e barras de progresso | `span` com `width: NN%` dentro de uma trilha | crescer a largura junto com um contador |
| Alerta dentro do app | `[role="alert"]` (`27-06-AvisoLiberouApp`) | desce do topo com leve overshoot |
| Toast | `[role="status"]` (`27-02-AvisoAtivado`) | sobe da base e some |
| Abas, chips e opções | `[role="tablist"]`, `[role="radiogroup"]`, `[role="switch"]` | troca de seleção, toggle deslizando |
| Banner do "Para você" | `article.bn` com o objeto 3D `img.bn-art` | objeto flutuando alguns px; pontos do carrossel |
| Linha do tempo | itens com bolinha (feito, agora, depois) dentro das cascas de status | acender um passo por vez |

## Identidade visual (tokens)

- **Cores:**
  - Fundo `#EEF0EF`, cards `#FFFFFF`, bordas `#E1E5E2`.
  - Texto `#111513`, texto secundário `#545C57`.
  - Verde da marca (botões) `#338449`, verde de texto `#276638`, verdes claros `#DDEFE3` e `#E5F1E8`.
  - Âmbar `#D18B20` (texto `#8A5300`), vermelho destrutivo `#B23B32`, azul do início da bateria `#3A76D6`.
- **Tipo:** Manrope. Títulos de 24 a 34 px em 800, com tracking de -0,02 a -0,03 em. Corpo de 13 a 15 px.
- **Formas:** cards com raio de 22 a 28 px, botão principal com 54 px de altura e raio 27 px, chips de 36 px.
- **Tom:** sóbrio e claro. Sem sombras verdes e sem botões escuros ou agressivos. O vermelho fica só para ações destrutivas e pendências.
- **Movimento sugerido:** 240 a 360 ms, com `cubic-bezier(.2, .8, .2, 1)`. Transições curtas e limpas, sem bounce exagerado.

## Cuidados com o conteúdo

- Mantenha os números coerentes ao animar contadores. Use os valores da própria tela: R$ 50,00, R$ 1,89/kWh + R$ 2,50 de início, bateria de 20% → 69% → para em ~86%, R$ 37,65 até agora.
- A seção "Pontos em aberto" do `FLUXOS.md` lista as inconsistências conhecidas. A principal é a home base, que mostra o carro como "BYD King", enquanto os outros fluxos usam o "BYD Dolphin Mini". Evite colocar as duas versões na mesma cena.
- Os fluxos 12 (propostas de banner) e 28 (carro verde) são testes de design, não telas finais.
