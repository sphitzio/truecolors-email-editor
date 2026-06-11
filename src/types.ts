// A real TrueColors notification template, listed in public/templates/index.json.
export interface TemplateMeta {
  id: string;
  name: string;
  file: string;
}

// Editable brand-header fields merged into every template's shop-name__cell.
export interface BrandState {
  logoUrl: string;
  logoWidth: number;
  storeName: string;
}

export interface LiquidVariable {
  category: string;
  tag: string;
  description: string;
  placeholder: string;
}
