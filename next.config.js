module.exports = {
  reactStrictMode: true,
  pageExtensions: ["ts", "tsx"],
  // webpack(config) {
  //   config.module.rules.push({
  //     test: /\.svg$/,
  //     use: ["@svgr/webpack"],
  //   });
  //
  //   return config;
  // },
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
};
