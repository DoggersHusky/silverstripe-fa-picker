const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Path = require('path');
const MiniCssExtractPluginCleanup = require('./mini-css-cleanup.js');

/**
 * Exports the settings for plugins in webpack.config
 */
module.exports = () => ([
    new MiniCssExtractPlugin({
        filename: 'css/[name].css',
    }),
    new MiniCssExtractPluginCleanup(),
]);
