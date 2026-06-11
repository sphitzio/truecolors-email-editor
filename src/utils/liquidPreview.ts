// Client-side Liquid rendering for the preview pane. Browsers can't execute
// Liquid, so we run the raw template through liquidjs with mock data to produce
// preview HTML. The exported template (Copy/Download) stays raw Liquid.
import { Liquid } from 'liquidjs';
import { MOCK_CONTEXT } from './mockData';

// Lenient engine: undefined vars/filters render empty instead of throwing, so
// deeply nested loop-local variables we don't mock degrade gracefully.
const engine = new Liquid({
  cache: false,
  strictFilters: false,
  strictVariables: false,
  lenientIf: true,
});

// Some Shopify-specific filters aren't built into liquidjs. Register no-op /
// passthrough versions so templates using them don't break the preview.
engine.registerFilter('money', (v) => (v == null ? '' : String(v)));
engine.registerFilter('money_with_currency', (v) => (v == null ? '' : String(v)));
engine.registerFilter('money_without_currency', (v) => (v == null ? '' : String(v)));
engine.registerFilter('payment_terms', (v) => v);
engine.registerFilter('t', (v) => v); // translation key passthrough

// Product line images: templates do `{{ line | img_url: 'size' }}`. `line` is
// an object, so pull a usable URL from it (mock items carry .image/.image_url),
// falling back to a generic placeholder so the preview never shows a broken img.
const PRODUCT_PLACEHOLDER =
  'https://cdn.shopify.com/s/files/1/0819/7518/1554/files/mail1_430x.png?v=1781052228';
const pickImage = (v: unknown): string => {
  if (typeof v === 'string') return v;
  if (v && typeof v === 'object') {
    const o = v as Record<string, unknown>;
    const found = o.image_url || o.image || o.src || (o.product as Record<string, unknown>)?.image;
    if (typeof found === 'string') return found;
  }
  return PRODUCT_PLACEHOLDER;
};
engine.registerFilter('img_url', pickImage);
engine.registerFilter('image_url', pickImage);
engine.registerFilter('image_tag', (v) => `<img src="${pickImage(v)}">`);

// Shopify asset-URL filters reference hosted assets we don't have. Return a
// transparent 1px so spacers/no-image icons don't render as broken images.
const BLANK = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
engine.registerFilter('shopify_asset_url', () => BLANK);
engine.registerFilter('cdn_asset_url', () => BLANK);
engine.registerFilter('asset_url', () => BLANK);
engine.registerFilter('global_asset_url', () => BLANK);

engine.registerFilter('weight_with_unit', (v) => (v == null ? '' : String(v)));
engine.registerFilter('date', (v) => (v == null ? '' : String(v)));

/**
 * Rewrite the Shopify-hosted notification stylesheet link to our bundled copy
 * so the preview is styled. base = import.meta.env.BASE_URL (Vite base path).
 */
function rewriteStylesLink(html: string, base: string): string {
  const local = `${base.replace(/\/$/, '')}/templates/styles.css`;
  return html.replace(
    /href=["']\/assets\/notifications\/styles\.css["']/g,
    `href="${local}"`,
  );
}

/**
 * Render a raw notification template to preview HTML.
 * Falls back to the rewritten raw HTML if Liquid rendering throws.
 */
export async function renderTemplatePreview(
  rawHtml: string,
  base: string,
): Promise<string> {
  let rendered: string;
  try {
    rendered = await engine.parseAndRender(rawHtml, MOCK_CONTEXT);
  } catch {
    rendered = rawHtml;
  }
  return rewriteStylesLink(rendered, base);
}
