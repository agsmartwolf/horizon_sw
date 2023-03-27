/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_STORE_URL,
  generateRobotsTxt: true,
  exclude: ['/404', '/500', '/checkout', '/cart', '/account', '/account/*'],
  robotsTxtOptions: { policies: [{ userAgent: '*', disallow: '/account/' }] },
};
