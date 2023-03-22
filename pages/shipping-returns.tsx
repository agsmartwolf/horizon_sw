import { withMainLayout } from 'lib/utils/fetch_decorators';
import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import getGQLClient from '../lib/graphql/client';
import { fetchPageData } from '../lib/rest/fetchStoreData';
import type { EditorPageOutput } from '../types/editor';
import { mapSectionProps, PageSection } from '../lib/editor/sections';
import { denullifyArray } from '../lib/utils/denullify';
import type { PageProps, ServerSideProps } from '../types/shared/pages';
import usePageSections from '../hooks/usePageSections';
import cn from 'classnames';
import {
  SECTION_PADDING_MAP,
  SECTION_VERTICAL_PADDING_MAP,
  SPACING,
} from '../lib/globals/sizings';

interface StaticPageProps extends PageProps {
  sections: PageSection[];
}

const propsCallback: GetStaticProps<StaticPageProps> = async context => {
  const { locale } = context;
  const client = getGQLClient();
  const {
    data: { contentPages },
  } = await client.getContentPages();

  const {
    data: { storeSettings },
  } = await client.getStoreSettings();

  const defaultLocale = storeSettings?.store?.locale;
  const shippingReturnsPage = contentPages?.results?.find(page => {
    if (page && page.slug === 'shipping-returns') {
      return page;
    }
  });

  if (!shippingReturnsPage?.published) {
    return {
      notFound: true,
    };
  }

  const editorData = (await fetchPageData(
    shippingReturnsPage.slug as string,
    locale ?? defaultLocale ?? '',
  )) as EditorPageOutput;

  const mappedSections = await mapSectionProps(
    denullifyArray(editorData?.sections),
  );

  const props: StaticPageProps = {
    title: editorData?.name ?? '',
    metaTitle: editorData?.meta_title ?? '',
    metaDescription: editorData?.meta_description ?? '',
    sections: mappedSections,
  };

  return {
    props: {
      ...(locale ? { locale } : {}),
      ...props,
    },
  };
};

export const getStaticProps = withMainLayout(propsCallback);

const ShippingReturnsPage: NextPage<ServerSideProps<typeof getStaticProps>> = ({
  title,
  sections,
}) => {
  const Sections = usePageSections(sections);

  const classes = cn(
    'min-h-screen container m-auto',
    SECTION_PADDING_MAP[SPACING.MEDIUM],
    SECTION_VERTICAL_PADDING_MAP[SPACING.MEDIUM],
  );
  return (
    <article className={classes}>
      <Head>
        <title>{title}</title>
      </Head>
      {Sections}
    </article>
  );
};

export default ShippingReturnsPage;
