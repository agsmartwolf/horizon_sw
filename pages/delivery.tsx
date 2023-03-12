import { withMainLayout } from 'lib/utils/fetch_decorators';
import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import getGQLClient from '../lib/graphql/client';
import { fetchPageData } from '../lib/rest/fetchStoreData';
import type { EditorPageOutput } from '../types/editor';
import type { PageProps, ServerSideProps } from '../types/shared/pages';
import type { PageSection } from '../lib/editor/sections';
import { denullifyArray } from '../lib/utils/denullify';
import { mapSectionProps } from '../lib/editor/sections';
import React from 'react';
import InfoAccordion from '../components/molecules/InfoAccordion';
import type { PanelTextProps } from '../components/atoms/Panel';

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
  const deliveryPage = contentPages?.results?.find(page => {
    if (page && page.slug === 'delivery') {
      return page;
    }
  });

  if (!deliveryPage?.published) {
    return {
      notFound: true,
    };
  }

  const editorData = (await fetchPageData(
    deliveryPage.slug as string,
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

const AboutPage: NextPage<ServerSideProps<typeof getStaticProps>> = ({
  title,
  sections,
}) => {
  return (
    <article className="min-h-screen">
      <Head>
        <title>{title}</title>
      </Head>

      <section className="h-full lg:min-h-[calc(100vh-90px)] mb-[40px] container mx-auto py-8 lg: py-12 px-4">
        {(sections[0]?.panels as PanelTextProps[])?.map(p => (
          <InfoAccordion
            className="mb-12 text-left"
            key={p.id}
            content={p?.description ?? ''}
            label={p.heading ?? ''}
            accordionStyle="secondary"
          />
        ))}
      </section>

      <section className={'relative'}></section>
    </article>
  );
};

export default AboutPage;
