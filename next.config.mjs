export default { env:{NEXT_PUBLIC_CHANNEL_ID:process.env.CHANNEL_ID,NEXT_PUBLIC_SITE_URL:process.env.NEXT_PUBLIC_SITE_URL||'https://allenwmoorejr.org',NEXT_PUBLIC_GIVING_URL:process.env.GIVING_URL}, images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "i1.ytimg.com" },
      { protocol: "https", hostname: "i2.ytimg.com" },
      { protocol: "https", hostname: "i3.ytimg.com" },
      { protocol: "https", hostname: "i4.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "yt3.ggpht.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" }
    ]
  }
} 
