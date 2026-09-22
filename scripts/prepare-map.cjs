// Rebuild the local browser asset from Natural Earth's public-domain GeoJSON.
const fs=require('node:fs');const path=require('node:path');const dir=path.resolve(__dirname,'..');
const source=JSON.parse(fs.readFileSync(path.join(dir,'world.geojson'),'utf8'));
const world=source.features.map(f=>({code:f.properties.ISO_A2_EH||f.properties.ISO_A2,name:f.properties.ADMIN,center:[f.properties.LABEL_X,f.properties.LABEL_Y],geometry:f.geometry}));
fs.writeFileSync(path.join(dir,'world.js'),'globalThis.WORLD_MAP = '+JSON.stringify(world)+';\n');
console.log('Map asset: '+world.length+' shapes');
