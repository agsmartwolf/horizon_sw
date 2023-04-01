import type { SwellProduct } from 'lib/graphql/generated/sdk';
import create from 'zustand';
import { devtools } from 'zustand/middleware';

interface ProductsState {
  products: SwellProduct[];
  isLoading: boolean;
  updateLoading: (isLoading: boolean) => any;
  updateProducts: (products: SwellProduct[]) => any;
}

const useProductsStore = create<ProductsState>(
  devtools(set => ({
    products: [],
    isLoading: false,
    updateLoading: isLoading => set(() => ({ isLoading })),
    updateProducts: products => set(() => ({ products })),
  })),
);

export default useProductsStore;
