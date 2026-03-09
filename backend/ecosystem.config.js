module.exports = {
  apps: [
    {
      name: 'datashare-api',
      script: 'dist/src/main.js',
      cwd: '/var/www/datashare-api',
      instances: 1,
      autorestart: true,
      watch: false,
      merge_logs: true,
    },
  ],
};