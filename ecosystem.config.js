module.exports = {
  apps: [
    {
      name: 'Aptiche Server',
      script: './dist/index.js',
      watch: false,
      instances: 1, // TODO: change to max for production
      exec_mode: 'cluster',
      max_memmory_restart: '500M',
      time: false,
      error_file: './logs/pm2-err.log',
      out_file: './logs/pm2-out.log',
      log_file: './logs/pm2-app.log',
      combine_logs: false,
      kill_timeout: 2000,
      min_uptime: '1m',
      max_restarts: 5,
      restart_delay: 1000,
      autorrestart: true,
    },
  ],
};
