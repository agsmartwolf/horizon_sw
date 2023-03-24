import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useI18n, { I18n, LocaleCode } from '../../../hooks/useI18n';

export interface BreadcumbProps {
  className?: string;
  customText?: string;
  extraRoute?: {
    route: {
      title: string;
      href: string;
    };
    position: number;
  };
}

interface BreadcrumbRoute {
  title: string;
  href: string;
}

const breadcrumbsText = (i18n: I18n<LocaleCode>) => ({
  home: i18n('breadcrumbs.home'),
  categories: i18n('breadcrumbs.categories'),
  products: i18n('breadcrumbs.products'),
  harnesses: i18n('breadcrumbs.harnesses'),
  collars: i18n('breadcrumbs.collars'),
  toys: i18n('breadcrumbs.toys'),
  leashes: i18n('breadcrumbs.leashes'),
  clothes: i18n('breadcrumbs.clothes'),
  treats: i18n('breadcrumbs.treats'),
  allproducts: i18n('breadcrumbs.allproducts'),
});

const Breadcrumb: React.FC<BreadcumbProps> = ({
  className,
  customText,
  extraRoute,
}) => {
  const [routes, setRoutes] = useState<BreadcrumbRoute[]>([]);
  const router = useRouter();

  const i18n = useI18n();

  const text: Record<string, string> = breadcrumbsText(i18n);
  const homeLabel = text.home;

  useEffect(() => {
    if (!router) return;

    const linkPath = router.asPath
      // Remove the query parameters from the url
      .slice(
        0,
        router.asPath.indexOf('?') === -1
          ? undefined
          : router.asPath.indexOf('?'),
      )
      .split('/');
    linkPath.shift();

    const newRoutes = linkPath.map((title, i) => {
      return {
        title: title.replace('-', ' '),
        href: '/' + linkPath.slice(0, i + 1).join('/'),
      };
    });

    if (customText) {
      newRoutes[newRoutes.length - 1].title = customText;
    }

    if (extraRoute) {
      // newRoutes[
      //   newRoutes.length + extraRoute.position < 0
      //     ? extraRoute.position
      //     : -extraRoute.position
      // ] = extraRoute.route;
      // insert the extra route at the position specified
      if (extraRoute.position === 0) {
        newRoutes.push(extraRoute.route);
      } else {
        newRoutes.splice(
          newRoutes.length + extraRoute.position < 0
            ? extraRoute.position
            : -extraRoute.position,
          0,
          extraRoute.route,
        );
      }
    }

    setRoutes(newRoutes);
  }, [router, customText, extraRoute]);

  return (
    <nav
      aria-label="breadcrumbs"
      className={[
        'text-sm font-light capitalize tracking-wide text-gray-400',
        className,
      ].join(' ')}>
      <ol className="flex flex-wrap">
        <li>
          <Link href="/">{homeLabel}&nbsp;&gt;&nbsp;</Link>
        </li>
        {routes.map((route, i) => (
          <li key={i}>
            <Link href={route.href}>
              {text[route.title.trim().replaceAll(' ', '').toLowerCase()] ??
                route.title}
            </Link>
            {i !== routes.length - 1 && <span>&nbsp;&gt;&nbsp;</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
