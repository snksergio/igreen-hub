// Gera o resultado do hub (a pasta acima deste builder/) a partir deste código-fonte.
// Uso, dentro de builder/:  npm ci  e depois  node gerar-output-hub.mjs
//
// O que faz:
// 1. build do Vite com caminho relativo (--base=./) numa pasta temporária;
// 2. ajusta os 3 caminhos que o app monta a partir da raiz ("/assets/icons/", "/assets/img/", "/assets/video/"):
//    no Vercel o app mora na raiz do domínio; no hub, numa subpasta. O endereço passa a sair do próprio script
//    (import.meta.url), o que vale também dentro do CSS (as máscaras dos ícones são url() numa variável CSS);
// 3. troca index.html, favicon.png e assets/ da pasta acima pelos novos. projeto.json, _vitrine/, README.md e builder/ ficam.
import { execSync } from 'node:child_process'
import { cpSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const builder = fileURLToPath(new URL('.', import.meta.url))
const destino = resolve(builder, '..')
const tmp = mkdtempSync(join(tmpdir(), 'mob-hub-'))

execSync(`npx vite build --base=./ --outDir "${tmp}" --emptyOutDir`, { cwd: builder, stdio: 'inherit' })

let trocas = 0
for (const arquivo of readdirSync(join(tmp, 'assets')).filter((f) => f.endsWith('.js'))) {
  const caminho = join(tmp, 'assets', arquivo)
  const antes = readFileSync(caminho, 'utf8')
  const depois = antes.split('`/assets/').join('`${new URL("../",import.meta.url).href}assets/')
  trocas += antes.split('`/assets/').length - 1
  if (depois !== antes) writeFileSync(caminho, depois)
}
if (trocas !== 3) console.warn(`Atenção: esperava 3 caminhos "/assets/" no JS e achei ${trocas}. Confira src/assets.ts.`)

for (const item of ['index.html', 'favicon.png', 'assets']) rmSync(join(destino, item), { recursive: true, force: true })
cpSync(tmp, destino, { recursive: true })
rmSync(tmp, { recursive: true, force: true })
console.log(`Resultado gerado em ${destino} (${trocas} caminhos ajustados).`)
