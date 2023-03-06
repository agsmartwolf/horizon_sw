import { withMainLayout } from 'lib/utils/fetch_decorators';
import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import getGQLClient from '../lib/graphql/client';
import { fetchPageData } from '../lib/rest/fetchStoreData';
import type { EditorImage, EditorPageOutput } from '../types/editor';
import type { PageProps, ServerSideProps } from '../types/shared/pages';
import type { PageSection } from '../lib/editor/sections';
import { denullifyArray } from '../lib/utils/denullify';
import { mapSectionProps } from '../lib/editor/sections';
import SafeImage from '../components/atoms/SafeImage';
import RichText from '../components/atoms/RichText';
import React from 'react';
import Figure from '../components/atoms/Figure';

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
  const aboutUsPage = contentPages?.results?.find(page => {
    if (page && page.slug === 'about') {
      return page;
    }
  });

  if (!aboutUsPage?.published) {
    return {
      notFound: true,
    };
  }

  const editorData = (await fetchPageData(
    aboutUsPage.slug as string,
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

      <section className="h-full text-green-100 bg-black-100 relative lg:min-h-[calc(100vh-90px)] mb-[40px]">
        <RichText
          content="FRiENDS"
          className="text-[228px] font-bold -ml-7 -top-[calc(50%-74px)] font-graphity lg:text-[800px] lg:-ml-14 absolute lg:-top-[150px] z-0"
          rootEl="p"
        />
        <SafeImage
          className="z-10 m-auto pt-14 block relative"
          width={1440}
          height={810}
          src="/images/about-us/hero.png"
          alt={'family with dog'}
        />
      </section>

      <section className={'relative'}>
        <div className={'absolute z-0'}>
          <SafeImage
            className="ml-auto mb-[40px]"
            src="/images/about-us/1-2.png"
            alt="white swiss shepherd dog"
            width={1143}
            height={958}
          />
          <SafeImage
            className="w-full"
            src="/images/about-us/2-4.png"
            alt="white swiss shepherd dog"
            width={1440}
            height={1339}
            style={{
              width: '100vw',
              height: 'auto',
            }}
          />
          <SafeImage
            className="w-full md:hidden"
            src="/images/about-us/3-1.png"
            alt="mobile img"
            width={1440}
            height={1339}
            style={{
              width: '100vw',
              height: 'auto',
            }}
          />
        </div>
        <div className="flex flex-col pl-[20px] lg:pl-[80px] pt-[40px] z-10 relative">
          {sections.map(s => (
            <Figure
              key={s.id}
              image={{
                src: (s.image as EditorImage)?.file?.url ?? '',
                alt: 'Skin',
                height: (s.image as EditorImage)?.file?.height ?? 0,
                width: (s.image as EditorImage)?.file?.width ?? 0,
                className: 'safe-aspect-square',
              }}
              caption={s.description as string}
              className={`bg-gray-200 p-[20px] lg:p-[60px] w-3/5 lg:w-2/5 mb-[40px] font-light text-sm`}
              captionClassName={'pt-0 lg:pt-14'}
              innerCaption
            />
          ))}
        </div>
      </section>
    </article>
  );
};

export default AboutPage;
