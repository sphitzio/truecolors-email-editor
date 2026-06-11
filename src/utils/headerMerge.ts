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

/**
 * Snippet inserted by the "Insert image" control at the cursor in the raw editor.
 */
export function imageSnippet(url: string, width?: number, alt = ''): string {
  const w = width ? ` width="${width}"` : '';
  return `<img src="${url}" alt="${alt}"${w} style="max-width:100%;height:auto;border:0;">`;
}
