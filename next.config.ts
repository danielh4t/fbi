import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    domains: ["www.fbi.gov"],
  },
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: true,
      },
    
    ]
  },
}

export default nextConfig
