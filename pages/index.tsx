// import PreviewPageSkeleton from 'components/organisms/PreviewPageSkeleton';
import {
  SECTION_PADDING_MAP,
  SECTION_VERTICAL_PADDING_MAP,
  SPACING,
} from 'lib/globals/sizings';
import { getBestsellers, getBundles } from 'lib/shop/fetchingFunctions';
import { withMainLayout } from 'lib/utils/fetch_decorators';
import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { BUTTON_STYLE, BUTTON_TYPE } from 'types/shared/button';
import FullWidthMedia from '../components/molecules/FullWidthMedia';
import {
  HORIZONTAL_ALIGNMENT,
  VERTICAL_ALIGNMENT,
} from '../types/shared/alignment';
import { useViewport } from '../hooks/useViewport';
import Swiper from 'components/atoms/Swiper';
import type { ServerSideProps } from '../types/shared/pages';
import ProductPreviewCard from '../components/atoms/ProductPreviewCard';
import type { SwellProduct } from 'lib/graphql/generated/sdk';
import type { PurchasableProductData } from '../types/shared/products';
import TextHeading from '../components/atoms/Text/TextHeading';
import Figure from '../components/atoms/Figure';
import ArrowLeft from 'assets/icons/arrow-left.svg';
import ArrowRight from 'assets/icons/arrow-right.svg';
import { useCallback, useRef } from 'react';
import type { SwiperRef } from 'swiper/react';
import cn from 'classnames';
import Button from '../components/atoms/Button';
import useI18n, { I18n, LocaleCode } from '../hooks/useI18n';
// import {isNextPublicSwellEditor} from 'utils/editor';
import 'swiper/css/autoplay';
import styles from 'styles/home.module.css';

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

