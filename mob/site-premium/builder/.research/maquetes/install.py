from pathlib import Path
from PIL import Image
import shutil
root=Path(__file__).resolve().parents[2]
generated=Path('C:/Users/sergi/.codex/generated_images/01a10c43-fd25-7c93-b2b6-1c939684c3d0')
assets=root/'igreen-premium-v3/dist/assets'
sources={'energia':'exec-439abf48-570c-4101-8520-504c1d798ce2.png','seguros':'exec-ddfc6801-cf94-4cf0-862c-38236846f43f.png','telefonia':'exec-6d22a113-d40b-4b06-8e51-56b395f8de96.png','rede':'exec-1a9cfeae-8e2e-4082-a951-d9cd3b649dc4.png'}
for name,file in sources.items():
    src=generated/file
    shutil.copy2(src,root/'.research/maquetes'/f'{name}.png')
    im=Image.open(src)
    assert 'A' in im.getbands(),f'{name}: alpha missing'
    alpha=im.getchannel('A')
    assert alpha.getextrema()[0]==0,f'{name}: no transparency'
    im.save(assets/f'maquete-{name}.webp',quality=92,method=6)
    print(name,im.size,'alpha verified')
p=root/'igreen-premium-v3/dist/experience.js'
s=p.read_text(encoding='utf-8-sig')
for before,after in [('energia-casa.webp','maquete-energia.webp'),('seguro-garagem.webp','maquete-seguros.webp'),('telefonia-mao.webp','maquete-telefonia.webp'),('rede-estrada.webp','maquete-rede.webp')]:
    s=s.replace(before,after)
s=s.replace('Casa contemporânea com iluminação verde e carro elétrico','Maquete de casa com painéis solares, bateria e carro elétrico verde')
s=s.replace('Carro verde protegido em uma garagem contemporânea','Maquete de garagem com carro verde e símbolo de proteção')
s=s.replace('Celular em um carro com iluminação verde','Maquete de telefonia com edifícios, antena e celular')
s=s.replace('Estrada à noite com um trajeto luminoso verde','Maquete de uma rede de eletropostos conectados por trajetos verdes')
p.write_text(s,encoding='utf-8')
p=root/'igreen-premium-v3/dist/index.html'
s=p.read_text(encoding='utf-8-sig').replace('src="assets/energia-casa.webp"','src="assets/maquete-energia.webp"').replace('alt="Casa contemporânea com iluminação verde e carro elétrico"','alt="Maquete de casa com painéis solares, bateria e carro elétrico verde"')
p.write_text(s,encoding='utf-8')
