from PIL import Image, ImageOps, ImageDraw
from pathlib import Path
p=Path('.')
files=sorted(p.glob('*.jpg'))+sorted(p.glob('*.gif'))
for batch in range(0,len(files),10):
    sheet=Image.new('RGB',(1600,1000),'#dddddd'); d=ImageDraw.Draw(sheet)
    for j,f in enumerate(files[batch:batch+10]):
        im=Image.open(f).convert('RGB'); im.thumbnail((300,455))
        x=(j%5)*320; y=(j//5)*500
        sheet.paste(im,(x+(320-im.width)//2,y))
        d.text((x+8,y+467),f.name[:18],fill='black')
    sheet.save(p/'.research'/f'references-{batch//10}.jpg')
