from pathlib import Path
import re
root=Path(__file__).resolve().parents[2]
p=root/'igreen-premium-v3/dist/index.html'
s=p.read_text(encoding='utf-8')
s=s.replace('Explore as quatro conexões','Explore as cinco conexões').replace('Quatro caminhos.','Cinco caminhos.')
start=s.index('<div class="hub-stage')
end=s.index('<div class="connection-list',start)
s=s[:start]+'''<figure class="hub-stage connection-visual reveal" data-visual="energia"><div class="visual-frame"><img id="connection-image" src="assets/energia-casa.webp" alt="Casa contemporânea com iluminação verde e carro elétrico" width="1400" height="1050" loading="lazy"><div class="visual-overlay"></div><div class="visual-topline"><span class="live-dot"></span><span>O SEU MUNDO, CONECTADO.</span></div><div class="visual-title"><span id="visual-count">01 / 05</span><strong id="visual-name">Energia</strong></div></div><figcaption><span id="visual-caption">A conexão começa em casa.</span><small>IMAGEM ILUSTRATIVA</small></figcaption></figure>'''+s[end:]
needle='</div></div></section>\n<section class="simulator-section"'
fifth='''<details class="connection-item" name="connections"><summary><span class="connection-id">05</span><span class="connection-name">Eletropostos</span><span class="connection-commission station-mark">MOB</span><span class="connection-arrow">↗</span></summary><div class="connection-info"><p class="commission-caption">O PONTO DE PARTIDA DO ECOSSISTEMA</p><h3>Seu ponto.<br>Uma nova bandeira.</h3><p>Conecte seu eletroposto ao ecossistema iGreen MOB. Uma operação com <strong>recebimento D0, suporte 24h e app para o motorista.</strong></p><span class="connection-footnote">Administração de 14% sobre as recargas. Compatibilidade do equipamento e condições sob consulta.</span></div></details>'''
s=s.replace(needle,fifth+needle)
s=s.replace('<div class="simulator">','<div class="simulator"><div class="sim-workspace-header"><span><i class="live-dot"></i> SEU CENÁRIO DE CRESCIMENTO</span><span>iGREEN MOB / SIMULADOR</span></div>')
s=s.replace('<div class="client-count"><output for="clients" id="clients-output">2</output><span>clientes / dia</span></div>','<div class="client-adjust"><button type="button" data-adjust="-1" aria-label="Diminuir novos clientes por dia">−</button><div class="client-count"><output for="clients" id="clients-output">2</output><span>clientes / dia</span></div><button type="button" data-adjust="1" aria-label="Aumentar novos clientes por dia">+</button></div>')
s=s.replace('<div class="result-live"','<div class="result-orbit" aria-hidden="true"></div><div class="result-live"')
s=s.replace('<div class="result-bottom"><div><span>Receita acumulada no período</span><strong id="accumulated">R$ 243.360</strong></div><a class="button button-lime" href="#contato">Quero esse próximo passo</a></div>','<div class="result-bottom"><div><span>Receita acumulada no período</span><strong id="accumulated">R$ 243.360</strong></div><div class="projection-note"><i class="live-dot"></i><span>Uma carteira que se constrói<br>conexão por conexão.</span></div></div><a class="sim-cta" href="#contato">Vamos conversar sobre este cenário <span aria-hidden="true">↗</span></a>')
s=s.replace('<h2>MUDE A<br><span>DIREÇÃO.</span></h2>','<h2>O próximo capítulo<br><span>começa no seu ponto.</span></h2>')
s=s.replace('<p>Seu ponto já tem uma história.<br>Vamos conectar o próximo capítulo?</p>','<p>Uma nova bandeira. Mais possibilidades.<br>Converse sobre a migração do seu eletroposto.</p>')
p.write_text(s,encoding='utf-8')
assert s.count('class="connection-item"')==5,'Expected five connections'
print('Refined hero, five visual connections, simulator and closing')
