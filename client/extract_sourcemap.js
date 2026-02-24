const fs = require('fs');
const path = require('path');

function findSourceMaps(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(findSourceMaps(file));
        } else {
            if (file.endsWith('.js.map') || file.endsWith('.json')) results.push(file);
        }
    });
    return results;
}

const mapFiles = findSourceMaps(path.join(__dirname, '.next', 'server', 'app'));

mapFiles.forEach(sourcemapPath => {
    try {
        const mapData = JSON.parse(fs.readFileSync(sourcemapPath, 'utf8'));
        if (mapData && mapData.sources) {
            console.log(`\n=== Sources in ${path.basename(sourcemapPath)} ===`);
            console.log(mapData.sources.slice(0, 10)); // just print first 10
        }
    } catch (e) {
    }
});
