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
  // A place that isn't a stop: the OpenStreetMap lookup is faked so the test runs offline.
  await page.route('https://nominatim.openstreetmap.org/**', r => r.fulfill({ contentType: 'application/json',
    body: JSON.stringify([{ name: 'Levy Junction', display_name: 'Levy Junction, Church Road, Lusaka', lat: '-15.4160', lon: '28.2950' }]) }));
  await page.fill('#from', 'Levy Junction'); await page.fill('#to', 'Chelstone');
  await page.keyboard.press('Escape'); await page.click('#go');
  await page.waitForSelector('#results .rhead', { timeout: 3000 }).catch(() => {});
  const placeHead = (await page.textContent('#results .rhead').catch(() => '')) || '';
  const placeSteps = (await page.textContent('#results .steps').catch(() => '')) || '';
  const placeOk = parseInt(placeHead, 10) >= 1 && /Walk to/.test(placeSteps);
  console.log(`${placeOk ? 'PASS' : 'FAIL'}  Levy Junction (place) -> Chelstone: ${placeHead.trim() || 'no result'}`);
  if (!placeOk) failed++;
  if (errors.length) { console.log('Page errors:', errors); failed++; }
  await browser.close();
  process.exit(failed ? 1 : 0);
})();
