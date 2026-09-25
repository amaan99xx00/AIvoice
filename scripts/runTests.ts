/**
 * CLI Test Runner for Section 5A.22 Acceptance Test Suite
 */
import { VoiceAcceptanceSuite } from '../src/test/VoiceAcceptanceSuite';

async function main() {
  console.log('=================================================================');
  console.log('RUNNING SECTION 5A VOICE QUALITY ACCEPTANCE TEST SUITE (11 TESTS)');
  console.log('=================================================================\n');

  const results = await VoiceAcceptanceSuite.runAutomatedAcceptanceTests();

  let passCount = 0;
  for (const t of results) {
    const status = t.passed ? '✅ PASS' : '❌ FAIL';
    if (t.passed) passCount++;
    console.log(`${status} [${t.category.toUpperCase()}] ${t.name}`);
    console.log(`   Expected: ${t.expected}`);
    console.log(`   Actual:   ${t.actual}\n`);
  }

  console.log('=================================================================');
  console.log(`RESULTS: ${passCount}/${results.length} TESTS PASSED (${((passCount / results.length) * 100).toFixed(1)}%)`);
  console.log('=================================================================');

  if (passCount !== results.length) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
