from pathlib import Path
import re
root=Path(__file__).resolve().parents[2]
p=root/'igreen-premium-v3/dist/index.html'
s=p.read_text(encoding='utf-8-sig')
assert 'id="conexoes-fotografia"' not in s,'Already duplicated'
start=s.index('<section class="ecosystem wrap" id="conexoes">')
end=s.index('</section>',start)+len('</section>')
section=s[start:end]
duplicate=section.replace('class="ecosystem wrap"','class="ecosystem wrap ecosystem-photography"')
duplicate=re.sub(r'id="([^"]+)"',lambda match:'id="'+('conexoes-fotografia' if match.group(1)=='conexoes' else match.group(1)+'-foto')+'"',duplicate)
duplicate=duplicate.replace('name="connections"','name="connections-fotografia"')
duplicate=duplicate.replace('01 — UM NOVO ECOSSISTEMA','VARIAÇÃO 02 — FOTOGRAFIA')
duplicate=duplicate.replace('assets/maquete-energia.webp','assets/foto-energia.webp').replace('alt="Maquete de casa com painéis solares, bateria e carro elétrico verde"','alt="Imagem conceitual de casa urbana com painéis solares e carro verde"')
duplicate=duplicate.replace('IMAGEM ILUSTRATIVA','CENA CONCEITUAL')
s=s[:end]+'\n'+duplicate+s[end:]
p.write_text(s,encoding='utf-8')
ids=re.findall(r'\bid="([^"]+)"',s)
assert len(ids)==len(set(ids)), 'Duplicate HTML IDs'
print('Second gallery created; unique IDs and independent detail groups verified')
