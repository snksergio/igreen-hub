# Construtor isométrico de eletropostos — guia de transferência

## O que foi entregue

Editor visual leve em HTML, CSS, JavaScript e SVG, com vista isométrica e planta. Não usa Blender, WebGL, bibliotecas externas ou um motor 3D. O desenho isométrico é uma projeção de elementos SVG.

- `montagem-unico.html`: versão portátil, com estilos, código e dados demonstrativos embutidos. Abra em um navegador atualizado.
- `montagem.html`: entrada da versão modular. Mantenha `montagem.css`, `montagem.js` e `montagem-contexto.js` na mesma pasta.
- `montagem.test.cjs`: verificações das regras, executadas com `node montagem.test.cjs`.

Não é necessário instalar dependências ou compilar. Para integração e persistência consistente, sirva a pasta por HTTP no seu projeto. Em arquivos abertos por `file://`, o armazenamento local depende do navegador; use Exportar para guardar uma cópia. Abrir a cópia em outro endereço não transfere automaticamente o rascunho do portal: exporte no original e importe na cópia com o mesmo cadastro de pontos.

O link da marca foi ajustado apenas nas cópias entregues para não depender do painel externo. A montagem original permanece na pasta de desenvolvimento.

## Texto de contexto para levar ao projeto

Precisamos integrar um construtor de eletropostos baseado em módulos e regras de encaixe. O usuário escolhe um ponto previamente cadastrado e organiza somente as bombas físicas atribuídas a ele. Cada bomba ocupa um módulo com uma ou duas vagas. Os módulos se encaixam em até duas fileiras paralelas, com orientação automática e um único divisor central quando a segunda fileira está habilitada. Não há montagem livre, rotação lateral nem criação de equipamentos. Essas restrições controlam as variações que futuramente serão associadas a maquetes 3D predefinidas. O editor produz uma configuração JSON; a integração com cadastro, persistência no servidor e catálogo de renders deve ser implementada no projeto de destino.

## Regras de negócio implementadas

1. Cada ponto recebe ID, nome, endereço e lista de bombas do cadastro externo. Nome, endereço, tipo da bomba e atribuição não são editados no construtor.
2. Cada bomba tem um ID físico único em todo o contexto recebido. O mesmo ID não pode aparecer em dois pontos. O contexto com duplicidades é rejeitado.
3. A biblioteca mostra somente as bombas do ponto selecionado. Ao posicionar uma bomba, ela fica indisponível para nova inserção. Retirar do mapa devolve essa bomba à biblioteca do mesmo ponto; não exclui o equipamento do cadastro.
4. Tipos suportados: `mobi`, `fast` e `ultra`. São representados por um, dois e três raios. Esses símbolos distinguem os modelos; não representam potência elétrica real.
5. Cada módulo permite uma ou duas vagas. O padrão é uma para Mobi e duas para Fast/Ultra. A quantidade de vagas não é necessariamente igual à quantidade de conectores.
6. Há no máximo duas fileiras paralelas. A inferior é inicial; a superior é habilitada pelo usuário. As bombas ficam voltadas para o eixo central e as vagas para fora.
7. A posição é determinada pela fileira e pela ordem na sequência. Não se permite giro de 90 graus, deslocamento livre, divisor lateral, jardim ou módulos decorativos.
8. A segunda fileira habilita automaticamente um único divisor horizontal central. Desabilitar a fileira remove o divisor. Quando há bombas nela, o usuário escolhe transferi-las para a inferior ou devolvê-las à biblioteca.
9. O divisor acompanha a maior extensão das fileiras. Não é um objeto que o usuário arrasta ou posiciona individualmente.
10. A área de desenho cresce conforme os módulos são inseridos. Não existe limite arbitrário de posições por fileira; o inventário atribuído limita o número de bombas.
11. As vagas recebem rótulos A1, A2... na inferior e B1, B2... na superior. Esses rótulos mudam com a posição. Não devem ser usados como identificadores de integração.
12. As identidades de vagas são determinísticas: `<id-da-bomba>-bay-1` e `<id-da-bomba>-bay-2`. Reduzir para uma vaga remove a segunda; aumentar novamente recupera o mesmo identificador determinístico.

## Interações

- Inserção por clique na biblioteca, arraste ou botão + na fileira.
- Popover com bombas físicas disponíveis e escolha de uma/duas vagas.
- Seleção de módulo abre propriedades à direita: vagas, fileira, ordem e retirada.
- Arraste com cópia translúcida, encaixe destacado e original oculto durante o gesto. Soltar fora ou pressionar Escape cancela.
- Menu de contexto por botão direito para retirar do mapa; há também botão no painel.
- Desfazer/refazer, zoom, centralização, movimentação da vista e alternância planta/isométrico.
- Templates com prévia usam somente o inventário do ponto. Não criam equipamentos.
- Atalhos: V selecionar, H mover vista, Delete/Backspace retirar, Ctrl/Cmd+Z desfazer, Ctrl/Cmd+Shift+Z refazer.
- Duplicação de bombas não é permitida, inclusive por Ctrl/Cmd+D.

