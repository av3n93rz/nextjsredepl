module.exports = {
  images: {
    domains: ['ik.imagekit.io'],
  },

  webpack: (config) => {
    config.node ={
      child_process: "empty",
      dns: "empty",
      fs: "empty",
      net: "empty",
      tls: "empty",
  }
    return config
  },
}