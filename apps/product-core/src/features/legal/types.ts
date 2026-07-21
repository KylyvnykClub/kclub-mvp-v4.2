export type LegalBlockParagraph = {
  type: 'paragraph';
  text: string;
};

export type LegalBlockList = {
  type: 'list';
  items: string[];
};

export type LegalBlock = LegalBlockParagraph | LegalBlockList;

export type LegalSection = {
  heading: string;
  blocks: LegalBlock[];
};

export type LegalDoc = {
  title: string;
  effectiveDate: string;
  version?: string;
  operatorLines?: string[];
  intro?: LegalBlock[];
  note?: string | string[];
  sections: LegalSection[];
};

export type LegalDocByLocale = Record<string, LegalDoc>;
