from PIL import Image,ImageDraw
from pathlib import Path
root=Path('igreen-mob-hotsite/site/assets/img')
fs=[root/n for n in ['hero-verde.webp','hero-vitrine.webp','hero-carro-a.webp','hero-carro-b.webp','hero-carro-c.webp','hub-iso.webp','icon-energia.webp','icon-seguro.webp','icon-telefonia.webp','icon-rede.webp','seguro-garagem.webp','energia-casa.webp']]
fs += sorted(Path('igreen-mob-hotsite/_pesquisa/rodada4/gerado').glob('*a.png'))
for b in range(0,len(fs),9):
 sh=Image.new('RGB',(1500,1050),'#171b18');d=ImageDraw.Draw(sh)
 for j,f in enumerate(fs[b:b+9]):
  im=Image.open(f).convert('RGBA');im.thumbnail((490,310));x=j%3*500;y=j//3*350
  sh.paste(im,(x,y),im);d.text((x+10,y+320),f.name,fill='white')
 sh.save(f'.research/v2/assets-{b//9}.jpg')
