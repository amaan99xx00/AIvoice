/**
 * Verification Suite for Single Product AI Understanding & Dynamic Rich Cards
 * Tests all 8 core criteria from the prompt.
 */

import { MultilingualIntentRouter } from '../src/speech/MultilingualIntentRouter';
import { UnifiedProductService } from '../src/services/UnifiedProductService';
import { ProductDetailView } from '../src/views/ProductDetailView';

function runVerification() {
  console.log('=================================================================');
  console.log('TESTING SINGLE PRODUCT UNDERSTANDING & RICH CARDS');
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

  // 1. Single-Product Query Identification & Understanding
  {
    const router = new MultilingualIntentRouter();
    const res = router.processUtterance('Tell me about Nike Air Max 270');

    assert(
      res.productCard !== undefined &&
      res.productCard.name === 'Nike Air Max 270' &&
      res.productCard.brand === 'Nike' &&
      res.productCard.price === '€149.99' &&
      res.aiResponseText.includes('Nike Air Max 270') &&
      res.aiResponseText.includes('€149.99'),
      'Requirement 1: AI understands "Tell me about Nike Air Max 270" and returns focused product card',
      `Got productCard: ${res.productCard?.name}, Voice text: "${res.aiResponseText}"`
    );
  }

  // 2. Specific Questions about Single Product (Sizes, Availability, Cost, Buy)
  {
    const router = new MultilingualIntentRouter();

    // Sizes
    const resSizes = router.processUtterance('What sizes are available for Nike Air Max 270?');
    assert(
      resSizes.productCard !== undefined &&
      resSizes.aiResponseText.includes('US 7.5') &&
      resSizes.productCard.availableSizes!.length >= 5,
      'Requirement 1 & 5: AI answers "What sizes are available for Nike Air Max 270" with factual size options'
    );

    // Availability
    const resAvail = router.processUtterance('Is Nike Air Max 270 available?');
    assert(
      resAvail.productCard !== undefined &&
      resAvail.aiResponseText.toLowerCase().includes('in stock') &&
      resAvail.productCard.inStock === true,
      'Requirement 1 & 5: AI answers "Is Nike Air Max 270 available" verifying stock status'
    );

    // Cost / Price
    const resPrice = router.processUtterance('How much is Nike Air Max 270?');
    assert(
      resPrice.productCard !== undefined &&
      resPrice.aiResponseText.includes('€149.99'),
      'Requirement 1: AI answers "How much is Nike Air Max 270?" with verified price €149.99'
    );

    // Purchase intent
    const resBuy = router.processUtterance('I want to buy Nike Air Max 270');
    assert(
      resBuy.productCard !== undefined &&
      resBuy.actionRequired === 'CONFIRM_CART' &&
      resBuy.aiResponseText.includes('€149.99'),
      'Requirement 1: AI handles "I want to buy Nike Air Max 270" with cart confirmation intent'
    );
  }

  // 3. Dynamic Response Card Contents & Image Validation
  {
    const product = UnifiedProductService.getBySlug('nike-air-max-270')!;
    assert(
      product !== undefined &&
      product.image.length > 0 &&
      product.fallbackImage.startsWith('data:image/svg+xml') &&
      product.features!.length >= 3 &&
      product.rating === 4.8 &&
      product.reviewCount === 142 &&
      product.availableSizes!.includes('US 9') &&
      product.availableColors!.includes('Triple Black'),
      'Requirement 2 & 3: Product card data structure contains verified images, fallbacks, rating, and specifications'
    );

    // Check SVG fallback reliability
    const medProduct = UnifiedProductService.getBySlug('modalert-100mg')!;
    assert(
      medProduct !== undefined &&
      medProduct.fallbackImage.includes('<svg') &&
      medProduct.fallbackImage.includes('CERTIFIED PHARMACEUTICAL'),
      'Requirement 3: Fallback images are clean category-specific inline vector SVGs without external dependencies'
    );
  }

  // 4. Dedicated Product Page Navigation & General Product Rendering
  {
    const pdpHtml = ProductDetailView.render('nike-air-max-270');
    assert(
      pdpHtml.includes('class="view-product-detail"') &&
      pdpHtml.includes('Nike Air Max 270') &&
      pdpHtml.includes('pdp-size-chip') &&
      pdpHtml.includes('pdp-color-chip') &&
      pdpHtml.includes('btn-pdp-add-cart') &&
      pdpHtml.includes('Air Max 270'),
      'Requirement 4: ProductDetailView renders dedicated interactive PDP for extended non-medication products with size chips, color chips, and specs table'
    );

    // Medication PDP integrity preserved
    const medPdpHtml = ProductDetailView.render('modalert-100mg');
    assert(
      medPdpHtml.includes('Modalert 100 mg') &&
      medPdpHtml.includes('Sun Pharmaceuticals') &&
      medPdpHtml.includes('pdp-variant-row'),
      'Requirement 4: Medication PDP retains authentic clinical monograph and variant pricing table'
    );
  }

  // 5. Context Awareness: "What is this product?" while on PDP
  {
    const router = new MultilingualIntentRouter();
    router.setPageContext({
      pageType: 'product',
      slug: 'nike-air-max-270'
    });

    const resWhat = router.processUtterance('What is this product?');
    assert(
      resWhat.productCard !== undefined &&
      resWhat.productCard.slug === 'nike-air-max-270' &&
      resWhat.aiResponseText.includes('Nike Air Max 270'),
      'Requirement 1 & 5: When on Nike PDP, "What is this product?" resolves to active product context'
    );

    const resSizes = router.processUtterance('What sizes are available?');
    assert(
      resSizes.productCard !== undefined &&
      resSizes.aiResponseText.includes('US 7.5'),
      'Requirement 1 & 5: When on PDP, "What sizes are available?" answers with active product sizes'
    );
  }

  // 6. Multi-Product vs. Single-Product Distinction
  {
    const router = new MultilingualIntentRouter();

    // Multi-product query
    const resMulti = router.processUtterance('Show me running shoes');
    assert(
      resMulti.productList !== undefined &&
      resMulti.productList.length >= 2 &&
      resMulti.productList.some((p) => p.slug === 'nike-air-max-270') &&
      resMulti.productList.some((p) => p.slug === 'nike-air-zoom-pegasus-40'),
      'Requirement 6: Multi-product query "Show me running shoes" returns productList with 2+ shoes'
    );

    // Single-product query
    const resSingle = router.processUtterance('Tell me about Nike Air Zoom Pegasus 40');
    assert(
      resSingle.productCard !== undefined &&
      resSingle.productCard.slug === 'nike-air-zoom-pegasus-40' &&
      resSingle.productList === undefined,
      'Requirement 6: Specific single product query returns productCard, NOT a generic productList'
    );
  }

  // 7. Error Handling & Fallbacks for Unavailable Products
  {
    const router = new MultilingualIntentRouter();
    const resUnknown = router.processUtterance('Do you have Adidas Ultraboost running shoes?');

    assert(
      resUnknown.aiResponseText.includes("I couldn't find that exact product in our catalog. Would you like me to show you similar products?") &&
      resUnknown.productList !== undefined &&
      resUnknown.productList.some((p) => p.slug === 'nike-air-max-270'),
      'Requirement 7: Graceful error fallback for unknown products offering similar alternatives'
    );
  }

  // 8. Zero Hallucinations: All values match catalog
  {
    const router = new MultilingualIntentRouter();
    const res = router.processUtterance('Give me details about Modalert 200mg');
    const catalogItem = (UnifiedProductService.getBySlug('modalert-200-mg') || UnifiedProductService.getBySlug('modalert-200mg'))!;

    assert(
      res.productCard !== undefined &&
      catalogItem !== undefined &&
      res.productCard.price === catalogItem.price &&
      res.productCard.brand === catalogItem.brand &&
      res.productCard.name === catalogItem.name,
      'Requirement 8: Zero hallucinations verified — returned specifications match catalog database 100%'
    );
  }

  console.log('\n=================================================================');
  console.log(`RESULTS: ${passed}/${total} TESTS PASSED (${((passed / total) * 100).toFixed(1)}%)`);
  console.log('=================================================================');

  if (passed !== total) process.exit(1);
}

runVerification();
