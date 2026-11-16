# CRM de atendimento

Protótipo navegável do CRM interno de atendimento da iGreen. Cobre dois workspaces:
- **Atendimento:** tickets, atendimentos, o bot de fluxo e as automações;
- **Administração:** pessoas, equipes, BUs e permissões.

Tudo roda com dados fictícios em memória.

Cópia do sandbox local `06-sandbox/2026-11-13-crm-equipes`, que não tem repositório git, feita
em 2026-11-16. O original continua lá e é a fonte: ajustes são feitos nele e copiados de novo
para esta pasta. Esta pasta tem só o resultado, o build gerado com `npx vite build --base=./`.

## Páginas

| Página | Endereço |
|---|---|
| Dashboard do atendimento | https://igreen-hub.pages.dev/backoffice/crm-atendimento/#at-dashboard |
| Meus atendimentos | https://igreen-hub.pages.dev/backoffice/crm-atendimento/#at-meus |
| Atendimentos do supervisor | https://igreen-hub.pages.dev/backoffice/crm-atendimento/#at-atendimentos |
| Tickets | https://igreen-hub.pages.dev/backoffice/crm-atendimento/#at-tickets |
| Filas | https://igreen-hub.pages.dev/backoffice/crm-atendimento/#at-filas |
| Clientes | https://igreen-hub.pages.dev/backoffice/crm-atendimento/#at-clientes |
| Fluxos do bot | https://igreen-hub.pages.dev/backoffice/crm-atendimento/#at-fluxos |
| Construtor do bot | https://igreen-hub.pages.dev/backoffice/crm-atendimento/#fluxo/fx-whatsapp |
| Regras de automação | https://igreen-hub.pages.dev/backoffice/crm-atendimento/#at-automacoes |
| Visão do fluxo das automações | https://igreen-hub.pages.dev/backoffice/crm-atendimento/#at-automacoes-fluxo |
| Distribuição das filas | https://igreen-hub.pages.dev/backoffice/crm-atendimento/#at-distribuicao |
| Pessoas e acessos | https://igreen-hub.pages.dev/backoffice/crm-atendimento/#pessoas |

## Bom saber

- **A tela mora no endereço** (`#pagina/id`). O voltar do navegador funciona, e qualquer tela
  pode ser compartilhada pelo link.
- **Recarregar a página volta aos dados de exemplo.** Nada é salvo de verdade.
- **O "agora" do protótipo é fixo:** 13/11/2026, 14h.
- **As automações e quem está online são simulados** sobre os dados de exemplo.
- **"Ver como"**, no cabeçalho, troca o perfil (Meu acesso, Atendente sênior, Atendente,
  Observador), para mostrar o que cada um vê.
- **Sem endereço:** a página abre na Administração (Pessoas). Para abrir no Atendimento, use os
  links da tabela.
