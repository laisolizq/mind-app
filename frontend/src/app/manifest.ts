import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'mind',
    short_name: 'mind',
    description: 'Get it out of your head.',
    start_url: '/mind-app/',
    scope: '/mind-app/',
    display: 'standalone',
    background_color: '#f8f6f2',
    theme_color: '#E8DFF2',
    icons: [
      {
        src: '/mind-app/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/mind-app/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}