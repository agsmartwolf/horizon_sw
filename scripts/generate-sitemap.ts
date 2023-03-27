import * as fs from 'fs';
import Globby from 'globby';

function addPage(page: string) {
  const path = page.replace('pages', '').replace('.js', '').replace('.mdx', '');
  const route = path === '/index' ? '' : path;

  return `  <url>
    <loc>${`${process.env.NEXT_PUBLIC_STORE_URL}${route}`}</loc>
    <changefreq>hourly</changefreq>
  </url>`;
}

async function generateSitemap() {
  // Ignore Next.js specific files (e.g., _app.js) and API routes.
  const pages = await Globby.globby([
    'pages/**/*{.ts,.tsx,.mdx}',
    '!pages/_*.tsx',
    '!pages/api',
  ]);
  const sitemap = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(addPage).join('\n')}
</urlset>`;

  fs.writeFileSync('public/sitemap.xml', sitemap);
}

generateSitemap();
