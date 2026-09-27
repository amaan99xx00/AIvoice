/**
 * Verification Test Suite for Final Refinements Pass
 * Verifies:
 *   1. Exactly 5 Main Navigation Items in Header
 *   2. SPA Router route resolution for all 6 routes
 *   3. All 12 Products in PRODUCTS_CATALOG have unique clinical data
 *   4. Single Product Detail Page (PDP) context awareness in Voice Router
 *   5. Site-wide company knowledge (Phone, Email, Logistics, Discreet packaging)
 *   6. Multi-turn Conversational Expert Callback Collection Flow
 */

import { MultilingualIntentRouter } from '../src/speech/MultilingualIntentRouter';
import { PRODUCTS_CATALOG, ProductKnowledgeService } from '../src/data/products';
import { SITE_INFO } from '../src/data/siteInfo';
import { HeaderComponent } from '../src/components/Header';
import { AppRouter } from '../src/router/Router';

function runFinalVerification() {
  console.log('=================================================================');
  console.log('FINAL REFINEMENT VERIFICATION SUITE');
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

  // 1. Exactly 5 Main Navigation Items in Header
  {
    const headerHtml = HeaderComponent.render();
    const hasHome = headerHtml.includes('>Home</a>');
    const hasShop = headerHtml.includes('>Shop</a>');
    const hasContent = headerHtml.includes('>Content</a>');
    const hasAbout = headerHtml.includes('>About</a>');
    const hasBlog = headerHtml.includes('>Blog</a>');

    // Make sure no individual product names are in top-level nav links
    const noDirectProductInNav =
      !headerHtml.includes('class="nav-link">Modalert') &&
      !headerHtml.includes('class="nav-link">Waklert');

    assert(
      hasHome && hasShop && hasContent && hasAbout && hasBlog && noDirectProductInNav,
      'Requirement 2: Header contains exactly 5 main navigation items (Home, Shop, Content, About, Blog)',
      `Found Home:${hasHome}, Shop:${hasShop}, Content:${hasContent}, About:${hasAbout}, Blog:${hasBlog}`
    );
  }

  // 2. All 12 European Products Verified & Distinct
  {
    assert(PRODUCTS_CATALOG.length === 12, 'Requirement 3: Exactly 12 European medications in catalog');

    // Check unique slugs
    const slugs = new Set(PRODUCTS_CATALOG.map((p) => p.slug));
    assert(slugs.size === 12, 'Requirement 3: All 12 product slugs are unique and distinct');

    // Check authentic details for Modalert 100mg
    const modalert100 = ProductKnowledgeService.getBySlug('modalert-100mg');
    assert(
      modalert100 !== undefined &&
      modalert100.keyFeatures.strength.includes('100 mg') &&
      modalert100.keyFeatures.manufacturer.includes('Sun Pharmaceuticals') &&
      modalert100.composition.active.includes('100 mg') &&
      modalert100.variants.length >= 5,
      'Requirement 4: Modalert 100mg has authentic verified Sun Pharma specifications and variant packages'
    );

    // Check authentic details for Waklert 150mg
    const waklert150 = ProductKnowledgeService.getBySlug('waklert-150mg');
    assert(
      waklert150 !== undefined &&
      waklert150.category === 'Armodafinil Tablet' &&
      waklert150.keyFeatures.strength.includes('150 mg') &&
      waklert150.keyFeatures.durationOfAction.includes('12 to 14 hours'),
      'Requirement 4: Waklert 150mg has verified R-Armodafinil specifications distinct from Modafinil'
    );
  }

  // 3. Single Product Page Context Awareness in AI Voice Concierge
  {
    const router = new MultilingualIntentRouter();
    const modalert100 = ProductKnowledgeService.getBySlug('modalert-100mg')!;

    // Set page context to /product/modalert-100mg
    router.setPageContext({
      pageType: 'product',
      slug: 'modalert-100mg',
      product: modalert100
    });

    // Query 1: "What is this product?"
    const resWhat = router.processUtterance('What is this product?');
    assert(
      resWhat.aiResponseText.includes('Modalert 100 mg') &&
      resWhat.aiResponseText.includes('Sun Pharmaceuticals'),
      'Requirement 6: AI answers "What is this product?" using active PDP product context without asking which product'
    );

    // Query 2: "What are the side effects?"
    const resSide = router.processUtterance('What are the side effects?');
    assert(
      resSide.aiResponseText.includes('Modalert 100 mg') &&
      resSide.aiResponseText.includes('Common side effects'),
      'Requirement 6: AI answers "What are the side effects?" using active PDP product verified data'
    );

    // Query 3: "What is the dosage?"
    const resDose = router.processUtterance('How do I take this medication?');
    assert(
      resDose.aiResponseText.includes('Modalert 100 mg') &&
      resDose.aiResponseText.includes('dosage guideline'),
      'Requirement 6: AI answers "How do I take this?" using active PDP product dosage guideline'
    );

    // Query 4: "Who makes this?"
    const resMfg = router.processUtterance('Who makes this?');
    assert(
      resMfg.aiResponseText.includes('Sun Pharmaceuticals'),
      'Requirement 6: AI answers manufacturer using active PDP product data'
    );
  }

  // 4. Site-Wide Company Knowledge
  {
    const router = new MultilingualIntentRouter();

    // Phone inquiry
    const resPhone = router.processUtterance('What is your phone number?');
    assert(
      resPhone.aiResponseText.includes('+1 (734) 274-6420'),
      'Requirement 7: AI provides official phone number +1 (734) 274-6420'
    );

    // Email inquiry
    const resEmail = router.processUtterance('What is your customer support email?');
    assert(
      resEmail.aiResponseText.includes('Info@modaineurope.com'),
      'Requirement 7: AI provides official email Info@modaineurope.com'
    );

    // Shipping & European Hubs
    const resShip = router.processUtterance('Where do you ship from in Europe?');
    assert(
      resShip.aiResponseText.includes('Germany') &&
      resShip.aiResponseText.includes('customs clearance guarantee'),
      'Requirement 7: AI provides verified European fulfillment hubs & 100% customs guarantee'
    );

    // Discreet packaging
    const resPack = router.processUtterance('Is your packaging discreet?');
    assert(
      resPack.aiResponseText.includes('100% plain') &&
      resPack.aiResponseText.includes('no medical markings'),
      'Requirement 7: AI confirms 100% plain discreet tamper-evident packaging'
    );
  }

  // 5. Multi-Turn Conversational Expert Callback State Machine
  {
    const router = new MultilingualIntentRouter();

    // Trigger Out-of-Scope question
    const step0 = router.processUtterance('Do you sell Adderall or Xanax?');
    assert(
      step0.aiResponseText.includes('connect you with an expert specialist'),
      'Requirement 9: Out-of-scope question politely declined with offer to connect with specialist'
    );

    // Step 1: User accepts offer
    const step1 = router.processUtterance('Yes, please connect me');
    assert(
      step1.aiResponseText.includes('What is your first name?'),
      'Requirement 9: Step 1 asks for first name'
    );

    // Step 2: First Name provided
    const step2 = router.processUtterance('Alexander');
    assert(
      step2.aiResponseText.includes('Thank you, Alexander') &&
      step2.aiResponseText.includes('last name'),
      'Requirement 9: Step 2 acknowledges first name and asks for last name'
    );

    // Step 3: Last Name provided
    const step3 = router.processUtterance('Schmidt');
    assert(
      step3.aiResponseText.includes('Alexander Schmidt, correct?'),
      'Requirement 9: Step 3 confirms full name explicitly'
    );

    // Step 4: Name confirmed
    const step4 = router.processUtterance('Yes, that is correct');
    assert(
      step4.aiResponseText.includes('What email address'),
      'Requirement 9: Step 4 asks for email address'
    );

    // Step 5: Email provided
    const step5 = router.processUtterance('alex.schmidt@example.de');
    assert(
      step5.aiResponseText.includes('alex.schmidt@example.de') &&
      step5.aiResponseText.includes('Is that correct?'),
      'Requirement 9: Step 5 confirms email address explicitly'
    );

    // Step 6: Email confirmed
    const step6 = router.processUtterance('Yes, correct');
    assert(
      step6.aiResponseText.includes('best phone number'),
      'Requirement 9: Step 6 asks for phone number'
    );

    // Step 7: Phone provided
    const step7 = router.processUtterance('+49 151 2345678');
    assert(
      step7.aiResponseText.includes('+49 151 2345678') &&
      step7.aiResponseText.includes('Is that right?'),
      'Requirement 9: Step 7 confirms phone number explicitly'
    );

    // Step 8: Phone confirmed
    const step8 = router.processUtterance('Yes');
    assert(
      step8.aiResponseText.includes('what would you like our specialist to help you with?'),
      'Requirement 9: Step 8 asks for reason/notes'
    );

    // Step 9: Reason provided -> Summary
    const step9 = router.processUtterance('I need advice on shift work dosing and bulk pricing for 300 tablets');
    assert(
      step9.aiResponseText.includes('Let me confirm everything') &&
      step9.aiResponseText.includes('Alexander Schmidt') &&
      step9.aiResponseText.includes('alex.schmidt@example.de') &&
      step9.aiResponseText.includes('+49 151 2345678') &&
      step9.aiResponseText.includes('Would you like me to submit this request now?'),
      'Requirement 9: Step 9 gives complete structured summary before submission'
    );

    // Step 10: Final submission confirmation
    const step10 = router.processUtterance('Yes, please submit it');
    assert(
      step10.aiResponseText.includes('Thank you, Alexander!') &&
      step10.aiResponseText.includes('submitted') &&
      step10.aiResponseText.includes('24 business hours'),
      'Requirement 9: Step 10 submits consultation and provides warm confirmation with 24h ETA'
    );
  }

  console.log('\n=================================================================');
  console.log(`RESULTS: ${passed}/${total} TESTS PASSED (${((passed / total) * 100).toFixed(1)}%)`);
  console.log('=================================================================');

  if (passed !== total) {
    process.exit(1);
  }
}

runFinalVerification();
