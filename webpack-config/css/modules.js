const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const Path = require('path');

/**
 * Exports the settings for css modules in webpack.config
 * @returns {{rules: [*,*,*,*]}}
 */
module.exports = (ROOT) => {
    const cssLoaders = [
        {
            loader: 'css-loader',
            options: {
                sourceMap: true,
                url: false,
                import: false,
                importLoaders: 1,
            },
        },
        {
            loader: 'postcss-loader',
            options: {
                sourceMap: true,
                postcssOptions: {
                    plugins: [
                        autoprefixer(),
                    ],
                },
            },
        },
    ].filter(loader => loader);
    const scssLoaders = [
        ...cssLoaders,
        {
            loader: 'resolve-url-loader',
            options: {
                sourceMap: true
            }
        },
        {
            loader: 'sass-loader',
            options: {
                sassOptions: {
                    indentWidth: 2,
                    includePaths: [
                        Path.resolve(ROOT, 'scss'),
                    ],
                },
                sourceMap: true,
            },
        }
    ];

    return {
        rules: [{
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../',
                        },
                    },
                    ...scssLoaders,
                ],
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../',
                        },
                    },
                    ...cssLoaders,
                ],
                sideEffects: true,
            },
            {
                test: /\.(png|gif|jpe?g|svg)$/,
                exclude: /fonts[\///]([\w_-]+)\.svg$/,
                loader: 'url-loader',
                options: {
                    limit: 0,
                    name: 'images/[name].[ext]',
                },
            },
            {
                test: /fonts[\///]([\w_-]+)\.(woff|eot|ttf|svg)$/,
                loader: 'file-loader',
                options: {
                    name: 'fonts/[name].[ext]',
                },
            },
        ],
    };
};
