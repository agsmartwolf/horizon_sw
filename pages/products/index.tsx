import { getProductListingData } from 'lib/shop/fetchingFunctions';
import type { GetStaticProps, NextPage } from 'next';
import type { ProductsLayoutProps } from 'components/layouts/ProductsLayout';
import ProductsLayout from 'components/layouts/ProductsLayout';
import { withMainLayout } from 'lib/utils/fetch_decorators';
import SEO from '../../components/atoms/SEO';
import React from 'react';
import useLocaleStore from '../../stores/locale';

const propsCallback: GetStaticProps<
  Omit<ProductsLayoutProps, 'products' | 'productCount'>
> = async context => {
  const { locale } = context;
  const data = await getProductListingData(undefined, locale);

  return {
    props: {
      ...data,
      ...(locale ? { locale } : {}),
    },
  };
};

export const getStaticProps = withMainLayout(propsCallback);

const ProductsPage: NextPage<ProductsLayoutProps> = props => {
  const activeLocale = useLocaleStore(state => state.activeLocale);

  return (
    <div>
      <SEO
        title={'Catalog'}
        description={'All products and categories'}
        locale={activeLocale?.code}
      />

      <ProductsLayout {...props} />
    </div>
  );
};

export default ProductsPage;
