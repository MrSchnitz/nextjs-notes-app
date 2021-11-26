module.exports = {
  reactStrictMode: false,
  pageExtensions: ['ts', 'tsx'],
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
};
