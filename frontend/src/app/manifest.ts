import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'mind',
    short_name: 'mind',
    description: 'Get it out of your head.',
    id: '/mind-app/',
    start_url: '/mind-app/',
    scope: '/mind-app/',
    display: 'standalone',
    background_color: '#f8f6f2',
    theme_color: '#E8DFF2',
    icons: [
      {
        src: '/mind-app/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/mind-app/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
