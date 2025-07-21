module.exports = {
  apps: [
    {
      name: 'conforferias_back',
      script: 'pnpm',
      args: 'run prod',
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
}