const Quotes = ({ className }: { className: string }) => (
  <svg
    width="120"
    height="125"
    viewBox="0 0 120 125"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}>
    <path
      d="M41.0003 76.6968C44.0618 72.8554 47.4797 68.0416 50.9976 62.0514C55.8923 53.8084 62.4718 43.9768 70.9402 32.3006C72.1649 30.764 73.1854 29.4836 74.2579 28.6633C75.3304 27.8431 76.1988 27.2789 76.8631 26.9708C77.3233 26.9188 77.9876 26.6107 78.1917 26.3547C78.5999 25.8425 78.752 25.1262 78.392 24.0017C78.288 23.0813 77.7238 22.2129 76.9556 21.6006C75.6751 20.5801 73.7304 19.8676 71.3774 19.6673C66.8756 19.0107 62.5297 19.7347 58.3398 21.8392C55.2744 23.5837 51.8527 26.3006 48.279 29.7337C44.5011 33.423 41.1835 37.0602 37.8658 40.6975C34.8042 44.5389 32.559 47.3559 31.1303 49.1485C22.9661 59.3921 17.2068 70.2962 14.0566 81.6047C13.3962 84.0096 13.5521 85.3902 14.8326 86.4108C15.3448 86.819 16.0611 86.9711 17.0334 87.3273C24.4524 89.0526 29.7187 88.2247 33.0883 85.0476C36.2539 82.1267 38.9592 79.2577 41.0003 76.6968ZM71.2113 96.5874C74.477 92.49 78.0989 87.4201 81.821 81.1738C86.9717 73.1349 93.5512 63.3033 102.02 51.6271C103.244 50.0905 104.265 48.8101 105.337 47.9898C106.41 47.1695 107.278 46.6054 107.943 46.2973C108.403 46.2453 109.067 45.9372 109.475 45.4251C109.679 45.169 109.832 44.4527 109.471 43.3282C109.367 42.4078 108.803 41.5394 108.035 40.9271C106.755 39.9065 104.81 39.1941 102.457 38.9938C97.955 38.3372 93.6092 39.0612 89.1632 40.9616C83.0323 44.4506 74.0479 53.6217 62.2098 68.475C54.0456 78.7186 48.2863 89.6227 45.1361 100.931C44.4756 103.336 44.6316 104.717 45.9121 105.737C46.4242 106.145 47.1405 106.298 48.1129 106.654C55.5319 108.379 60.7981 107.551 63.7076 104.426C66.8731 101.505 69.3744 98.8922 71.2113 96.5874Z"
      fill="#88F98C"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.50641 80.3372C12.8474 68.3438 18.9283 56.8798 27.4364 46.2047L34.2699 37.6307L34.4127 37.4742C37.7084 33.8611 41.1032 30.1392 44.9788 26.3545L45.0065 26.3275C48.7338 22.7468 52.4723 19.7437 56.0034 17.7342L56.11 17.6736L56.2195 17.6185C61.2047 15.1145 66.4794 14.2078 71.9217 14.9739C74.8682 15.2464 77.7294 16.1777 79.8991 17.907C81.2979 19.0218 82.6158 20.7654 83.0129 22.9772C83.567 25.0224 83.4506 27.3342 81.8851 29.2985C81.0685 30.3231 80.0054 30.8409 79.6104 31.0242C79.314 31.1616 78.9478 31.3087 78.5331 31.4306C78.2417 31.6068 77.7819 31.9142 77.127 32.4151C76.6272 32.7973 76.0094 33.5199 74.7002 35.1609C66.3154 46.7256 59.8474 56.3992 55.0642 64.4534C51.4301 70.6404 47.8864 75.6347 44.6936 79.6406C42.4748 82.4245 39.6017 85.4627 36.3089 88.5025C31.2403 93.2653 23.9948 93.7955 15.9633 91.9278L15.6808 91.8621L15.4085 91.7623C15.2353 91.6989 15.065 91.6414 14.8556 91.5715L14.8031 91.554C14.6203 91.493 14.3734 91.4107 14.1355 91.3235C13.6252 91.1366 12.7461 90.7879 11.8885 90.1044C10.381 88.9029 9.35207 87.2624 9.046 85.2304C8.78145 83.4742 9.11492 81.7627 9.50179 80.3539L9.50641 80.3372ZM18.6147 82.8422C25.065 84.25 28.2206 83.1454 29.8479 81.611L29.8664 81.5936L29.885 81.5764C32.9159 78.7797 35.4471 76.0858 37.3064 73.753C40.2351 70.0783 43.5249 65.4484 46.9245 59.6596L46.9361 59.6399C51.9298 51.2302 58.5985 41.2721 67.1165 29.5275L67.1795 29.4407L67.2464 29.3568C67.3063 29.2816 67.3672 29.205 67.429 29.1273C68.4959 27.786 69.8411 26.0949 71.3883 24.9116C71.5696 24.7729 71.7518 24.636 71.9345 24.5017C71.6455 24.4477 71.3265 24.4034 70.9766 24.3736L70.8355 24.3616L70.6954 24.3411C67.2208 23.8343 63.8855 24.3642 60.5687 26.0056C57.9945 27.4884 54.9327 29.8926 51.5649 33.1265C47.9438 36.6636 44.7478 40.1612 41.4611 43.7643L34.8237 52.0923C27.0107 61.8953 21.576 72.2292 18.6147 82.8422ZM40.5859 99.6637C43.9269 87.6703 50.0078 76.2063 58.5159 65.5312C64.4926 58.0322 69.8082 51.8922 74.4524 47.1514C79.0444 42.464 83.1877 38.9275 86.8268 36.8566L87.0599 36.7239L87.3064 36.6185C92.3728 34.4529 97.5531 33.5334 103.001 34.3004C105.948 34.5729 108.809 35.5042 110.979 37.2335C112.376 38.3472 113.693 40.0885 114.091 42.2972C114.333 43.1775 114.448 44.0717 114.401 44.9509C114.355 45.83 114.118 47.178 113.169 48.3689C112.215 49.5649 110.911 50.3632 109.622 50.7517C109.331 50.927 108.868 51.2355 108.206 51.7416C107.707 52.1238 107.089 52.8464 105.78 54.4874C97.4226 66.0137 90.9265 75.7196 85.8384 83.6583C82.0144 90.0685 78.2834 95.2919 74.9047 99.5313C72.8915 102.057 70.2451 104.813 67.0293 107.787C62.3108 112.711 54.8303 113.065 47.0428 111.254L46.7603 111.189L46.4879 111.089C46.3148 111.025 46.1445 110.968 45.935 110.898L45.8827 110.88C45.6999 110.82 45.4529 110.737 45.2149 110.65C44.7047 110.463 43.8256 110.114 42.968 109.431C41.4604 108.229 40.4315 106.589 40.1254 104.557C39.8609 102.801 40.1944 101.089 40.5813 99.6804L40.5859 99.6637ZM49.6942 102.169C56.3051 103.612 59.169 102.369 60.2504 101.208L60.3725 101.076L60.5043 100.955C63.5659 98.1298 65.8815 95.6962 67.5174 93.6436C70.6584 89.7027 74.157 84.808 77.7632 78.7561L77.8024 78.6902L77.8438 78.6257C83.0384 70.5183 89.6689 60.611 98.196 48.854L98.2589 48.7672L98.3258 48.6833C98.3858 48.608 98.4467 48.5315 98.5085 48.4537C99.5753 47.1125 100.921 45.4214 102.468 44.2381C102.649 44.0994 102.831 43.9625 103.014 43.8282C102.725 43.7741 102.406 43.7299 102.056 43.7001L101.915 43.6881L101.775 43.6676C98.3478 43.1678 94.9574 43.6644 91.2722 45.1981C88.8015 46.6539 85.4611 49.4128 81.2004 53.762C76.8602 58.1924 71.7645 64.0646 65.9031 71.4188C58.0902 81.2218 52.6554 91.5557 49.6942 102.169Z"
      fill="#88F98C"
    />
  </svg>
);

