/**
 * Empacota o build do Vite num arquivo HTML único e auto-contido.
 *
 * Motivo: a demo precisa ser navegável fora deste container (Artifact do
 * claude.ai), onde a CSP bloqueia qualquer host externo — CDN, fonte, XHR.
 * Então tudo entra inline: JS, CSS e as fontes em base64.
 *
 *   node empacotar.mjs  →  dist/nord-liberta-demo.html
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = 'dist';
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36';
const FONTES =
  'https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700' +
  '&family=DM+Sans:wght@400;500;700' +
  '&family=Montserrat:wght@400;500;600;700&display=swap';

/** Baixa a folha do Google Fonts e troca cada URL de woff2 por um data: URI.
 *  Fica só o subset `latin` — ele já cobre ã, õ, ç do pt-BR, e cortar o resto
 *  economiza mais da metade do peso. */
async function fontesInline() {
  const css = await (await fetch(FONTES, { headers: { 'User-Agent': UA } })).text();

  const blocos = css.split('@font-face').filter((b) => b.includes('src:'));
  const mantidos = [];
  for (const bloco of blocos) {
    const antes = css.slice(0, css.indexOf(bloco));
    const subset = antes.slice(antes.lastIndexOf('/*')).match(/\/\*\s*([\w-]+)\s*\*\//)?.[1];
    if (subset !== 'latin') continue;

    const url = bloco.match(/url\((https:\/\/[^)]+\.woff2)\)/)?.[1];
    if (!url) continue;
    const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
    mantidos.push(
      '@font-face' + bloco.replace(url, `data:font/woff2;base64,${buf.toString('base64')}`),
    );
    process.stdout.write(`  fonte embutida: ${(buf.length / 1024).toFixed(0)} KB\n`);
  }
  return mantidos.join('\n');
}

const arquivos = await readdir(join(DIST, 'assets'));
const js = await readFile(join(DIST, 'assets', arquivos.find((f) => f.endsWith('.js'))), 'utf8');
const css = await readFile(join(DIST, 'assets', arquivos.find((f) => f.endsWith('.css'))), 'utf8');

const html = `<title>Nord Liberta</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
<style>
${await fontesInline()}
${css}
</style>
<div id="root"></div>
<script type="module">
${js}
</script>
`;

const saida = join(DIST, 'nord-liberta-demo.html');
await writeFile(saida, html);
process.stdout.write(`\n${saida} — ${(html.length / 1024 / 1024).toFixed(2)} MB\n`);
