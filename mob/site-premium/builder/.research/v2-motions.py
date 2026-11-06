import sys,subprocess,re
from pathlib import Path
from PIL import Image,ImageDraw
sys.path.insert(0,str(Path('.research/python-packages').resolve()))
import imageio_ffmpeg
exe=imageio_ffmpeg.get_ffmpeg_exe()
out=Path('.research/v2');out.mkdir(exist_ok=True)
for k,p in enumerate(Path('Motions').glob('*.mp4')):
 info=subprocess.run([exe,'-i',str(p)],capture_output=True,text=True).stderr
 m=re.search(r'Duration: (\d+):(\d+):([\d.]+)',info)
 dur=int(m[1])*3600+int(m[2])*60+float(m[3])
 sheet=Image.new('RGB',(1500,800),'#181818');d=ImageDraw.Draw(sheet)
 d.text((15,10),p.name+' | '+str(dur)+'s',fill='white')
 for i in range(6):
  t=dur*(.06+i*.17);f=out/f'motion-{k}-{i}.jpg'
  subprocess.run([exe,'-y','-ss',str(t),'-i',str(p),'-frames:v','1','-vf','scale=490:-1',str(f)],capture_output=True)
  im=Image.open(f);im.thumbnail((490,340));x=i%3*500;y=40+i//3*380
  sheet.paste(im,(x,y));d.text((x+8,y+345),str(round(t,1))+'s',fill='white')
 sheet.save(out/f'motion-sheet-{k}.jpg')
 print(k,p.name,dur)
