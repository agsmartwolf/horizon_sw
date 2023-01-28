import type { SwellProduct } from 'lib/graphql/generated/sdk';
import create from 'zustand';
import { devtools } from 'zustand/middleware';

interface ProductsState {
  products: SwellProduct[];
  updateProducts: (products: SwellProduct[]) => any;
}

const useProductsStore = create<ProductsState>(
  devtools(set => ({
    products: [],
    updateProducts: products => set(() => ({ products })),
  })),
);

export default useProductsStore;
