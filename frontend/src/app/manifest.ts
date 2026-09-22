import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'mind',
    short_name: 'mind',
    description: 'Get it out of your head.',
    start_url: '/mind-app/',
    display: 'standalone',
    background_color: '#F2DDE3',
    theme_color: '#F2DDE3',
    icons: [
      {
        src: '/mind-app/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}