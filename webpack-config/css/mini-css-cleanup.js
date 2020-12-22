module.exports = class MiniCssExtractPluginCleanup {
    apply(compiler) {
        compiler.hooks.emit.tapAsync("MiniCssExtractPluginCleanup", (compilation, callback) => {
            Object.keys(compilation.assets)
                .filter(asset => {
                    return (asset.search(/\.(js|js\.map)$/) != -1);
                })
                .forEach(asset => {
                    delete compilation.assets[asset];
                });

            callback();
        });
    }
}
