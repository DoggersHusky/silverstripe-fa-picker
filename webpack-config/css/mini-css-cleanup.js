const { Compilation } = require("webpack");

module.exports = class MiniCssExtractPluginCleanup {
    apply(compiler) {
        compiler.hooks.compilation.tap(
            'MiniCssExtractPluginCleanup',
            (compilation) => {
                compilation.hooks.processAssets.tap(
                    {
                        name: 'MyPlugin',
                        stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
                        additionalAssets: (assets) => {
                        },
                    },
                    (assets) => {
                        Object.keys(compilation.assets)
                            .filter((asset) => {
                                return (asset.search(/\.(js|js\.map)$/) != -1);
                            })
                            .forEach((asset) => {
                                delete compilation.assets[asset];
                            });
                    },
                );
            }
        );
    }
}
