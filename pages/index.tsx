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
import { useViewport } from "../hooks/useViewport";
import { ImageLayoutType } from "../lib/utils/image";
import Swiper from "../components/atoms/Swiper";
import type { ServerSideProps } from "../types/shared/pages";
import ProductPreviewCard from "../components/atoms/ProductPreviewCard";
import type { SwellProduct } from 'lib/graphql/generated/sdk';
import type { PurchasableProductData } from "../types/shared/products";
// import {isNextPublicSwellEditor} from 'utils/editor';

const propsCallback: GetStaticProps<Record<string, unknown>> = async () => {
    const [bundles, bestsellers] = await Promise.all([
        getBundles(),
        getBestsellers(),
    ]);

    return {
        props: {
            bundles,
            bestsellers: bestsellers as SwellProduct[],
        },
    };
};

export const getStaticProps = withMainLayout(propsCallback);

const Home: NextPage<ServerSideProps<typeof getStaticProps>> = ({ bestsellers }) => {
    const { isMobile } = useViewport()
    return (
        <article>
            <Head>
                <title>Home - SW</title>
            </Head>
            <div className={'bg-black-100'}>
                <FullWidthMedia
                    title={'<p class="uppercase text-xl md:text-2xl">Make your dog more</p>'}
                    description={
                        '<h1 class="text-green-100 text-9xl md:text-14xl uppercase font-semibold">brighter</h1>'
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
                    horizontal_spacing={SPACING.LARGE}
                    vertical_spacing={SPACING.MEDIUM}
                    background_image={isMobile ? {
                        src: '/images/landing/mobile/hero.png',
                        alt: "Close-up of a Woman's face, with the skin on focus",
                        width: 390,
                        height: 472,
                        objectFit: "contain",
                        layout: ImageLayoutType.RESPONSIVE
                    } : {
                        src: '/images/landing/desktop/hero.png',
                        alt: "Close-up of a Woman's face, with the skin on focus",
                        width: 1342,
                        height: 335,
                        // objectFit: "contain",
                        layout: ImageLayoutType.RESPONSIVE
                    }}
                    isImageAbsolute={false}
                    // background_color={"#171717"}
                    // overlay_opacity={100}
                />
            </div>

            <Swiper slidesPerView={isMobile ? 1.5 : 3}
                    centeredSlides
                    spaceBetween={20}
                    grabCursor
                    initialSlide={isMobile ? 0 : 1}
                    // slideActiveClass={'swiper-slide-active'}
            >
                {
                    (bestsellers as PurchasableProductData[]).map((product) => (
                        <ProductPreviewCard product={product} key={product.id}/>
                    ))
                }
            </Swiper>
        </article>
    );
};

export default Home;