const homeText = (i18n: I18n<LocaleCode>) => ({
  aboutCaption: i18n('home.about.caption'),
  aboutButton: i18n('home.about.button'),
  bestsellers: i18n('home.bestsellers'),
  heroBlock: [
    {
      title: i18n('home.hero.first.title'),
      descriptions: i18n('home.hero.first.descriptions'),
      explore: i18n('home.hero.first.explore'),
    },
    {
      title: i18n('home.hero.second.title'),
      descriptions: i18n('home.hero.second.descriptions'),
      explore: i18n('home.hero.second.explore'),
    },
    {
      title: i18n('home.hero.third.title'),
      descriptions: i18n('home.hero.third.descriptions'),
      explore: i18n('home.hero.third.explore'),
    },
  ],
});

const HERO_IMAGES = [
  {
    mobile: {
      src: '/images/landing/mobile/hero/1.jpeg',
      alt: '',
      width: 390,
      height: 723,
      style: { width: '100vw', height: 'auto' },
    },
    desktop: {
      src: '/images/landing/desktop/hero/1.jpeg',
      alt: '',
      width: 1439,
      height: 937,
      style: { width: '100vw', height: 'auto' },
    },
  },
  {
    mobile: {
      src: '/images/landing/mobile/hero/2.jpeg',
      alt: '',
      width: 390,
      height: 723,
      style: { width: '100vw', height: 'auto' },
    },
    desktop: {
      src: '/images/landing/desktop/hero/2.jpeg',
      alt: '',
      width: 1439,
      height: 937,
      style: { width: '100vw', height: 'auto' },
    },
  },
  {
    mobile: {
      src: '/images/landing/mobile/hero/3.jpeg',
      alt: '',
      width: 390,
      height: 723,
      style: { width: '100vw', height: 'auto' },
    },
    desktop: {
      src: '/images/landing/desktop/hero/3.jpeg',
      alt: '',
      width: 1439,
      height: 937,
      style: { width: '100vw', height: 'auto' },
    },
  },
];

