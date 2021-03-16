const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SpritesmithPlugin = require('webpack-spritesmith');
const Path = require('path');
const MiniCssExtractPluginCleanup = require(Path.resolve(__dirname, 'mini-css-cleanup.js'));

/**
 * Exports the settings for plugins in webpack.config
 */
module.exports = () => ([
    new MiniCssExtractPlugin({
        filename: 'css/[name].css',
    }),
    new MiniCssExtractPluginCleanup(),
    /*new SpritesmithPlugin({
        src: {
            cwd: Path.resolve(__dirname, '../../images/syndicated-icons'),
            glob: '*.png',
        },
        target: {
            image: Path.resolve(__dirname, '../../images/syndicated-icons.png'),
            css: Path.resolve(__dirname, '../../sass/_syndicated-icons.scss'),
        },
        apiOptions: {
            cssImageRef: "../images/syndicated-icons.png",
        },
        customTemplates: {
            'function_based_template': function (data) {
                var shared = '.ico { background-image: url(I) }'
                    .replace('I', data.sprites[0].image);

                var perSprite = data.sprites.map(function (sprite) {
                    return '.ico-N { width: Wpx; height: Hpx; background-position: Xpx Ypx; }'
                        .replace('N', sprite.name)
                        .replace('W', Math.round(sprite.width/2))
                        .replace('H', Math.round(sprite.height/2))
                        .replace('X', Math.round(sprite.offset_x/2))
                        .replace('Y', Math.round(sprite.offset_y/2));
                }).join('\n');

                return shared + '\n' + perSprite;
            },
        },
    }),*/
]);