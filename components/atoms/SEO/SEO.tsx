import Head from 'next/head';
import React, { FC, Fragment, ReactNode } from 'react';
import config from 'config/seo.json';
import type { MandatoryImageProps } from '../../../types/global';

const storeUrl = process.env.NEXT_PUBLIC_STORE_URL;
const storeBaseUrl = storeUrl ? `https://${storeUrl}` : null;

interface OgImage {
  url?: string;
  width?: string;
  height?: string;
  alt?: string;
}

interface Props {
  title?: string;
  description?: string;
  robots?: string;
  openGraph?: {
    title?: string;
    type?: string;
    locale?: string;
    description?: string;
    site_name?: string;
    url?: string;
    images?: OgImage[];
  };
  children?: ReactNode;
  locale?: string;
  image?: MandatoryImageProps;
}

const ogImage = ({ url, width, height, alt }: OgImage, index: number) => {
  // generate full URL for OG image url with store base URL
  const imgUrl = storeBaseUrl ? new URL(url!, storeBaseUrl).toString() : url;
  return (
    <Fragment key={`og:image:${index}`}>
      <meta
        key={`og:image:url:${index}`}
        property="og:image"
        content={imgUrl}
      />
      <meta
        key={`og:image:width:${index}`}
        property="og:image:width"
        content={width}
      />
      <meta
        key={`og:image:height:${index}`}
        property="og:image:height"
        content={height}
      />
      <meta
        key={`og:image:alt:${index}`}
        property="og:image:alt"
        content={alt}
      />
    </Fragment>
  );
};

const SEO: FC<Props> = ({
  title,
  description,
  openGraph,
  robots,
  children,
  locale = '',
  image,
}) => {
  /**
   * @see https://nextjs.org/docs/api-reference/next/head
   *
   * meta or any other elements need to be contained as direct children of the Head element,
   * or wrapped into maximum one level of <React.Fragment> or arrays
   * otherwise the tags won't be correctly picked up on client-side navigations.
   *
   * The `key` property makes the tag is only rendered once,
   */
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        key="og:type"
        property="og:type"
        content={openGraph?.type ?? config.openGraph.type}
      />
      <meta key="og:title" property="og:title" content={title} />
      <meta
        key="og:description"
        property="og:description"
        content={description}
      />
      <meta
        key="og:site_name"
        property="og:site_name"
        content={openGraph?.site_name ?? config.openGraph.site_name}
      />
      <meta
        key="og:url"
        property="og:url"
        content={openGraph?.url ?? config.openGraph.url}></meta>
      {openGraph?.locale && (
        <meta key="og:locale" property="og:locale" content={locale} />
      )}
      {image?.src
        ? ogImage(
            {
              ...image,
              url: image.src as string,
              width: image.width.toString(),
              height: image.height.toString(),
            },
            0,
          )
        : openGraph?.images?.length
        ? openGraph.images.map((img, index) => ogImage(img, index))
        : ogImage(config.openGraph.images[0], 0)}
      {config.twitter.cardType && (
        <meta
          key="twitter:card"
          name="twitter:card"
          content={config.twitter.cardType}
        />
      )}
      {config.twitter.site && (
        <meta
          key="twitter:site"
          name="twitter:site"
          content={config.twitter.site}
        />
      )}
      {config.twitter.handle && (
        <meta
          key="twitter:creator"
          name="twitter:creator"
          content={config.twitter.handle}
        />
      )}
      <meta key="robots" name="robots" content={robots ?? 'index,follow'} />
      <meta
        key="googlebot"
        name="googlebot"
        content={robots ?? 'index,follow'}></meta>
      {children}
    </Head>
  );
};

SEO.displayName = 'SEO';

export default SEO;
