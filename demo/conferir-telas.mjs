/**
 * Sobe o HTML empacotado num Chromium e navega pela jornada, tirando print de
 * cada parada. Serve para conferir que o arquivo único realmente funciona —
 * um frame em branco é falha de subida, não sucesso silencioso.
 *
 * Viewport 390 × 664: é exatamente o alvo que o §9.1 da especificação declara.
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const ALVO = pathToFileURL(resolve('dist/nord-liberta-demo.html')).href;
const SAIDA = process.argv[2] ?? 'capturas-r09';

const navegador = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const pagina = await navegador.newPage({ viewport: { width: 390, height: 664 }, deviceScaleFactor: 2 });

const problemas = [];
pagina.on('console', (m) => m.type() === 'error' && problemas.push(m.text()));
pagina.on('pageerror', (e) => problemas.push(`PAGEERROR: ${e.message}`));

await pagina.goto(ALVO, { waitUntil: 'networkidle' });
await pagina.waitForTimeout(600);

/** Clica no primeiro elemento cujo texto casa, e diz se achou. */
async function tocar(texto) {
  const alvo = pagina.getByText(texto, { exact: false }).first();
  if ((await alvo.count()) === 0) return false;
  await alvo.click({ timeout: 4000 }).catch(() => {});
  await pagina.waitForTimeout(500);
  return true;
}

async function print(nome) {
  await pagina.screenshot({ path: `${SAIDA}/${nome}.png` });
  const vazia = await pagina.evaluate(() => document.getElementById('root')?.children.length === 0);
  console.log(`  ${vazia ? '✗ VAZIA' : '✓'}  ${nome}`);
}

await print('01-abertura');

// O que existe de navegação na tela inicial, para eu não chutar rótulo.
const rotulos = await pagina.evaluate(() =>
  [...document.querySelectorAll('button, a, [role="button"]')]
    .map((e) => e.innerText?.trim().split('\n')[0])
    .filter((t) => t && t.length < 40)
    .slice(0, 40),
);
console.log('\nControles visíveis na abertura:');
console.log(rotulos.map((r) => `  · ${r}`).join('\n'));

console.log('\nRoteiro:');
for (const [nome, rotulo] of JSON.parse(process.env.ROTEIRO ?? '[]')) {
  const achou = await tocar(rotulo);
  if (!achou) { console.log(`  — não achei "${rotulo}"`); continue; }
  await print(nome);
}

console.log(problemas.length ? `\n⚠ erros de console:\n${problemas.slice(0, 8).join('\n')}` : '\n✓ sem erro de console');
await navegador.close();
