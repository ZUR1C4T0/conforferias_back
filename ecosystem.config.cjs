module.exports = {
  apps: [
    {
      name: 'conforferias_back',
      script: './dist/main.js',
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
}
