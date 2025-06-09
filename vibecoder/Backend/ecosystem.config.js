module.exports = {
  apps: [
    {
      name: 'vibecoder-api',
      script: 'dist/server.js',
      instances: process.env.NODE_ENV === 'production' ? 'max' : 1,
      exec_mode: 'cluster',
      
      // Environment variables
      env: {
        NODE_ENV: 'development',
        PORT: 5000,
      },
      
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      
      // Logging
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Process management
      max_memory_restart: '1G',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s',
      
      // Monitoring
      monitoring: false,
      
      // Advanced features
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'uploads'],
      
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 3000,
      
      // Health check
      health_check_grace_period: 3000,
      
      // Auto restart on file changes (development only)
      watch_options: {
        followSymlinks: false,
        usePolling: false,
      },
      
      // Merge logs from all instances
      merge_logs: true,
      
      // Time zone
      time: true,
      
      // Source map support
      source_map_support: true,
      
      // Instance variables
      instance_var: 'INSTANCE_ID',
      
      // Startup script
      post_update: ['npm install', 'npm run build'],
      
      // Cron restart (optional - restart every day at 2 AM)
      cron_restart: process.env.NODE_ENV === 'production' ? '0 2 * * *' : undefined,
      
      // Exponential backoff restart delay
      exp_backoff_restart_delay: 100,
      
      // Disable auto restart
      autorestart: true,
      
      // Node.js options
      node_args: [
        '--max-old-space-size=1024',
        '--optimize-for-size',
      ],
      
      // Environment-specific configurations
      ...(process.env.NODE_ENV === 'production' && {
        // Production-specific settings
        instances: 'max',
        exec_mode: 'cluster',
        max_memory_restart: '1G',
        
        // Enable monitoring in production
        monitoring: true,
        
        // Production logging
        log_type: 'json',
        combine_logs: true,
        
        // Error handling
        min_uptime: '60s',
        max_restarts: 5,
        restart_delay: 5000,
      }),
      
      ...(process.env.NODE_ENV === 'development' && {
        // Development-specific settings
        instances: 1,
        exec_mode: 'fork',
        watch: true,
        ignore_watch: ['node_modules', 'logs', 'uploads', 'dist'],
        
        // Development logging
        log_type: 'raw',
        
        // Faster restarts in development
        min_uptime: '5s',
        max_restarts: 50,
        restart_delay: 1000,
      }),
    },
  ],
  
  // Deployment configuration
  deploy: {
    production: {
      user: 'deploy',
      host: ['production-server.com'],
      ref: 'origin/main',
      repo: 'git@github.com:vibecoder/backend.git',
      path: '/var/www/vibecoder-api',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'apt update && apt install git -y',
      'post-setup': 'ls -la',
      ssh_options: 'StrictHostKeyChecking=no',
      env: {
        NODE_ENV: 'production',
      },
    },
    
    staging: {
      user: 'deploy',
      host: ['staging-server.com'],
      ref: 'origin/develop',
      repo: 'git@github.com:vibecoder/backend.git',
      path: '/var/www/vibecoder-api-staging',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env staging',
      env: {
        NODE_ENV: 'staging',
      },
    },
  },
};
