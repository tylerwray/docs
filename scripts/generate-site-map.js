// This is a development script executed in the build step of pages
const fs = require('fs')
const path = require('path')
const prettier = require('prettier')

const DOMAIN = 'https://zeit.co'
const SITE_PATHS = [
  '/docs',
  '/docs/api',
  '/docs/integrations',
  '/docs/now-cli',
  '/docs/configuration',
  '/docs/builders'
]
const META = /export\s+const\s+meta\s+=\s+({[\s\S]*?\n})/
const SITEMAP_PATH = 'public/sitemap.xml'
const GUIDES_PATH = 'lib/data/guides.json'

// Set the header
const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`

// Wrap all pages in <urlset> tags
const xmlUrlWrapper = nodes => `${xmlHeader}
${nodes}
</urlset>`

function recursiveReadDirSync(dir, arr = [], rootDir = dir) {
  const result = fs.readdirSync(dir)

  result.forEach(part => {
    const absolutePath = path.join(dir, part)
    const pathStat = fs.statSync(absolutePath)

    if (pathStat.isDirectory()) {
      recursiveReadDirSync(absolutePath, arr, rootDir)
      return
    }
    arr.push(absolutePath.replace(rootDir, ''))
  })

  return arr
}

function isV2Page(pagePath) {
  return (
    !pagePath.includes('-mdx/') &&
    !pagePath.includes('.DS_Store') &&
    SITE_PATHS.some(
      dir =>
        pagePath.startsWith(dir + '/index') || pagePath.startsWith(dir + '/v2')
    )
  )
}

function xmlUrlNode(pagePath) {
  const page = path.basename(pagePath)
  const pageName = path.basename(pagePath, path.extname(page))
  const relativeUrl = pagePath.replace(
    page,
    pageName === 'index' ? '' : pageName + '/'
  )
  const content = fs.readFileSync(path.join('pages', pagePath), 'utf-8')
  const match = content.match(META)
  const loc = DOMAIN + relativeUrl

  let meta
  let lastmod

  if (match && typeof match[1] === 'string') {
    meta = eval('(' + match[1] + ')')

    if (meta.lastEdited) {
      lastmod = meta.lastEdited
    }
  }

  const node = `  <url>
    <loc>${loc}</loc>${
    lastmod !== undefined
      ? `
    <lastmod>${lastmod}</lastmod>`
      : ``
  }
    <changefreq>hourly</changefreq>
  </url>`

  return { node, meta }
}

function generateSiteMap() {
  // This will return pages in the format `/docs/v2/name.js`
  const docs = recursiveReadDirSync('pages/docs', [], 'pages')
  const guides = recursiveReadDirSync('pages/guides', [], 'pages')
  const guidesMeta = []

  const nodes = docs
    .reduce((carry, filePath) => {
      const pagePath = filePath.replace(/\\/g, '/')

      // Only v2 pages are included in sitemap.xml
      if (isV2Page(pagePath) && !pagePath.startsWith('.')) {
        const { node } = xmlUrlNode(pagePath)
        carry.push(node)
      }
      return carry
    }, [])
    .concat(
      guides.map(filePath => {
        const pagePath = filePath.replace(/\\/g, '/')
        const { node, meta } = xmlUrlNode(pagePath)

        if (meta) {
          guidesMeta.push(meta)
        }

        return node
      })
    )

  const sitemap = `${xmlUrlWrapper(nodes.join('\n'))}`

  fs.writeFileSync(SITEMAP_PATH, sitemap)

  console.log(
    `sitemap.xml with ${nodes.length} entries was written to ${SITEMAP_PATH}`
  )

  const guidesJson = JSON.stringify(guidesMeta, null, 2)

  fs.writeFileSync(GUIDES_PATH, prettier.format(guidesJson, { parser: 'json' }))

  console.log(
    `guides.json with ${
      guidesMeta.length
    } entries was written to ${GUIDES_PATH}`
  )
}

generateSiteMap()
