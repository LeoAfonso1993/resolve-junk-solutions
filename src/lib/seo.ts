import { business, PRE_LAUNCH_MODE } from '../data/business';
export const absolute = (path: string) => new URL(path, business.url).href;
export function graph(
  path: string,
  crumbs: { name: string; url: string }[] = [],
  service?: string,
) {
  const id = `${business.url}/#business`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': PRE_LAUNCH_MODE ? 'Organization' : 'LocalBusiness',
        '@id': id,
        name: business.name,
        url: business.url,
        description: `Locally owned junk removal company ${PRE_LAUNCH_MODE ? 'preparing to serve' : 'serving'} ${business.region}.`,
        areaServed: { '@type': 'AdministrativeArea', name: business.region },
        ...(business.phone ? { telephone: business.phone } : {}),
        ...(business.email ? { email: business.email } : {}),
        ...(business.socialProfiles.length
          ? { sameAs: business.socialProfiles }
          : {}),
      },
      {
        '@type': 'WebSite',
        '@id': `${business.url}/#website`,
        url: business.url,
        name: business.name,
        publisher: { '@id': id },
      },
      ...(crumbs.length
        ? [
            {
              '@type': 'BreadcrumbList',
              itemListElement: crumbs.map((c, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: c.name,
                item: absolute(c.url),
              })),
            },
          ]
        : []),
      ...(service && !PRE_LAUNCH_MODE
        ? [
            {
              '@type': 'Service',
              '@id': `${absolute(path)}#service`,
              name: service,
              provider: { '@id': id },
              areaServed: {
                '@type': 'AdministrativeArea',
                name: business.region,
              },
              url: absolute(path),
            },
          ]
        : []),
    ],
  };
}
