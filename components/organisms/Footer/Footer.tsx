import React, { useState, useCallback, ComponentType } from 'react';
import dynamic from 'next/dynamic';
import ActionInput from 'components/molecules/ActionInput';
import LinksAccordion from 'components/atoms/LinksAccordion';
import { SECTION_PADDING_MAP, SPACING } from 'lib/globals/sizings';
import type { MandatoryImageProps } from 'types/global';
import type { MenuItem } from 'components/organisms/Header';
import type { SocialLinks, SOCIALS } from 'types/shared/socials';
import type { EditorArray } from 'types/editor';
import { Link } from '../../atoms/NavLink';
import Logo from '../../atoms/Logo';
import TextBody from '../../atoms/Text/TextBody';
import { useRouter } from 'next/navigation';

type ReactSVGComponent = ComponentType<React.SVGProps<SVGSVGElement>>;

const TwitterIcon = dynamic<ReactSVGComponent>(
  () => import('assets/icons/twitter.svg'),
) as (props: any) => JSX.Element;
const FacebookIcon = dynamic<ReactSVGComponent>(
  () => import('assets/icons/facebook.svg'),
) as (props: any) => JSX.Element;
const InstagramIcon = dynamic<ReactSVGComponent>(
  () => import('assets/icons/instagram.svg'),
) as (props: any) => JSX.Element;
const TiktokIcon = dynamic<ReactSVGComponent>(
  () => import('assets/icons/tiktok.svg'),
) as (props: any) => JSX.Element;
const PinterestIcon = dynamic<ReactSVGComponent>(
  () => import('assets/icons/pinterest.svg'),
) as (props: any) => JSX.Element;
const YoutubeIcon = dynamic<ReactSVGComponent>(
  () => import('assets/icons/youtube.svg'),
) as (props: any) => JSX.Element;
const VimeoIcon = dynamic<ReactSVGComponent>(
  () => import('assets/icons/vimeo.svg'),
) as (props: any) => JSX.Element;
const WhatsappIcon = dynamic<ReactSVGComponent>(
  () => import('assets/icons/whatsapp.svg'),
) as (props: any) => JSX.Element;

export interface FooterLink {
  href: string;
  title: string;
}

export interface PaymentMethod {
  name: string;
  icon: MandatoryImageProps;
}

export interface Column {
  heading?: string;
  items: MenuItem[];
}

const SOCIAL_ICONS_MAP = {
  twitter: <TwitterIcon height={20} width={20} className="w-8 h-auto" />,
  facebook: <FacebookIcon height={20} width={20} className="w-8 h-auto" />,
  instagram: <InstagramIcon height={20} width={20} className="w-10 h-auto" />,
  tiktok: <TiktokIcon height={20} width={20} className="w-8 h-auto" />,
  pinterest: <PinterestIcon height={20} width={20} className="w-8 h-auto" />,
  youtube: <YoutubeIcon height={20} width={20} className="w-8 h-auto" />,
  vimeo: <VimeoIcon height={20} width={20} className="w-8 h-auto" />,
  whatsapp: <WhatsappIcon height={20} width={20} className="w-8 h-auto" />,
};

export interface FooterProps {
  menu?: Column[];
  secondaryMenu?: EditorArray<MenuItem>;
  showSocials?: boolean;
  socialLinks?: SocialLinks;
  showPayments?: boolean;
  copyrightText?: string;
  showNewsletter?: boolean;
  newsletterTitle?: string;
  newsletterPlaceholder?: string;
  horizontalPadding?: SPACING;
  paymentMethods?: PaymentMethod[];
  logo:
    | (MandatoryImageProps & {
        contentType: string;
      })
    | null;
  logoHeight: {
    mobile: number;
    desktop: number;
  } | null;
  storeName?: string;
}

