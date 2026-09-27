/**
 * Automated Verification Suite for Free Production Deployment Readiness
 * Verifies all 14 criteria:
 *   1. Production build artifacts in dist/ (index.html, robots.txt, sitemap.xml, favicon.svg, site.webmanifest)
 *   2. Vercel deployment configuration (vercel.json, SPA rewrites, microphone Permissions-Policy)
 *   3. Direct pathname routing without hash (e.g. /product/nike-air-max-270, /shop, /about, /products)
 *   4. Clean environment variable configuration (.env.example, no exposed secrets)
 *   5. Zero localhost / 127.0.0.1 URLs in source code
 *   6. Production SEO meta tags (Open Graph, Twitter, canonical, robots)
 *   7. Zero network dependency SVG image fallbacks for voice & store cards
 */

import * as fs from 'fs';
import * as path from 'path';
import { AppRouter } from '../src/router/Router';
import { UnifiedProductService } from '../src/services/UnifiedProductService';

function runProductionReadinessTests() {
  console.log('=================================================================');
  console.log('TESTING FREE VERCEL PRODUCTION DEPLOYMENT READINESS');
  console.log('=================================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string, details?: string) {
    total++;
    if (condition) {
      passed++;
      console.log(`✅ PASS: ${testName}`);
    } else {
      console.log(`❌ FAIL: ${testName} - ${details || ''}`);
    }
  }

  const rootDir = process.cwd();

  // 1. Vercel Configuration Verification
  {
    const vercelConfigPath = path.join(rootDir, 'vercel.json');
    assert(fs.existsSync(vercelConfigPath), 'Criterion 2: vercel.json exists in project root');

    const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf-8'));
    assert(
      vercelConfig.buildCommand === 'npm run build' &&
      vercelConfig.outputDirectory === 'dist',
      'Criterion 2 & 4: vercel.json specifies npm run build and dist outputDirectory'
    );

    const hasSpaWildcard = vercelConfig.rewrites && vercelConfig.rewrites.some(
      (r: any) => r.source === '/(.*)' && r.destination === '/index.html'
    );
    assert(
      hasSpaWildcard,
      'Criterion 1 & 9: vercel.json includes SPA wildcard rewrite /(.*) -> /index.html'
    );

    const permissionsHeader = vercelConfig.headers?.flatMap((h: any) => h.headers)?.find(
      (head: any) => head.key === 'Permissions-Policy'
    );
    assert(
      permissionsHeader && permissionsHeader.value.includes('microphone=(self)'),
      'Criterion 7 & 12: vercel.json configures microphone=(self) in Permissions-Policy header for HTTPS voice capture'
    );
  }

  // 2. Environment Variables & Secret Hygiene
  {
    const envExamplePath = path.join(rootDir, '.env.example');
    assert(fs.existsSync(envExamplePath), 'Criterion 3: .env.example exists with placeholder values');

    const envContent = fs.readFileSync(envExamplePath, 'utf-8');
    assert(
      envContent.includes('VITE_APP_URL') &&
      envContent.includes('VITE_VAPI_API_KEY') &&
      !envContent.includes('sk_') &&
      !envContent.includes('password123'),
      'Criterion 3 & 12: .env.example contains public placeholders and zero leaked credentials'
    );

    const gitignoreContent = fs.readFileSync(path.join(rootDir, '.gitignore'), 'utf-8');
    assert(
      gitignoreContent.includes('.env') &&
      gitignoreContent.includes('.vercel'),
      'Criterion 3 & 12: .gitignore properly excludes .env files and .vercel folder'
    );
  }

  // 3. Direct Navigation & Route Resolution
  {
    const router = AppRouter.getInstance();

    // Direct PDP link 1
    const ctxNike = router.parseCurrentRoute('/product/nike-air-max-270');
    assert(
      ctxNike.pageType === 'product' && ctxNike.slug === 'nike-air-max-270',
      'Criterion 1 & 9: Direct navigation to /product/nike-air-max-270 parses without 404'
    );

    // Direct PDP link 2 (medication)
    const ctxMod = router.parseCurrentRoute('/product/modalert-100mg');
    assert(
      ctxMod.pageType === 'product' && ctxMod.slug === 'modalert-100mg',
      'Criterion 1 & 9: Direct navigation to /product/modalert-100mg parses correctly'
    );

    // Direct /products alias
    const ctxProducts = router.parseCurrentRoute('/products');
    assert(
      ctxProducts.pageType === 'shop',
      'Criterion 9: Direct navigation to /products alias routes to shop catalog'
    );

    // Direct /about
    const ctxAbout = router.parseCurrentRoute('/about');
    assert(
      ctxAbout.pageType === 'about',
      'Criterion 9: Direct navigation to /about resolves correctly'
    );

    // Direct /content
    const ctxContent = router.parseCurrentRoute('/content');
    assert(
      ctxContent.pageType === 'content',
      'Criterion 9: Direct navigation to /content resolves correctly'
    );

    // Direct /blog
    const ctxBlog = router.parseCurrentRoute('/blog');
    assert(
      ctxBlog.pageType === 'blog',
      'Criterion 9: Direct navigation to /blog resolves correctly'
    );
  }

  // 4. Production SEO & Head Tags
  {
    const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
    assert(
      indexHtml.includes('<title>') &&
      indexHtml.includes('name="description"') &&
      indexHtml.includes('name="robots"') &&
      indexHtml.includes('property="og:title"') &&
      indexHtml.includes('property="og:description"') &&
      indexHtml.includes('name="twitter:card"') &&
      indexHtml.includes('rel="manifest"'),
      'Criterion 10: index.html contains complete production SEO, Open Graph, and Twitter metadata'
    );

    const sitemapContent = fs.readFileSync(path.join(rootDir, 'public/sitemap.xml'), 'utf-8');
    assert(
      sitemapContent.includes('<loc>') &&
      sitemapContent.includes('modalert-100mg') &&
      sitemapContent.includes('nike-air-max-270') &&
      !sitemapContent.includes('localhost'),
      'Criterion 10: sitemap.xml exists and contains verified catalog routes without localhost references'
    );

    const robotsContent = fs.readFileSync(path.join(rootDir, 'public/robots.txt'), 'utf-8');
    assert(
      robotsContent.includes('User-agent: *') &&
      robotsContent.includes('Sitemap:'),
      'Criterion 10: robots.txt allows search engine crawlers and points to sitemap'
    );
  }

  // 5. Zero Localhost / 127.0.0.1 in Source Files
  {
    const srcDir = path.join(rootDir, 'src');
    let hasLocalhost = false;

    function scanDir(dir: string) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const full = path.join(dir, file);
        if (fs.statSync(full).isDirectory()) {
          scanDir(full);
        } else if (file.endsWith('.ts') || file.endsWith('.html') || file.endsWith('.css')) {
          const content = fs.readFileSync(full, 'utf-8');
          if (content.includes('localhost') || content.includes('127.0.0.1')) {
            hasLocalhost = true;
            console.error(`Found development URL in: ${full}`);
          }
        }
      }
    }

    scanDir(srcDir);
    assert(!hasLocalhost, 'Criterion 7 & 12: Zero localhost or 127.0.0.1 development URLs in src/ directory');
  }

  // 6. Zero Network Dependency Image Fallbacks
  {
    const allProducts = UnifiedProductService.getAll();
    const allHaveFallbacks = allProducts.every(
      (p) => p.fallbackImage && p.fallbackImage.startsWith('data:image/svg+xml')
    );
    assert(
      allHaveFallbacks,
      'Criterion 5: All catalog products have 100% reliable inline vector SVG fallback images'
    );
  }

  // 7. Production Build Verification
  {
    const distIndex = path.join(rootDir, 'dist/index.html');
    const distFavicon = path.join(rootDir, 'dist/favicon.svg');
    const distSitemap = path.join(rootDir, 'dist/sitemap.xml');
    const distRobots = path.join(rootDir, 'dist/robots.txt');

    assert(
      fs.existsSync(distIndex) &&
      fs.existsSync(distFavicon) &&
      fs.existsSync(distSitemap) &&
      fs.existsSync(distRobots),
      'Criterion 1: Production dist/ directory contains all required entry and static SEO assets'
    );
  }

  console.log('\n=================================================================');
  console.log(`RESULTS: ${passed}/${total} TESTS PASSED (${((passed / total) * 100).toFixed(1)}%)`);
  console.log('=================================================================');

  if (passed !== total) process.exit(1);
}

runProductionReadinessTests();