## Contrato de entrada

Defina o contexto abaixo antes de executar `montagem.js`. O arquivo demonstrativo usa `??=` e só fornece o exemplo se não houver contexto previamente definido.

```js
window.IGREEN_STATION_CONTEXT = {
  mode: 'portal',
  stations: [{
    id: 'ponto-001',
    name: 'Eletroposto Avenida Jonas',
    address: 'Endereço fornecido pelo cadastro',
    chargers: [
      { id: 'bomba-001', type: 'fast', label: 'Fast 01' },
      { id: 'bomba-002', type: 'ultra', label: 'Ultra 02' }
    ]
  }]
};
```

IDs aceitam letras, números, hífen e ponto. A lista de pontos deve conter pelo menos um ponto; um ponto pode ter zero bombas. O contexto deve estar disponível antes da inicialização: se vier de uma API, aguarde a resposta antes de executar o editor. O código não possui atualização reativa do inventário.

## Estado, exportação e importação

O estado contém `version: 3`, `stationId`, `name`, `opposite`, `divider` e `rows`. `rows[0]` é a fileira superior; `rows[1]` é a inferior. Cada módulo armazena `id`, `equipmentId`, `type`, `bays` e `bayIds`.

O arquivo exportado usa:

- `schema: "igreen.station-layout"`, `version: 3`.
- `stationId` e nome do ponto.
- `ruleset: "parallel-rows-central-divider-v2"` (a versão da regra é distinta da versão do arquivo).
- `oppositeEnabled`, `moduleGap: 0.2`, `rows` e dados derivados em `modules`.
- `divider` com ativação, eixo, posição, quantidade e largura.
- `renderIntegration: "pending"` e `renderId: null`.

Importação aceita JSON de até 2 MB, do mesmo ponto e versão. Rejeita bombas não atribuídas, modelos incompatíveis, duplicação e IDs de vagas inconsistentes. Exibe prévia antes de aplicar e permite desfazer. Os dados derivados de posicionamento são recalculados a partir das fileiras.

Rascunho local: `igreen-station-layout-v3-<stationId>`. Cada ponto tem seu rascunho separado. O histórico de desfazer é apenas da sessão do ponto atual e é zerado ao trocar de ponto ou recarregar. Não há sincronização com servidor. Rascunhos antigos do editor livre não são migrados automaticamente.

## Geometria conceitual

- Módulo: largura de 1 ou 2 unidades conforme vagas; profundidade de 3 unidades.
- Intervalo fixo entre módulos: 0,2 unidade.
- Primeiro módulo começa em X=1; os seguintes acumulam largura e intervalo.
- Superior: Y=1, rotação 180 graus. Inferior: Y=5, rotação 0 graus.
- Extensão de uma fileira = soma de vagas + 0,2 × quantidade de intervalos.
- Largura do divisor = máximo entre extensão superior, inferior e 3, acrescido de 0,5.

Essas unidades não são metros nem validam dimensões de obra, acessibilidade, circulação real, alcance de cabos ou requisitos elétricos.

## Integração no projeto pessoal

1. Copie a versão modular ou use o HTML único para referência visual.
2. Forneça o contexto autenticado de pontos e equipamentos antes da inicialização.
3. Substitua/complemente `save()` e `loadStation()` com persistência por usuário e ponto na API do projeto.
4. Revalide no servidor a propriedade do ponto, o inventário e a unicidade dos equipamentos. A validação do navegador é uma proteção de interface, não uma garantia entre usuários e sessões.
5. Mantenha IDs físicos estáveis; use A1/B1 apenas como rótulos visuais.
6. Ao portar para React, mantenha o estado como fonte única e derive SVG, coordenadas e rótulos desse estado. O protótipo atual usa DOM direto e uma função autoexecutável; não é um componente React pronto.
7. Para 3D, defina um catálogo com combinações suportadas e associe a configuração normalizada a uma maquete existente. As regras atuais reduzem variações, mas ainda não comprovam que toda combinação possui um render disponível.
8. Para eventos ao vivo, associe estados aos IDs das bombas e vagas sem reconstruir toda a configuração.

## Limitações conhecidas desta entrega

- Dados demonstrativos: três pontos e seis bombas; sem consulta a cadastro real.
- Sem maquete 3D, integração com controladores ou eventos em tempo real.
- Os templates “Duas fileiras” e “Duas fileiras assimétricas” atualmente usam a mesma distribuição alternada do inventário. Para bases distintas, ajuste `presetState()`.
- `presets` ainda contém descrições antigas de quantidades fixas; `refreshTemplates()` substitui a apresentação e `presetState()` usa o inventário atual. Não use esses metadados antigos como regra de negócio.
- Não há garantia de rendimento para inventários muito grandes. Teste os limites reais de uso.
- Requer navegador moderno com SVG, Pointer Events, dialog, Popover API e structuredClone.

## Verificação

Execute `node montagem.test.cjs` na pasta. A suíte verifica inventário atribuído, bloqueio de duplicação, modelo fixo, IDs de vagas, retirada/reutilização, templates, validação de importação e isolamento entre pontos.
