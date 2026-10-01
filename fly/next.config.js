/** @type {import('next').NextConfig} */
const nextConfig = {
  // ბოლო '/'-ს middleware.js ასწორებს, რომ ზედმეტი '/'-ები ერთი redirect-ით მოიხსნას
  skipTrailingSlashRedirect: true,
  sassOptions: {},
  images: {
    disableStaticImages: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg|webp|ico)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'static/media/[name].[hash:8][ext]',
      },
    });
    return config;
  },
}

module.exports = nextConfig
