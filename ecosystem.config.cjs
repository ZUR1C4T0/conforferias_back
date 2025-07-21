module.exports = {
  apps: [
    {
      name: 'conforferias_back',
      script: 'pnpm',
      args: 'run start',
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
}