const Home: NextPage<ServerSideProps<typeof getStaticProps>> = ({
  bestsellers,
}) => {
  const i18n = useI18n();
  const text = homeText(i18n);
  const { isMobile } = useViewport();
  const swiperRef = useRef<SwiperRef | null>(null);
  const handlePrev = useCallback(() => {
    if (!swiperRef.current) return;
    swiperRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!swiperRef.current) return;
    swiperRef.current.swiper.slideNext();
  }, []);
  return (
    <article>
      <Head>
        <title>Home - SW</title>
      </Head>
      <div
        className={cn(
          'bg-[#000000] overflow-hidden relative',
          'min-h-[calc(100vh-60px)] sm:h-[calc(100vh-90px)] sm:min-h-[calc(100vh-90px)]',
        )}>
        <Swiper
          className={`pb-0 md:pb-0 lg:pb-0 md:py-0 lg:py-0 ${styles.swiperContainer}`}
          effectsEnabled={false}
          autoplay={{
            delay: 4500,
          }}
          loop
          slidesPerView={1}
          centeredSlides
          grabCursor
          effect="fade"
          fadeEffect={{
            crossFade: true,
          }}>
          {getHeroImages(text.heroBlock)}
        </Swiper>
      </div>

      <div
        className={cn(
          {
            [SECTION_VERTICAL_PADDING_MAP[SPACING.MEDIUM]]: true,
            [SECTION_PADDING_MAP[SPACING.MEDIUM]]: !isMobile,
          },
          'overflow-hidden',
        )}>
        <div className={cn('relative')}>
          <ArrowLeft
            className={
              'hidden absolute left-4 lg:block w-6 bottom-0 cursor-pointer'
            }
            onClick={handlePrev}
          />
          <div className={'flex justify-center mb-4 lg:mb-7'}>
            <div className={'relative select-none'}>
              <TextHeading
                content={text.bestsellers}
                rootEl={'h1'}
                className={'z-10 relative'}
              />
              <Quotes
                className={
                  'absolute -left-1/4 -top-2/3 w-20 lg:w-28 h-auto z-0'
                }
              />
            </div>
          </div>
          <ArrowRight
            className={
              'hidden absolute right-4 lg:block w-6 bottom-0 cursor-pointer'
            }
            onClick={handleNext}
          />
        </div>
        <Swiper
          effectsEnabled
          ref={swiperRef}
          slidesPerView={isMobile ? 1.5 : 3}
          centeredSlides
          spaceBetween={20}
          grabCursor
          initialSlide={isMobile ? 0 : 1}
          // navigation={{
          //   prevEl: navigationPrevRef.current,
          //   nextEl: navigationNextRef.current,
          // onBeforeInit={swiper => {
          //   swiper.params.navigation.prevEl = navigationPrevRef.current;
          //   swiper.params.navigation.nextEl = navigationNextRef.current;

          // verticalPadding={SPACING.NONE}
          // slideActiveClass={'swiper-slide-active'}
        >
          {(bestsellers as PurchasableProductData[]).map(product => (
            <ProductPreviewCard
              product={{ ...product, hasQuickAdd: false }}
              key={product.id}
            />
          ))}
        </Swiper>
      </div>

      <article className={cn('bg-black-100 select-none')}>
        <div className="relative">
          <Figure
            className={'flex-col-reverse relative'}
            captionClassName={cn(
              'text-white pt-15 md:pt-0 md:absolute right-0 bottom-16 md:w-1/2 flex flex-col text-center md:text-left',
              SECTION_PADDING_MAP[SPACING.MEDIUM],
            )}
            caption={text.aboutCaption}
            image={
              isMobile
                ? {
                    src: '/images/landing/mobile/graffiti.png',
                    width: 390,
                    height: 637,
                    alt: 'Yuki dog telling about store',
                    className: 'w-full aspect-[390/657]',
                  }
                : {
                    src: '/images/landing/desktop/graffiti.png',
                    width: 1440,
                    height: 766,
                    alt: 'Yuki dog telling about store',
                  }
            }>
            <Button
              className={'mt-6 w-full md:w-fit'}
              elType={BUTTON_TYPE.LINK}
              href={'/about'}
              buttonStyle={BUTTON_STYLE.SECONDARY}>
              {text.aboutButton}
            </Button>
          </Figure>
        </div>
      </article>
    </article>
  );
};

function getHeroImages(
  items: { title: string; descriptions: string; explore: string }[],
) {
  return items.map((item, index) => (
    <FullWidthMedia
      key={item.title}
      title={`<p class="max-w-[300px] sm:max-w-[unset] text-green-100 text-7xl md:text-[80px] uppercase font-extrabold sm:font-semibold mb-12 sm:whitespace-pre-line">${item.title}</p>`}
      links={[
        {
          id: '1',
          style: BUTTON_STYLE.SECONDARY,
          label: item.explore,
          link: '/products',
          className: 'absolute bottom-[80px] sm:static',
        },
      ]}
      horizontal_background_alignment={HORIZONTAL_ALIGNMENT.RIGHT}
      vertical_background_alignment={VERTICAL_ALIGNMENT.CENTER}
      horizontal_content_alignment={HORIZONTAL_ALIGNMENT.LEFT}
      vertical_content_alignment={VERTICAL_ALIGNMENT.CENTER}
      horizontal_spacing={SPACING.MEDIUM}
      vertical_spacing={SPACING.MEDIUM}
      imageClassname="ml-auto"
      background_image={HERO_IMAGES[index]}
      isImageAbsolute={true}
      textBlockClassname={''}
      // background_color={'#000000'}
      // overlay_opacity={0}
    />
  ));
}

export default Home;
