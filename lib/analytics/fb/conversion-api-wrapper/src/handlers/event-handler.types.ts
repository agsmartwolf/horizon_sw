export type Arguments = {
  eventName: string;
  eventId: string;
  emails?: Array<string> | null;
  phones?: Array<string> | null;
  products: {
    sku: string;
    quantity: number;
  }[];
  value?: number;
  currency?: string;
  searchString?: string;
  userAgent: string;
  sourceUrl: string;
  testEventCode?: string;
};
