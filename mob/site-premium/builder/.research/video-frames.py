import sys,subprocess
from pathlib import Path
sys.path.insert(0,str(Path('.research/python-packages').resolve()))
import imageio_ffmpeg
from PIL import Image,ImageDraw
exe=imageio_ffmpeg.get_ffmpeg_exe()
p=next(Path('.').glob('*.mp4'))
r=subprocess.run([exe,'-i',str(p),'-vf','fps=1/2,scale=500:-1','.research/video-%02d.jpg'],capture_output=True,text=True)
print(r.stderr[-2500:])
frames=sorted(Path('.research').glob('video-*.jpg'))
for b in range(0,len(frames),12):
 s=Image.new('RGB',(1600,1000),'#222222'); d=ImageDraw.Draw(s)
 for j,f in enumerate(frames[b:b+12]):
  im=Image.open(f); im.thumbnail((390,295)); x=j%4*400;y=j//4*333
  s.paste(im,(x,y));d.text((x,y+300),str((b+j)*2)+'s',fill='white')
 s.save(f'.research/video-sheet-{b//12}.jpg')
print('frames',len(frames))