const Footer: React.FC<FooterProps> = ({
  menu,
  secondaryMenu,
  showSocials = true,
  socialLinks,
  showNewsletter = true,
  newsletterPlaceholder,
  horizontalPadding,
  logo,
  logoHeight,
  storeName = '',
}) => {
  const router = useRouter();

  const [newsLetterError, setNewsLetterError] = useState('');

  const onChange = useCallback(() => setNewsLetterError(''), []);
  const onAction = useCallback(
    (value: string) => {
      if (!value) {
        setNewsLetterError('Please enter your email');
        return;
      }

      // Validate if email is valid
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
        setNewsLetterError('Please enter a valid email address');
        return;
      }
      // TODO: Handle submit (email: string) => void;
      router.push(`/account/sign-up?email=${value}`);
      console.log(value);
    },
    [router],
  );

  return (
    <footer
      className={`${
        SECTION_PADDING_MAP[horizontalPadding ?? SPACING.MEDIUM]
      } bg-black-200 pb-24 lg:pb-6 pt-14`}>
      {/* Newsletter */}
      <div className="flex justify-between items-center lg:hidden">
        <Link link="/" className={''}>
          <Logo logo={logo} logoHeight={logoHeight} storeName={storeName} />
        </Link>
        {/* Social links */}
        {showSocials && typeof socialLinks === 'object' && (
          <div className="flex gap-4">
            {Object.entries(socialLinks).map(
              ([key, value]) =>
                value.show &&
                !!value.url && (
                  <Link
                    key={key}
                    link={value.url || '#'}
                    className="leading-none text-white">
                    {SOCIAL_ICONS_MAP[key as SOCIALS]}
                  </Link>
                ),
            )}
          </div>
        )}
      </div>
      {showNewsletter && (
        <div className="mt-8 lg:mt-0 lg:max-w-4xl mx-auto lg:mb-16">
          {/*<h3*/}
          {/*  className="font-headings text-2xl font-semibold text-white"*/}
          {/*  dangerouslySetInnerHTML={{*/}
          {/*    __html:*/}
          {/*      newsletterTitle ??*/}
          {/*      'Subscribe to the newsletter. \n' +*/}
          {/*        'Find out about the promotions first',*/}
          {/*  }}></h3>*/}

          <div className="mt-4">
            <ActionInput
              id="email-newsletter"
              type="email"
              name="email"
              aria-label={newsletterPlaceholder}
              placeholder={newsletterPlaceholder}
              onChange={onChange}
              errorLabel={newsLetterError}
              onAction={onAction}
              noValidate
              small
              arrowHidden
              submitLabel="Subscribe"
            />
          </div>
        </div>
      )}
      <div className="lg:flex lg:gap-[88px]">
        {/* Footer main content */}
        {(!!menu?.length || showNewsletter) && (
          <div className="lg:flex lg:justify-between">
            {/* Footer links columns */}
            <MobileColumns columns={menu} />
            <DesktopColumns columns={menu} />
          </div>
        )}

        {/* Second footer section */}
        {/*<div className="mt-10 flex flex-col items-center gap-6 lg:mt-18 lg:flex-row lg:justify-end lg:gap-0">*/}
        {/* Payment methods, temporarily disabled */}
        {/* {false && !!paymentMethods?.length && (
          <div className="flex gap-2 lg:gap-4">
            {paymentMethods.map((paymentMethod) => (
              <Image
                key={paymentMethod.name}
                title={paymentMethod.name}
                {...paymentMethod.icon}
                alt={paymentMethod.icon.alt}
              />
            ))}
          </div>
        )} */}
        {/*</div>*/}

        {/* Third footer section */}
        <div className="mt-6 lg:flex">
          {!!secondaryMenu?.length && (
            <div className="flex flex-col gap-2">
              {secondaryMenu.map(item => (
                <Link
                  key={item.id}
                  link={item.link || '#'}
                  className="whitespace-nowrap text-center text-2xs text-gray-400 lg:text-sm"
                  label={item.label}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <TextBody
        content={`©${new Date().getFullYear()} Smart Wolf. All rights reserved.`}
        className={'text-white pb-10 pt-32'}
      />
    </footer>
  );
};

const MobileColumns: React.FC<{ columns?: Column[] }> = ({ columns }) => (
  <div className="flex flex-col gap-4 lg:hidden">
    {columns?.map((column, i) => (
      <LinksAccordion
        key={column.heading ?? `column-${i}`}
        title={column.heading ?? ``}
        items={column.items.map(item => ({
          href: item.link,
          title: item.label,
        }))}
        className="border-b border-dividers pb-4"
        panelClassname="ml-0"
      />
    ))}
  </div>
);

const DesktopColumns: React.FC<{ columns?: Column[] }> = ({ columns }) =>
  columns?.length ? (
    <div className="hidden flex-row gap-[88px] lg:flex">
      {columns.map((column, i) => (
        <div
          key={column.heading ?? `column-${i}`}
          className="flex flex-col border-b border-dividers pb-4 lg:border-b-0 lg:p-0">
          <h3 className="font-headings text-sm font-semibold uppercase text-white">
            {column.heading}
          </h3>
          <ul className="mt-6 flex flex-col gap-2">
            {column.items.map(item => (
              <Link
                key={item.label}
                className="text-sm text-white"
                link={item.link}
                label={item.label}
              />
            ))}
          </ul>
        </div>
      ))}
    </div>
  ) : null;

export default Footer;
