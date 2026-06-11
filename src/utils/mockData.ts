// Representative mock context for rendering Shopify notification templates in
// the browser preview. Covers the common top-level objects; deeply nested
// loop-local variables degrade gracefully (liquidjs lenient mode renders
// undefined as empty). This is preview-only — exported HTML keeps raw Liquid.

const money = (n: number) => `AED ${n.toFixed(2)}`;

const lineItem = (title: string, qty: number, price: number, img: string) => ({
  title,
  quantity: qty,
  final_line_price: money(price * qty),
  final_price: money(price),
  price: money(price),
  line_price: money(price * qty),
  product: { title },
  variant_title: '',
  image: img,
  image_url: img,
  requires_shipping: true,
  vendor: 'TrueColors',
  sku: 'TC-' + Math.floor(Math.random() * 9000 + 1000),
});

const address = (name: string) => ({
  name,
  first_name: name.split(' ')[0],
  last_name: name.split(' ').slice(1).join(' '),
  address1: '42 Marina Walk',
  address2: 'Suite 10',
  city: 'Dubai',
  province: 'Dubai',
  zip: '00000',
  country: 'United Arab Emirates',
  phone: '+971 4 000 0000',
});

const lineItems = [
  lineItem('Classic Tee — Indigo', 2, 89, 'https://cdn.shopify.com/s/files/1/0819/7518/1554/files/mail1_430x.png?v=1781052228'),
  lineItem('Linen Shirt — Sand', 1, 159, 'https://cdn.shopify.com/s/files/1/0819/7518/1554/files/mail1_430x.png?v=1781052228'),
];

export const MOCK_CONTEXT: Record<string, unknown> = {
  shop: {
    name: 'TrueColors',
    url: 'https://truecolors.global',
    email: 'hello@truecolors.global',
    domain: 'truecolorsuae.myshopify.com',
    phone: '+971 4 000 0000',
    address: { summary: '42 Marina Walk, Suite 10, Dubai, UAE' },
    email_logo_url: 'https://cdn.shopify.com/s/files/1/0819/7518/1554/files/Frame_626401_430x.png?v=1781048209',
    email_logo_width: '160',
    email_accent_color: '#3a2e2b',
  },
  customer: {
    first_name: 'John',
    last_name: 'Doe',
    name: 'John Doe',
    email: 'john.doe@example.com',
  },
  order: {
    name: '#1940',
    order_name: '#1940',
    number: 1940,
    email: 'john.doe@example.com',
    customer: { first_name: 'John', last_name: 'Doe', name: 'John Doe' },
    line_items: lineItems,
    subtotal_price: money(337),
    total_price: money(352),
    total_tax: money(15),
    shipping_price: money(0),
    total_discounts: money(0),
    financial_status: 'paid',
    fulfillment_status: 'fulfilled',
    shipping_address: address('John Doe'),
    billing_address: address('John Doe Sr.'),
    order_status_url: 'https://truecolors.global/account/orders/1940',
  },
  order_name: '#1940',
  order_status_url: 'https://truecolors.global/account/orders/1940',
  email_title: 'TrueColors',
  email_body: 'Thank you for shopping with TrueColors.',
  line_items: lineItems,
  subtotal_price: money(337),
  total_price: money(352),
  shipping_price: money(0),
  fulfillment: {
    item_count: lineItems.length,
    tracking_company: 'Aramex',
    tracking_number: '9405511202508520300483',
    tracking_url: 'https://www.aramex.com/track/results?ShipmentNumber=9405511202508520300483',
    fulfillment_status: 'fulfilled',
  },
  item_count: lineItems.length,
  fulfillment_status: 'fulfilled',
  shipping_carrier: 'Aramex',
  tracking_number: '9405511202508520300483',
  shipping_address: address('John Doe'),
  billing_address: address('John Doe Sr.'),
  transactions: [{ kind: 'sale', amount: money(352), gateway: 'Credit card' }],
  url: 'https://truecolors.global/checkouts/ac/abcde/recover',
};
