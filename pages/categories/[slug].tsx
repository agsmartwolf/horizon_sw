import Head from 'next/head';
import getGQLClient from 'lib/graphql/client';
import ProductsLayout, {
  ProductsLayoutProps,
} from 'components/layouts/ProductsLayout';
import { getProductListingData } from 'lib/shop/fetchingFunctions';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { denullifyArray } from 'lib/utils/denullify';
import { withMainLayout } from 'lib/utils/fetch_decorators';
import { mapCategory } from '../../lib/utils/products';
import type { SwellCategoryWithChildren } from '../../types/shared/products';
import SEO from 'components/atoms/SEO';
import { useRouter } from 'next/router';

interface CategoryPageProps extends ProductsLayoutProps {
  title: string;
  description: string;
  keywords: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const client = getGQLClient();

  const { data } = await client.getCategoryPaths();

  const paths = denullifyArray(
    data?.categories?.results?.map(category =>
      category?.slug
        ? {
            params: {
              slug: category.slug,
            },
          }
        : null,
    ),
  );

  return {
    paths,
    fallback: 'blocking',
  };
};

const propsCallback: GetStaticProps<CategoryPageProps> = async context => {
  const client = getGQLClient();
  const slug = context.params?.slug;

  if (!slug) return { notFound: true };

  // Get the current category and its products
  const currentCategory = await client
    .getCategory({
      slug: slug?.toString() ?? '',
      locale: context?.locale,
    })
    .then(response => response.data);

  const data = await getProductListingData(
    mapCategory(currentCategory.categoryBySlug as SwellCategoryWithChildren),
    context?.locale,
  );

  // If the category doesn't exist, return 404
  if (!currentCategory.categoryBySlug?.slug) {
    return { notFound: true };
  }

  const { locale } = context;

  return {
    props: {
      ...data,
      title: currentCategory.categoryBySlug.name ?? '',
      description:
        currentCategory.categoryBySlug.metaDescription ??
        currentCategory.categoryBySlug.description ??
        '',
      keywords: currentCategory.categoryBySlug.metaKeywords ?? '',
      ...(locale ? { locale } : {}),
    },
  };
};

export const getStaticProps = withMainLayout(propsCallback);

const CategoryPage: NextPage<CategoryPageProps> = ({
  description,
  keywords,
  title,
  ...props
}) => {
  const { locale } = useRouter();
  return (
    <div>
      <Head>
        <meta name="keywords" content={keywords} />
        <SEO title={title} description={description} locale={locale} />
      </Head>

      <ProductsLayout {...props} />
    </div>
  );
};
export default CategoryPage;
