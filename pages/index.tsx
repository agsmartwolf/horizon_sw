// import PreviewPageSkeleton from 'components/organisms/PreviewPageSkeleton';
import { SPACING } from 'lib/globals/sizings';
import { getBestsellers, getBundles } from 'lib/shop/fetchingFunctions';
import { withMainLayout } from 'lib/utils/fetch_decorators';
import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { BUTTON_STYLE } from 'types/shared/button';
import FullWidthMedia from '../components/molecules/FullWidthMedia';
import {
  HORIZONTAL_ALIGNMENT,
  VERTICAL_ALIGNMENT,
} from '../types/shared/alignment';
// import {isNextPublicSwellEditor} from 'utils/editor';

const propsCallback: GetStaticProps<Record<string, unknown>> = async () => {
  const [bundles, bestsellers] = await Promise.all([
    getBundles(),
    getBestsellers(),
  ]);

  return {
    props: {
      bundles,
      bestsellers,
    },
  };
};

export const getStaticProps = withMainLayout(propsCallback);

const PreviewSwell: NextPage = () => {
  const {} =
  return (
    <>
      <Head>
        <title>Home - SW</title>
        <FullWidthMedia
          title={'<p>Make your dog more</p>'}
          description={
            '<h1>brighter</h1>'
          }
          links={[
            {
              id: '1',
              style: BUTTON_STYLE.SECONDARY,
              label: 'Explore  collections',
              link: '/collections',
            }
          ]}
          horizontal_background_alignment={HORIZONTAL_ALIGNMENT.CENTER}
          vertical_background_alignment={VERTICAL_ALIGNMENT.CENTER}
          horizontal_content_alignment={HORIZONTAL_ALIGNMENT.CENTER}
          vertical_content_alignment={VERTICAL_ALIGNMENT.CENTER}
          horizontal_spacing={SPACING.MEDIUM}
          vertical_spacing={SPACING.MEDIUM}
          background_image={{
            src: '/images/full-width-media-bg.jpg',
            alt: "Close-up of a Woman's face, with the skin on focus",
            width: 1350,
            height: 900,
          }}
          overlay_opacity={50}
        />
      </Head>
    </>
  );
};

export default PreviewSwell;
