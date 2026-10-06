const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ბოლო '/'-ს middleware.js ასწორებს, რომ ზედმეტი '/'-ები ერთი redirect-ით მოიხსნას
  skipTrailingSlashRedirect: true,

  // კეში მეხსიერებაში — სერვერზე .next-ში არაფერი იწერება, ამიტომ git pull აღარ ჩერდება
  cacheHandler: require.resolve('./cache-handler.js'),
  cacheMaxMemorySize: 0,
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

// dev და production ერთ საქაღალდეს არ უნდა იყენებდნენ: .next git-შია და სერვერზე pull-ით მიდის,
// `next dev` კი იმავე .next-ში წერდა და აგებულ ბილდს აფუჭებდა (და პირიქითაც).
// phase-ზე ვიყურებით და არა NODE_ENV-ზე: cPanel-ის "Application mode: Development" NODE_ENV-ს
// development-ად აყენებს, phase კი `next dev`-ის გარეშე არასოდეს არის DEVELOPMENT_SERVER.
module.exports = (phase) => ({
  ...nextConfig,
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next',
})
