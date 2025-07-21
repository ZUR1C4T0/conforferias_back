module.exports = {
  apps: [
    {
      name: 'conforferias_back',
      script: 'dist/main',
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
}
