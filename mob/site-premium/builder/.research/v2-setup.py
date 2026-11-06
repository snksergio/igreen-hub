from pathlib import Path
import shutil,hashlib,json
base=Path('igreen-premium/dist');out=Path('igreen-premium-v2/dist');a=out/'assets';a.mkdir(parents=True,exist_ok=True)
manifest={str(p):hashlib.sha256(p.read_bytes()).hexdigest() for p in base.rglob('*') if p.is_file()}
Path('.research/v2/original-hashes.json').write_text(json.dumps(manifest),encoding='utf-8')
for name in ('calculator.js','app.js'):
 shutil.copy2(base/name,out/name)
for f in (base/'assets').iterdir():
 if f.suffix in ('.webp','.mp4'):shutil.copy2(f,a/f.name)
ref=Path('igreen-mob-hotsite/site/assets/img')
for name in ('hub-iso.webp','icon-energia.webp','icon-seguro.webp','icon-telefonia.webp','icon-rede.webp','eletroposto-corpo.webp','logo-igreen.svg','logo-igreen.png','migracao-poster.webp','energia-casa.webp','seguro-garagem.webp','telefonia-mao.webp','rede-estrada.webp'):
 shutil.copy2(ref/name,a/name)
shutil.copy2('igreen-mob-hotsite/site/shared/fonts-instrument.css',out/'fonts.css')
shutil.copy2('igreen-premium/verify-calculator.cjs','igreen-premium-v2/verify-calculator.cjs')
m=Path('igreen-premium-v2/.openai');m.mkdir(exist_ok=True);(m/'hosting.json').write_text(json.dumps({'static':{'directory':'dist'}}),encoding='utf-8')
print('Separate v2 initialized. Original hashes retained.')
