const buildRoutes = require('./build-routes.js');
const buildLists = require('./build-lists.js');
const path = require('node:path');

const baseroute = path.resolve('src/site');

(async ()=>{
	await buildLists(baseroute);
	await buildRoutes(baseroute);
})();
