/** @type {import("next").NextConfig} */
module.exports = {
  /** We run eslint as a separate task in CI */
  eslint: { ignoreDuringBuilds: !!process.env.CI },
  reactStrictMode: false,
};
module.exports = {
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
};
