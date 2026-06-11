import { LiquidVariable } from '../types';

// Full Shopify notification Liquid variable set, grouped by category. Click a
// tag in the Variable Vault to insert it into the active editor field.
export const LIQUID_VARIABLES: LiquidVariable[] = [
  // ---- Customer ----
  { category: 'Customer', tag: '{{ customer.first_name }}', description: 'Customer first name', placeholder: 'John' },
  { category: 'Customer', tag: '{{ customer.last_name }}', description: 'Customer last name', placeholder: 'Doe' },
  { category: 'Customer', tag: '{{ customer.name }}', description: 'Customer full name', placeholder: 'John Doe' },
  { category: 'Customer', tag: '{{ customer.email }}', description: 'Customer email address', placeholder: 'john@example.com' },
  { category: 'Customer', tag: '{{ customer.phone }}', description: 'Customer phone number', placeholder: '+971 4 000 0000' },
  { category: 'Customer', tag: '{{ customer.orders_count }}', description: 'Total number of orders placed', placeholder: '3' },
  { category: 'Customer', tag: '{{ customer.total_spent | money }}', description: 'Lifetime spend', placeholder: 'AED 1,240.00' },

  // ---- Order ----
  { category: 'Order', tag: '{{ order.name }}', description: 'Order name (e.g. #1940)', placeholder: '#1940' },
  { category: 'Order', tag: '{{ order.order_number }}', description: 'Numeric order number', placeholder: '1940' },
  { category: 'Order', tag: '{{ order.email }}', description: 'Email on the order', placeholder: 'john@example.com' },
  { category: 'Order', tag: '{{ order.created_at | date: "%B %d, %Y" }}', description: 'Order creation date', placeholder: 'June 11, 2026' },
  { category: 'Order', tag: '{{ order.subtotal_price | money }}', description: 'Subtotal before tax/shipping', placeholder: 'AED 337.00' },
  { category: 'Order', tag: '{{ order.total_tax | money }}', description: 'Total tax', placeholder: 'AED 15.00' },
  { category: 'Order', tag: '{{ order.shipping_price | money }}', description: 'Shipping cost', placeholder: 'AED 0.00' },
  { category: 'Order', tag: '{{ order.total_discounts | money }}', description: 'Total discount amount', placeholder: 'AED 0.00' },
  { category: 'Order', tag: '{{ order.total_price | money }}', description: 'Grand total', placeholder: 'AED 352.00' },
  { category: 'Order', tag: '{{ order.financial_status }}', description: 'Payment status', placeholder: 'paid' },
  { category: 'Order', tag: '{{ order.fulfillment_status }}', description: 'Fulfillment status', placeholder: 'fulfilled' },
  { category: 'Order', tag: '{{ order_status_url }}', description: 'Link to the order status page', placeholder: 'https://…/orders/1940' },
  { category: 'Order', tag: '{{ order.note }}', description: 'Order note', placeholder: 'Leave at door' },
  { category: 'Order', tag: '{{ order.po_number }}', description: 'Purchase order number (B2B)', placeholder: 'PO-4821' },

  // ---- Line items ----
  { category: 'Line Items', tag: '{% for line in order.line_items %}', description: 'Loop over each order line item', placeholder: 'for loop' },
  { category: 'Line Items', tag: '{{ line.title }}', description: 'Line item title', placeholder: 'Classic Tee' },
  { category: 'Line Items', tag: '{{ line.quantity }}', description: 'Quantity ordered', placeholder: '2' },
  { category: 'Line Items', tag: '{{ line.variant_title }}', description: 'Variant (size/color)', placeholder: 'Indigo / M' },
  { category: 'Line Items', tag: '{{ line.final_price | money }}', description: 'Unit price after discounts', placeholder: 'AED 89.00' },
  { category: 'Line Items', tag: '{{ line.final_line_price | money }}', description: 'Line total (qty × price)', placeholder: 'AED 178.00' },
  { category: 'Line Items', tag: '{{ line.sku }}', description: 'SKU', placeholder: 'TC-1024' },
  { category: 'Line Items', tag: '{{ line.product.title }}', description: 'Parent product title', placeholder: 'Classic Tee' },
  { category: 'Line Items', tag: '{% endfor %}', description: 'Close the loop', placeholder: 'endfor' },

  // ---- Addresses ----
  { category: 'Addresses', tag: '{{ order.shipping_address.name }}', description: 'Shipping recipient name', placeholder: 'John Doe' },
  { category: 'Addresses', tag: '{{ order.shipping_address.address1 }}', description: 'Shipping street line 1', placeholder: '42 Marina Walk' },
  { category: 'Addresses', tag: '{{ order.shipping_address.city }}', description: 'Shipping city', placeholder: 'Dubai' },
  { category: 'Addresses', tag: '{{ order.shipping_address.country }}', description: 'Shipping country', placeholder: 'United Arab Emirates' },
  { category: 'Addresses', tag: '{{ order.billing_address.name }}', description: 'Billing name', placeholder: 'John Doe Sr.' },
  { category: 'Addresses', tag: '{{ order.billing_address.address1 }}', description: 'Billing street line 1', placeholder: '42 Marina Walk' },

  // ---- Shop ----
  { category: 'Shop', tag: '{{ shop.name }}', description: 'Store name', placeholder: 'TrueColors' },
  { category: 'Shop', tag: '{{ shop.url }}', description: 'Storefront URL', placeholder: 'https://truecolors.global' },
  { category: 'Shop', tag: '{{ shop.email }}', description: 'Store contact email', placeholder: 'hello@truecolors.global' },
  { category: 'Shop', tag: '{{ shop.phone }}', description: 'Store phone', placeholder: '+971 4 000 0000' },
  { category: 'Shop', tag: '{{ shop.address.summary }}', description: 'Store address summary', placeholder: 'Dubai, UAE' },
  { category: 'Shop', tag: '{{ shop.email_logo_url }}', description: 'Notification logo URL', placeholder: 'https://cdn.shopify.com/…' },
  { category: 'Shop', tag: '{{ shop.email_accent_color }}', description: 'Notification accent color', placeholder: '#3a2e2b' },

  // ---- Fulfillment / Shipping ----
  { category: 'Fulfillment', tag: '{{ fulfillment.tracking_company }}', description: 'Carrier name', placeholder: 'Aramex' },
  { category: 'Fulfillment', tag: '{{ fulfillment.tracking_number }}', description: 'Tracking number', placeholder: '9405511202508520300483' },
  { category: 'Fulfillment', tag: '{{ fulfillment.tracking_url }}', description: 'Tracking link', placeholder: 'https://aramex.com/track/…' },
  { category: 'Fulfillment', tag: '{{ fulfillment.item_count }}', description: 'Items in this fulfillment', placeholder: '2' },
  { category: 'Fulfillment', tag: '{{ fulfillment_status }}', description: 'Fulfillment status', placeholder: 'fulfilled' },

  // ---- Transactions / Payment ----
  { category: 'Payment', tag: '{% for transaction in transactions %}', description: 'Loop over payment transactions', placeholder: 'for loop' },
  { category: 'Payment', tag: '{{ transaction.gateway }}', description: 'Payment gateway', placeholder: 'Credit card' },
  { category: 'Payment', tag: '{{ transaction.amount | money }}', description: 'Transaction amount', placeholder: 'AED 352.00' },
  { category: 'Payment', tag: '{{ next_amount_due | money }}', description: 'Outstanding balance', placeholder: 'AED 0.00' },

  // ---- Refund ----
  { category: 'Refund', tag: '{{ refund_amount | money }}', description: 'Refunded amount', placeholder: 'AED 89.00' },
  { category: 'Refund', tag: '{% for refund_line_item in refund_line_items %}', description: 'Loop over refunded items', placeholder: 'for loop' },

  // ---- Gift card ----
  { category: 'Gift Card', tag: '{{ gift_card.balance | money }}', description: 'Gift card balance', placeholder: 'AED 100.00' },
  { category: 'Gift Card', tag: '{{ gift_card.code }}', description: 'Gift card code', placeholder: 'XXXX-XXXX-XXXX' },
  { category: 'Gift Card', tag: '{{ gift_card.qr_image_url }}', description: 'Gift card QR image', placeholder: 'https://…' },

  // ---- Returns ----
  { category: 'Returns', tag: '{{ return.name }}', description: 'Return name', placeholder: '#1940-R1' },
  { category: 'Returns', tag: '{{ return.return_line_items }}', description: 'Returned line items', placeholder: 'array' },
  { category: 'Returns', tag: '{{ return_label_url }}', description: 'Return shipping label link', placeholder: 'https://…' },

  // ---- Date / utility ----
  { category: 'Utility', tag: "{{ 'now' | date: '%Y' }}", description: 'Current year', placeholder: '2026' },
  { category: 'Utility', tag: '{{ email_title }}', description: 'Notification title (set per template)', placeholder: 'Your order is on the way' },
  { category: 'Utility', tag: '{{ email_body }}', description: 'Notification body (set per template)', placeholder: 'Track your shipment…' },
];
