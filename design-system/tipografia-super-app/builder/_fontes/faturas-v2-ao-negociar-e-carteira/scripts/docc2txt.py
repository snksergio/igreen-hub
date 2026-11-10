import json, sys
d = json.load(open(sys.argv[1], encoding='utf-8'))
refs = d.get('references', {})
def inl(items):
    out=[]
    for it in items or []:
        t=it.get('type')
        if t=='text': out.append(it['text'])
        elif t in ('emphasis','strong','newTerm','inlineHead'): out.append(inl(it.get('inlineContent')))
        elif t=='codeVoice': out.append(it.get('code',''))
        elif t=='reference':
            r=refs.get(it.get('identifier'),{})
            out.append(r.get('title', it.get('identifier','')))
        elif t=='image': out.append('[img]')
        else: out.append(inl(it.get('inlineContent')))
    return ''.join(out)
def blk(b, ind=''):
    t=b.get('type')
    if t=='heading': print('\n'+'#'*b.get('level',2)+' '+b.get('text',''))
    elif t=='paragraph': print(ind+inl(b.get('inlineContent')))
    elif t in ('unorderedList','orderedList'):
        for i in b.get('items',[]):
            for c in i.get('content',[]): blk(c, ind+'  - ')
    elif t=='table':
        for row in b.get('rows',[]):
            cells=[]
            for cell in row:
                cells.append(' '.join(inl(x.get('inlineContent')) if x.get('type')=='paragraph' else '' for x in cell))
            print(ind+' | '.join(cells))
    elif t=='aside':
        for c in b.get('content',[]): blk(c, ind+'> ')
    elif t in ('tabNavigator',):
        for tab in b.get('tabs',[]):
            print(ind+'[TAB '+tab.get('title','')+']')
            for c in tab.get('content',[]): blk(c, ind)
    elif t=='row':
        for col in b.get('columns',[]):
            for c in col.get('content',[]): blk(c, ind)
    elif t=='links' or t=='small':
        if 'inlineContent' in b: print(ind+inl(b['inlineContent']))
    else:
        for k in ('content',):
            for c in b.get(k,[]) or []: blk(c, ind)
        if 'inlineContent' in b: print(ind+inl(b['inlineContent']))
for sec in d.get('primaryContentSections',[]):
    for c in sec.get('content',[]): blk(c)
