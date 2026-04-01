import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://my-website-y7bm.vercel.app/sitemap.xml', // Replace with your actual absolute sitemap URL
  }
}
