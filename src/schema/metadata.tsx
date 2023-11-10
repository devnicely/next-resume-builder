export type CustomCSS = {
    value: string;
    visible: boolean;
  };
  
  export type PageConfig = {
    format: 'A4' | 'Letter';
  };
  
  export type ThemeConfig = {
    text: string;
    primary: string;
    background: string;
  };
  
  export type TypeCategory = 'section' | 'subtitle' | 'text';
  export type TypeProperty = 'family' | 'size';
  
  export type Typography = {
    family: Record<TypeCategory, string>;
    size: Record<TypeCategory, number>;
  };
  
  export type DateConfig = {
    format: string;
  };

  export type Spacing = {
    
  }
  
  export type Metadata = {
    css: CustomCSS;
    locale: string;
    date: DateConfig;
    layout: string[][][]; // page.column.section
    template: string;
    theme: ThemeConfig;
    page?: PageConfig;
    typography: Typography;
    spacing: Record<TypeCategory, number>;
    ratio: number,
  };
  