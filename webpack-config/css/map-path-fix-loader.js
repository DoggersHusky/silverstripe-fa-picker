const loaderUtils=require('loader-utils');
const Path=require('path');

module.exports=function(content, map) {
    const options = loaderUtils.getOptions(this) || {};
    const basePath = this.context;
    const rootPath = Path.dirname(basePath);
    const srcFolder = Path.basename(this.context);
    const baseRegExp = new RegExp(escapeRegExp(basePath), 'g');
    const rootRegExp = new RegExp(escapeRegExp(rootPath), 'g');
    const callback = this.async();
    
    if (map) {
        if (typeof map === "string") {
            map = JSON.stringify(map);
        }
        
        if (map.sources) {
            map.sources = map.sources.map(function (source) {
                if (source.search(baseRegExp) >= 0) {
                    return Path.join(
                                    srcFolder,
                                    source.replace(baseRegExp, '')
                                );
                } else {
                    return source.replace(rootRegExp, '');
                }
            });
            map.sourceRoot = '';
        }
    }
    
    callback(null, content, map);
    
    return null;
}

function escapeRegExp (str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}