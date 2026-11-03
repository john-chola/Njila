// Smoke test: opens index.html in a headless browser and checks a few searches.
// Run: npm install && npx playwright install chromium && npm test
const { chromium } = require('playwright');
const path = require('path');
const URL = 'file://' + path.resolve(__dirname, '..', 'index.html');
const CASES = [['Chelstone', 'Chawama', 2], ['UNZA', 'UTH', 2], ['Matero', 'Makeni Mall', 2]];
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 380, height: 800 } });
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto(URL + '#find'); await page.waitForTimeout(300);
  let failed = 0;
  for (const [from, to, maxDrops] of CASES) {
    await page.fill('#from', from); await page.fill('#to', to);
    await page.keyboard.press('Escape'); await page.click('#go');
    const head = (await page.textContent('#results .rhead').catch(() => '')) || '';
    const drops = parseInt(head, 10);
    const ok = drops >= 1 && drops <= maxDrops;
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${from} -> ${to}: ${head.trim() || 'no result'}`);
    if (!ok) failed++;
  }
  if (errors.length) { console.log('Page errors:', errors); failed++; }
  await browser.close();
  process.exit(failed ? 1 : 0);
})();
