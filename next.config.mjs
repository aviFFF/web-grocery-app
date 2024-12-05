/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
          {
            protocol: 'http', // or 'https' depending on the domain
            hostname: '192.168.18.8',
          },
          {
            protocol: 'http', // or 'https' depending on the domain
            hostname: 'localhost',
          },
          {
            protocol: 'https',
            hostname: 'res.cloudinary.com',
          },
        ],
      },
      
};



export default nextConfig;
