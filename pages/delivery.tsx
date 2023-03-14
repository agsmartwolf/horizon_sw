import { withMainLayout } from 'lib/utils/fetch_decorators';
import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import getGQLClient from '../lib/graphql/client';
import { fetchPageData } from '../lib/rest/fetchStoreData';
import type { EditorPageOutput } from '../types/editor';
import type { PageProps, ServerSideProps } from '../types/shared/pages';
import type { PageSection } from '../lib/editor/sections';
import {
  mapSectionProps,
  PAGE_SECTION_COMPONENT,
} from '../lib/editor/sections';
import { denullifyArray } from '../lib/utils/denullify';
import React, { ReactElement } from 'react';
import InfoAccordion from '../components/molecules/InfoAccordion';
import type { PanelTextProps } from '../components/atoms/Panel';
import usePageSections from '../hooks/usePageSections';
import Divider from '../components/atoms/Divider';
import { formatRowHtmlFontStyles } from '../lib/utils/format';
import Button from '../components/atoms/Button';
import { BUTTON_TYPE } from '../types/shared/button';

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

const DeliveryPage: NextPage<ServerSideProps<typeof getStaticProps>> = ({
  title,
  sections,
}) => {
  const panelsSection = sections?.find(
    s => s?.type === PAGE_SECTION_COMPONENT.MULTIPLE_PANELS,
  );

  const headingSectionsData = sections?.filter(
    s => s?.type === PAGE_SECTION_COMPONENT.HEADING_WITH_TEXT,
  );
  const headingSections = usePageSections(headingSectionsData as PageSection[]);
  return (
    <article className="">
      <Head>
        <title>{title}</title>
      </Head>

      <section className={`container mx-auto pt-10 px-4 lg:px-0`}>
        {React.cloneElement(headingSections[0] as ReactElement, {
          textClassName: 'grid grid-cols-12 mb-10',
          headingClassName: 'col-span-12 lg:col-span-3',
          descriptionClassName: 'col-span-12 lg:col-span-9',
        })}
      </section>
      <section className={`h-full bg-black py-8 lg:py-12 px-4 lg:px-0`}>
        <div className="container mx-auto">
          <div>
            {React.cloneElement(headingSections[1] as ReactElement, {
              textClassName: 'grid grid-cols-12 mb-10 text-white bg-black',
              headingClassName: 'col-span-12 lg:col-span-3 text-white',
              descriptionClassName:
                'col-span-12 lg:col-span-9 text-white bg-black',
            })}
            <div className="grid grid-cols-12">
              {(panelsSection?.panels as PanelTextProps[])?.map(p => (
                <div
                  key={p.id}
                  className={'col-span-12 lg:col-start-4 lg:col-span-7'}>
                  <Divider
                    className={'mt-10 mb-0'}
                    disableDefaultPadding
                    borderColor={'border-white'}
                  />
                  <InfoAccordion
                    className="text-left text-white"
                    key={p.id}
                    content={formatRowHtmlFontStyles(p?.description) ?? ''}
                    label={formatRowHtmlFontStyles(p.heading) ?? ''}
                    accordionStyle="default"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-12">
            <Button
              elType={BUTTON_TYPE.LINK}
              href={'/products'}
              className={'mt-10 col-span-12 lg:col-start-4 lg:col-span-3'}>
              Explore collections
            </Button>
          </div>
        </div>
      </section>
    </article>
  );
};

export default DeliveryPage;
