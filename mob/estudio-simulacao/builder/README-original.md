# iGreen MOB — Estúdio de simulação

Protótipo independente da seção de simulador, criado em 07/10/2026. Não modifica os hotsites anteriores.

## Abrir

`node preview.cjs` serve `dist/` em http://127.0.0.1:4180/.

Site estático, sem dependências de instalação. Fonts, Three.js e kit 3D foram reaproveitados dos arquivos locais do projeto. A cena é geometria em tempo real; não utiliza vídeo ou imagens geradas adicionais. Pode ser substituída posteriormente sem alterar o motor financeiro.

## Experiência

1. Equipamento, quantidade e investimento opcional.
2. Movimento, tarifas, custos, repasse e capacidade técnica.
3. Carteira de energia, seguros e telefonia.
4. Projeção, comparação com/sem carteira, acumulado, demonstrativo, tabela mensal e download de resumo.

Valores mantidos enquanto se navega entre etapas. Sem coleta de contatos, backend ou envio de dados. Recarregar reinicia o cenário.

## Escopo e limites

Motor financeiro reconstruído das regras visíveis do simulador https://igreen-mob-link.vercel.app/#investir/simulador. Não é cópia auditada do motor original. Uso comercial requer conferência da matriz de cenários, regras fiscais e condições contratuais.

Cenário inicial confirmado: Duo 7+40 kW, 7 carros/dia, 30 dias, 25 kWh, compra R$0,80 e venda R$2,20. Recarga do investidor R$2.836,09 + carteira R$3.120,00 = R$5.956,09 no mês 1.

Administração 14%, conforme DRE da referência. A referência tem menção textual divergente de 15%. Regras de tributos são premissas para prototipação, não orientação fiscal. Tributo local e tributos sobre comissões começam sem definição e isso é informado na interface.

Capacidade: sessões completas por conector, somadas, com 24 h/dia, 80% de aproveitamento e 10 minutos de intervalo iniciais (editáveis). Limites padrão 5, 30 e 43 recargas/dia. Quantidade de 1–3 equipamentos é exploração visual/comercial a confirmar. Capacidade total cresce por unidade; movimento e novos clientes não são multiplicados automaticamente.

Carteira considera todos os produtos selecionados por cliente, sem cancelamentos, repetições, inflação ou carência. Recebimento acumulado não desconta o investimento. Recuperação só é estimada com valor de investimento informado. Sem financiamento, tributação pessoal, revenda, transição fiscal ou receita de 2% da rede.

## Arquivos

- `dist/index.html`: apenas a seção e sua moldura de apresentação.
- `dist/styles.css`: direção visual e responsividade.
- `dist/app.js`: etapas, formulários, relatório e exportação.
- `dist/finance.js`: fórmulas isoladas para futura substituição pelo motor validado.
- `dist/scene.js`: composição 3D e mudanças de câmera/equipamentos.
- `dist/assets`: recursos locais reutilizados do projeto.

Licença da biblioteca Three.js preservada em `assets/three.min.js`.
