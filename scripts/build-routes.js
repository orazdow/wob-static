const dirTree = require("directory-tree");
const path = require('node:path');
const fs = require('node:fs');

function dfs(arr, list, cb){
	for(let el of arr){		
		cb(el);
		if(el.children)
			dfs(el.children, list, cb);
	}
}

function routeAsset(el, baseroute){
	if(el.name.endsWith('.js') || el.name.endsWith('.md') || el.name.endsWith('.mdx')){
		let srcpath = path.resolve(el.path).replaceAll(path.sep, '/');
		let name = el.name.replace(/(.js)|(.mdx)|(.md)/ig, '');
		if(name.substring(name.lastIndexOf('.')+1).toLowerCase() == 'list'){
			return; // ignore __.list.js
		}
		name = name[0].toUpperCase()+name.substring(1).replace('.', '_');
		let route = el.path.substring(el.path.indexOf(baseroute)+baseroute.length);
		route = route.substring(0, route.lastIndexOf('.'));
		if(route.toLowerCase().endsWith('index')){
			route = route.substring(0, route.lastIndexOf('/')) || '/';
		}
		let indexp = route.substring(route.lastIndexOf('/')+1);
		if(name.toLowerCase().endsWith('index')) name = 'Index';
		if(name == 'Index' && indexp) name += '_'+indexp;
		if(name && route){
			return {name: name, route: route, path: srcpath};
		}
	}
	return;	
}

function check(list){
	let o = {};
	let a = [];
	let i = 0;
	for(let el of list){
		if(o[el.route]){
			let a = o[o[el.route]];
			let b = el.path.substring(el.path.lastIndexOf('/')+1);
			console.log('-- multiple mappings to', el.route+' : (', a+', '+b,') skipping', b+'! --\n');
		}else{
		o[el.route] = el.name;
		o[el.name] = el.path.substring(el.path.lastIndexOf('/')+1);
		let f = a.find((e)=>{
			return (e.name == el.name);
		});
		if(f){
			console.log('duplicate name', el.name+':', f.route+', '+el.route);
			let r = el.route.split('/');
			let rr = r[r.length-2];
			if(rr && (el.name+'_'+rr != f.name)){
				el.name += '_'+rr;
			}else{
				el.name += '_'+(i++);
			};
			console.log('renaming:', el.route+' -> '+el.name);
		}
		a.push(el);
		}
	}
	return a;
}

async function checkTemplates(list, baseroute){
	let templates = {}, found =[];
	for(let el of list){
		let str = await fs.promises.readFile(el.path, 'utf8');
		let m = str.match(/(?<=@template)(.+?)(?=\*\/)/gsmi);
		if(m && m[0]){
			let s = m[0].trim();
			if(found.findIndex((str)=>{return str == s;}) < 0){
				if(s.endsWith('.js')||s.endsWith('.mdx')){
					let _i = baseroute.search('src');
					if(_i > 0){
						let dir = baseroute.substring(0, _i+3)+'/components/'+s;
						let name = 'Tmp_'+s.substring(0, s.lastIndexOf('.'));
						templates[s] = {name:name, path:dir};
						found.push(s);
						el.template = name;
					}
				}
			}else{ 
				el.template = templates[s].name;
			}
		}
		m = str.match(/(?<=@endpoint)(.+?)(?=\*\/)/gsmi);
		if(m && m[0]){
			let s = m[0].trim();
			console.log('\n@endpoint: overriding route', el.route+' -> '+s);
			el.route = s;
		}
	}
	let a = Object.values(templates);
	return a.length? a : undefined;
}

function routeStr(list){
	let str = '';
	for(let el of list){
		str += el.template ? 
		`    '${el.route}': () => <${el.template}><${el.name}/></${el.template}>,\n` :
		`    '${el.route}': () => <${el.name}/>,\n`;
	}
	return `const routes = {\n${str}};`
}

function importStr(list){
	let str = '';
	for(let el of list){
		str += `import ${el.name} from '${el.path}';\n`;
	}
	return str;
}

async function buildRoutes(baseroute){
	baseroute = baseroute.replaceAll(path.sep, '/');
	let list = [];
	let tree = dirTree(baseroute);
	if(!tree){
		console.log('Error: could not resolve', baseroute, '\n');
		return;
	}
	dfs(tree.children, list, (el)=>{
		el.path = el.path.replaceAll(path.sep, '/');
		let e = routeAsset(el, baseroute);
		if(e)list.push(e);
	});
	let a = check(list);
	let import_str = importStr(a);
	let templates = await checkTemplates(a, baseroute);
	if (templates) import_str += importStr(templates);
	let route_str = routeStr(a);
	let str = 'import React from \'react\';\n\n'+import_str+'\n'+route_str+'\n\nexport default routes;';
	try{
		await fs.promises.writeFile("./src/routes.js", str);
		console.log('\nwrote to src/routes.js:\n\n'+route_str+'\n');
	}
	catch(err){
		console.log(err);
	}
}

module.exports = buildRoutes;