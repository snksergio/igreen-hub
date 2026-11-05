# iGreen Voyage — primeira etapa

Protótipo da nova direção visual: férias, cruzeiro e conquista, com cenas fotográficas e uma maquete 3D usada como menu. A abertura foi redesenhada a partir do feedback do usuário: imagens realistas aprovadas, cores mais solares e tipografia de cartazes de viagem.

As cenas são imagens conceituais geradas por IA, com movimento de enquadramento e transições. Não há vídeos filmados nesta versão. As imagens e a maquete não representam uma embarcação, itinerário ou programação confirmados.

## Executar

Requer Node.js 22.12 ou superior e npm.

```sh
npm install
npm run dev
```

Para gerar e visualizar a versão de produção:

```sh
npm run build
npm run preview
```

Abra o endereço local informado pelo servidor. A prévia desta sessão usa http://127.0.0.1:5175.

## Interação

- Role a página ou use os links de navegação para visitar a apresentação, as experiências e o mapa.
- Alterne entre Sol & mar, Seu refúgio, À mesa e Celebre. As abas também aceitam setas, Home e End.
- Arraste o navio no mapa para girá-lo. Escolha um ponto ou um item da lista para destacar um ambiente e trocar sua prévia. “Viver esse momento” abre a cena correspondente.
- Ative o som no canto superior direito. O áudio ambiente é sintetizado localmente e começa desligado.
- Pause o movimento das imagens pelo controle na abertura. A preferência de movimento reduzido do sistema é respeitada.
- O menu móvel oferece os mesmos destinos com acesso por teclado; Escape fecha o painel e devolve o foco ao botão.

## Implementação

React + Vite + Three.js. O 3D é carregado sob demanda quando o mapa se aproxima da tela. A maquete usa geometria procedural, materiais sólidos, luz e sombra; o ambiente selecionado recebe um destaque. Fontes Barlow Condensed, Damion e DM Sans distribuídas localmente por Fontsource. Não há serviços externos, cadastro ou coleta de dados.

O navio é uma interpretação conceitual, sem compromisso com a embarcação real da campanha. A assinatura de marca é tipográfica e deverá receber o arquivo oficial. O áudio é uma base ambiente sintetizada, sem locução. Filmes reais, regulamento, pontuação e identidade oficial ainda precisam ser incorporados em etapas posteriores.

Em dispositivos sem WebGL, a lista de ambientes mantém toda a navegação. O mapa não renderiza quando está fora da tela ou quando a aba fica oculta. O áudio é suspenso quando a aba fica oculta.

## Arquivos principais

- `src/main.jsx`: textos, cenas, navegação, mapa e áudio.
- `src/scene.js`: maquete 3D, pontos clicáveis e seleção.
- `src/style.css`: identidade visual e adaptação para telas menores.
- `public/images/`: imagens finais usadas no site.
- `ASSETS.md`: procedência e prompts das imagens.

## Verificação

Build de produção; revisão visual em desktop e viewport de 390 × 844; navegação entre momentos; menu; alternância de som e pausa; checagem de erros no navegador. A revisão móvel foi feita por emulação de tamanho, não em aparelho físico.
