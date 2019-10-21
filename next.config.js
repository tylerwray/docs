const isProd = process.env.NODE_ENV === 'production'

const rehypePrism = require('@mapbox/rehype-prism')
// Adds github.com/mdx-js/mdx to Next.js
const withMDX = require('@next/mdx')({
  extension: /\.(md|mdx)?$/,
  options: {
    hastPlugins: [rehypePrism]
  }
})

module.exports = withMDX({
  target: 'serverless',

  exportTrailingSlash: true,

  // Allow mdx and md files to be pages
  pageExtensions: ['jsx', 'js', 'mdx', 'md'],

  assetPrefix: isProd ? '/docs' : '',

  env: {
    VERSION: require('./package.json').version,
    API_URL: process.env.API_URL,
    IMAGE_ASSETS_URL: 'https://assets.zeit.co/image/upload/front',
    VIDEO_ASSETS_URL: 'https://assets.zeit.co/video/upload/front',
    RAW_ASSETS_URL: 'https://assets.zeit.co/raw/upload/front',
    ASSETS: isProd ? '/docs/static' : '/static'
  },

  webpack(config, { isServer }) {
    if (isServer) {
      require('./scripts/generate-site-map')
    }
    return config
  }
})
