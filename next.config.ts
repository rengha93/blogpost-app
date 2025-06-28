/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net', // This is the host causing the error
        port: '',
        pathname: '**', // This allows any path on that hostname
      },
      // If you have other image sources (e.g., Unsplash, your own CDN), add them here too
      {
        protocol: 'https',
        hostname: 'downloads.contentful.com', // Another common Contentful CDN
        port: '',
        pathname: '**',
      },
      // {
      //   protocol: 'https',
      //   hostname: 'your-other-image-cdn.com',
      //   port: '',
      //   pathname: '**',
      // },
    ],
  },
};

module.exports = nextConfig;
