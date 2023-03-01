import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useI18n from '../../../hooks/useI18n';

export interface BreadcumbProps {
  className?: string;
  customText?: string;
}

interface BreadcrumbRoute {
  title: string;
  href: string;
}

const Breadcrumb: React.FC<BreadcumbProps> = ({ className, customText }) => {
  const [routes, setRoutes] = useState<BreadcrumbRoute[]>([]);
  const router = useRouter();

  const i18n = useI18n();

  const homeLabel = i18n('home.home') || 'Home';

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

    setRoutes(newRoutes);
  }, [router, customText]);

  return (
    <nav
      aria-label="breadcrumbs"
      className={[
        'text-sm font-light capitalize tracking-wide text-gray-400',
        className,
      ].join(' ')}>
      <ol className="flex">
        <li>
          <Link href="/">{homeLabel}&nbsp;&gt;&nbsp;</Link>
        </li>
        {routes.map((route, i) => (
          <li key={i}>
            <Link href={route.href}>{route.title}</Link>
            {i !== routes.length - 1 && <span>&nbsp;&gt;&nbsp;</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
