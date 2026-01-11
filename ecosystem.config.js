/**
 * PM2 Ecosystem Configuration
 * Konfigurasi untuk deployment production dengan PM2
 */

module.exports = {
    apps: [{
        name: 'library-system',
        script: 'src/app.js',

        // Cluster mode untuk load balancing
        instances: 'max',
        exec_mode: 'cluster',

        // Environment variables
        env: {
            NODE_ENV: 'development',
            PORT: 3000
        },
        env_production: {
            NODE_ENV: 'production',
            PORT: 3000
        },

        // Logging
        error_file: './logs/err.log',
        out_file: './logs/out.log',
        log_file: './logs/combined.log',
        time: true,

        // Auto restart configuration
        watch: false,
        ignore_watch: ['node_modules', 'logs', 'tests'],
        max_memory_restart: '1G',

        // Advanced settings
        node_args: '--max-old-space-size=1024',

        // Graceful shutdown
        kill_timeout: 5000,
        wait_ready: true,
        listen_timeout: 10000,

        // Auto restart on crash
        autorestart: true,
        max_restarts: 10,
        min_uptime: '10s'
    }],

    deploy: {
        production: {
            user: 'deploy',
            host: 'your-server.com',
            ref: 'origin/main',
            repo: 'git@github.com:username/library-management-system.git',
            path: '/var/www/library-system',
            'pre-deploy-local': '',
            'post-deploy': 'npm ci --only=production && pm2 reload ecosystem.config.js --env production',
            'pre-setup': ''
        }
    }
};