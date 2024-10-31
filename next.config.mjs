import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/waterpath-data-integration-tool",
  output: "export",
  reactStrictMode: true,
};

export default withNextIntl(nextConfig);
