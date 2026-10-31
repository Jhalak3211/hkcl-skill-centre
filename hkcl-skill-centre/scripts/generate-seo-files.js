// Runs automatically before `npm run build` (see "prebuild" in package.json).
// Writes public/robots.txt and public/sitemap.xml from siteConfig + courses,
// so they never go stale when you add or remove courses.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { siteConfig } from '../src/data/siteConfig.js';
import { courses } from '../src/data/courses.js';

const base = siteConfig.siteUrl.replace(/\/$/, '');

if (base.includes('example.com')) {
  console.warn(
    '\n[seo] siteConfig.siteUrl is still the placeholder (' + base + ').\n' +
      '[seo] Set your real domain in src/data/siteConfig.js before launch.\n'
  );
}

const paths = ['/', '/about', '/gallery', '/courses', '/contact', ...courses.map((c) => `/courses/${c.slug}`)];

const sitemap =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  paths.map((p) => `  <url><loc>${base}${p === '/' ? '/' : p}</loc></url>`).join('\n') +
  '\n</urlset>\n';

const robots = `User-agent: *
Allow: /
Disallow: /student-login
Disallow: /secure-admin-portal
Disallow: /admin
Disallow: /staff

Sitemap: ${base}/sitemap.xml
`;

const publicDir = fileURLToPath(new URL('../public/', import.meta.url));
writeFileSync(publicDir + 'sitemap.xml', sitemap);
writeFileSync(publicDir + 'robots.txt', robots);
console.log(`[seo] Wrote sitemap.xml (${paths.length} URLs) and robots.txt`);
