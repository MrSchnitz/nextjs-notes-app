module.exports = {
  reactStrictMode: true,
  webpack(config, { webpack }) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    config.plugins.push(new webpack.IgnorePlugin(/\/__tests__\//));

    return config;
  },
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
};
