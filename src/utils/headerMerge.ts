// Merges the tool's TrueColors brand logo header into a raw notification
// template. 41/44 templates expose <td class="shop-name__cell"> as the logo
// slot; gift-card / store-credit templates instead use an <img class=
// "giftcard__logosize">. Handling both gives every template one consistent
// branded header while staying valid Liquid HTML.
import { BrandState } from '../types';

function logoImg(brand: BrandState): string {
  const alt = brand.storeName || 'Logo';
  return `<img src="${brand.logoUrl}" alt="${alt}" width="${brand.logoWidth}" style="max-width:100%;height:auto;border:0;">`;
}

export function mergeBrandHeader(rawHtml: string, brand: BrandState): string {
  // Primary: replace the inner content of <td class="shop-name__cell">.
  const cellRe = /(<td[^>]*class=["'][^"']*shop-name__cell[^"']*["'][^>]*>)([\s\S]*?)(<\/td>)/i;
  if (cellRe.test(rawHtml)) {
    return rawHtml.replace(cellRe, (_m, open, _inner, close) => {
      return `${open}\n                    <a href="{{shop.url}}">${logoImg(brand)}</a>\n                  ${close}`;
    });
  }

  // Fallback (gift card / store credit): rewrite the logo <img>, preserving
  // its original class so the template's own layout still applies.
  const imgRe = /<img\b[^>]*class=["'][^"']*((?:giftcard|store_credit)__logosize)[^"']*["'][^>]*>/gi;
  if (imgRe.test(rawHtml)) {
    return rawHtml.replace(imgRe, (_m, cls) =>
      `<img src="${brand.logoUrl}" alt="${brand.storeName || 'Logo'}" class="${cls}" width="${brand.logoWidth}" style="max-width:100%;height:auto;border:0;">`,
    );
  }

  return rawHtml;
}

function band(html: string): string {
  // Wrap custom header/footer content in a centered, email-safe container.
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="padding:16px 0;">
    <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;">
      <tr><td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#51545e;text-align:center;padding:0 24px;">
        ${html}
      </td></tr>
    </table>
  </td></tr></table>`;
}

/**
 * Inject optional custom Header (just after <body>) and Footer (just before
 * </body>) banners. Empty strings inject nothing. Kept separate from the brand
 * logo header (mergeBrandHeader), which only swaps the logo image.
 */
export function injectHeaderFooter(
  rawHtml: string,
  headerHtml: string,
  footerHtml: string,
): string {
  let out = rawHtml;
  if (headerHtml.trim()) {
    // Place the custom header band after the whole header block (logo + order
    // number), i.e. just before the first content table. Fall back to after the
    // logo cell, then to top-of-body.
    const contentRe = /(<table[^>]*class=["'][^"']*row content[^"']*["'][^>]*>)/i;
    const cellRe = /(<td[^>]*class=["'][^"']*shop-name__cell[^"']*["'][^>]*>[\s\S]*?<\/td>)/i;
    const imgRe = /(<img\b[^>]*class=["'][^"']*(?:giftcard|store_credit)__logosize[^"']*["'][^>]*>)/i;
    if (contentRe.test(out)) {
      out = out.replace(contentRe, (m) => `${band(headerHtml)}\n${m}`);
    } else if (cellRe.test(out)) {
      out = out.replace(cellRe, (m) => `${m}\n${band(headerHtml)}`);
    } else if (imgRe.test(out)) {
      out = out.replace(imgRe, (m) => `${m}\n${band(headerHtml)}`);
    } else {
      out = out.replace(/(<body[^>]*>)/i, (_m, open) => `${open}\n${band(headerHtml)}`);
    }
  }
  if (footerHtml.trim()) {
    out = out.replace(/(<\/body>)/i, `${band(footerHtml)}\n$1`);
  }
  return out;
}

// Button color overrides baked into the EXPORTED template so real sent emails
// use the TrueColors palette regardless of the Shopify accent-color setting.
const BUTTON_COLOR_STYLE = `
  <style>
    /* TrueColors button palette */
    .button__cell { background-color: #840031 !important; }           /* secondary */
    .button__cell--primary,
    .actions-buttons .button__cell--primary { background-color: #FF8000 !important; } /* primary */
    .button__cell--secondary,
    .button--secondary .button__cell,
    .button__cell--tertiary,
    .button--tertiary .button__cell { background-color: #5B6000 !important; }         /* tertiary */
    .button__cell--shop { background-color: #5a31f4 !important; }      /* Shop Pay */
    .button__cell a, .button__text { color: #ffffff !important; text-decoration: none !important; }
  </style>`;

/**
 * Inject the button-color override stylesheet just before </head> so it wins
 * over the template's inline {{ shop.email_accent_color }} rules. Idempotent.
 */
export function applyButtonColors(rawHtml: string): string {
  if (rawHtml.includes('TrueColors button palette')) return rawHtml;
  if (/<\/head>/i.test(rawHtml)) {
    return rawHtml.replace(/<\/head>/i, `${BUTTON_COLOR_STYLE}\n</head>`);
  }
  // No <head> (some templates start with Liquid): prepend the style block.
  return `${BUTTON_COLOR_STYLE}\n${rawHtml}`;
}

/**
 * Snippet inserted by the "Insert image" control at the cursor in the raw editor.
 */
export function imageSnippet(url: string, width?: number, alt = ''): string {
  const w = width ? ` width="${width}"` : '';
  return `<img src="${url}" alt="${alt}"${w} style="max-width:100%;height:auto;border:0;">`;
}
