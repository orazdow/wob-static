const dirTree = require("directory-tree");
const fs = require('node:fs');
const path = require('node:path');
const {parseDate, sortList, overrideIndices} = require('./parsedate.js');


/*
	@pragma

	title: (defaults to filename)
	linkmode: (title, card, expand, static-max, static-min) --default: title
	date: (none if empty) format: yyyy-mm-dd (opt: hh:mm:ampm)
	index: (overrides alphanumeric or date order if set)
	description: displays blurb if set

*/

/* 
	(title).list.js -in directry signals list to be built, outputting (title) component
	empty file: build default list
	options : {
		order: (title, date, date-ascending) -order priority default title
		override:{
			override pragmas
		}
	}

*/


const proto = {
	title: '',
	linkmode: ['title', 'card', 'expand', 'static-max', 'static-min'],
	date: '',
	description: '',
	index: undefined,
	keywords: ["a", "b", "c"]
};


async function getPragma(path){
	let str = await fs.promises.readFile(path, 'utf8');
	let fstr = path.substring(path.lastIndexOf('/')+1);
	let m = str.match(/(?<=@pragma)(.+?)(?=\*\/)/gsmi);
	let o = {
		title: validate('', 'title', fstr),
		linkmode: 'title'
	};
	if(m){
		let a = m[0].split('\n').filter(s => s.includes(':'));
		a = a.map(s => s.replace(/[\x00-\x1F\x7F]/, ''));
		a = a.map((s)=>{
			let _a = s.split(':');
			if(_a.length > 2){
				_a = [_a[0], _a.slice(1).join(':')];
			}
			return _a.map(s => s.trim());
		});
		let keys = Object.keys(proto);
		for(let el of a){
			let prop = el[0].toLowerCase();
			if(keys.includes(prop)){
				o[prop] = validate(el[1], prop, fstr);
			}else{
				console.log('unrecognized pragma key:', prop, '-', fstr);
			}
		}
	}
	o.min = o.linkmode != 'static-max';
	return o;
}

function validate(value, key, fstr){
	switch(key){
		case 'title':
			if(!value) value = fstr.substring(0, fstr.lastIndexOf('.'));		
		break;
		case 'linkmode':
			if(!proto.linkmode.includes(value)){
				console.log('unrecognized pragma value:', 'linkmode :', value, '\n');
				value = 'title';
			}
		break;
		case 'date':
		break;
		case 'description':
		break
		case 'index':
		break;
		case 'keywords':
			value = JSON.parse(value);
		break;
	}
	return value;
}

function initlists(path){
	let a = dirTree(path).children;
	a = a.filter(e => e.name.endsWith('.js')||e.name.endsWith('.mdx')||e.name.endsWith('.md'));
	return a.filter(e => (e.name.split('.')[1]||'').toLowerCase()!= 'list');
}

function buildStr(liststr){
	let str =''; 
	let components = path.resolve('/src/components');
	str += 'import React from \'react\';\nimport {Link} from \'raviger\';\n';
	str += `import List from \'${components}/wob-components.js\';\n`;
	str += 'const posts = '+liststr+';\n';
	str += 'export default function f(props){\n';
	str += 'return(<List list={posts} category={props.category}/>);\n}\n'
	return str;
}

async function writeIndex(filepath, basepath){
	let srcpath = filepath.substring(0,filepath.lastIndexOf('/'));
	let destpath = filepath.replace('.list', '');
	let destname = destpath.substring(destpath.lastIndexOf('/')+1);
	let list = initlists(srcpath);
	list = list.filter(el=>el.name != destname && (el.name.split('.')[0]||'').toLowerCase()!= 'index');
	for(let el of list){
		el = Object.assign(el, await getPragma(el.path));
		el.route = el.path.substring(el.path.indexOf(basepath)+basepath.length);
		el.route = el.route.substring(0,el.route.lastIndexOf('.'));
		let d = parseDate(el.date);
		if(d.err) console.log(el.title, d.err);
		el.timecode = d.epoch || 0;
		delete el.path;
	}
	list.sort(sortList);
	overrideIndices(list);
	let str = JSON.stringify(list, null, 4);
	let s = buildStr(str);
	try{
		await fs.promises.writeFile(destpath, s);
		console.log('wrote:', destpath, '\n');
	}
	catch(err){
		console.log(err);
	}
}

function dfs(arr, cb){
	for(let el of arr){		
		cb(el)
		if(el.children)
			dfs(el.children, cb);
	}
}

async function buildLists(basepath){
	let a = dirTree(basepath);
	let listfiles = [];
	if(!a){
		console.log('null path:', basepath);
		return;
	};
	dfs(a.children, (el)=>{
		let s = el.name.split('.')[1];
		if(s && s.toLowerCase() == 'list'){
			listfiles.push(el.path);
			console.log(el.path);
		}
	});
	for(let file of listfiles){
		await writeIndex(file, basepath);
	}
}

module.exports = buildLists;