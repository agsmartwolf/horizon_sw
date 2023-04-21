import { getProductListingData } from 'lib/shop/fetchingFunctions';
import type { GetStaticProps, NextPage } from 'next';
import type { ProductsLayoutProps } from 'components/layouts/ProductsLayout';
import ProductsLayout from 'components/layouts/ProductsLayout';
import { withMainLayout } from 'lib/utils/fetch_decorators';
import SEO from '../../components/atoms/SEO';
import React from 'react';
import useLocaleStore from '../../stores/locale';
import useI18n from '../../hooks/useI18n';

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
  const i18n = useI18n();

  return (
    <div>
      <SEO
        title={i18n('products.meta.title')}
        description={i18n('products.meta.description')}
        locale={activeLocale?.code}
      />

      <ProductsLayout {...props} />
    </div>
  );
};

export default ProductsPage;
