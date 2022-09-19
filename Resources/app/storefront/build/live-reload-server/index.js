/**
 * This module creates an live reload server for the Shopware storefront.
 */

module.exports = function createLiveReloadServer() {
    return new Promise((resolve, reject) => {
        const webpack = require('webpack');
        const WebpackDevServer = require('webpack-dev-server');
        const webpackConfig = require('../../webpack.config');
        const compiler = webpack(webpackConfig);

        const devServerOptions = Object.assign({}, webpackConfig.devServer, {
            open: false,
            allowedHosts:'all',
            // stats: {
            //     colors: true,
            // },
            // public: 'http://localhost:98',
            proxy:{
                '/_webpack_hot_proxy_/':{
                    target:'http://localhost:9999',
                    pathRewrite: { '^/_webpack_hot_proxy_/': '' },
                },
                '/sockjs-node/ ':{
                    target:'http://localhost:9999',
                    pathRewrite: { '^/sockjs/': '' },
                }
            }
        });

        // start the normal webpack dev server for hot reloading the files
        const server = new WebpackDevServer(devServerOptions,compiler );

        server.start(devServerOptions.port, '0.0.0.0', (err) => {
            if (err) {
                reject(err);
            }

            console.log('Starting the hot reload server: \n');
        });

        compiler.hooks.done.tap('resolveServer', () => {
            resolve(server);
        });
    });
};

