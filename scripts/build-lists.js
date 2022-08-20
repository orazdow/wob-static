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

const replaceUnderscore = true;

async function getPragma(el){
	let str = await fs.promises.readFile(el.path, 'utf8');
	let m = str.match(/(?<=@pragma)(.+?)(?=\*\/)/gsmi);
	let o = {
		title: validate('', 'title', el),
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
		for(let e of a){
			let prop = e[0].toLowerCase();
			if(keys.includes(prop)){
				o[prop] = validate(e[1], prop, el);
			}else{
				console.log('unrecognized pragma key:', prop, '-', fstr);
			}
		}
	}
	o.min = o.linkmode != 'static-max';
	return o;
}

async function getListParams(path){
	try{
		let str = await fs.promises.readFile(path, 'utf8');
		//@template
		let m_t = str.match(/(?<=@template)(.+?)(?=\*\/)/gsmi);
		if(m_t && m_t[0]){
			return `\n{/* @template ${m_t[0]} */}\n`;
		}
		/*
		//@override
		let m_o = str.match(/(?<=@override)(.+?)(?=\*\/)/gsmi);
		if(m_o){
			let a = m_o[0].split('\n').filter(s => s.includes(':'));
			a = a.map(s => s.replace(/[\x00-\x1F\x7F]/, ''));
			a = a.map((s)=>{
				let _a = s.split(':');
				if(_a.length > 2){
					_a = [_a[0], _a.slice(1).join(':')];
				}
				return _a.map(s => s.trim());
			});
			return a;
		}
		*/
	}catch(err){console.log(err);}	
}

function validate(value, key, el){
	switch(key){
		case 'title':
			if(!value){
				value = el.name.substring(0, el.name.lastIndexOf('.'));
				if(replaceUnderscore) value = value.replaceAll('_', ' ');
			} 		
		break;
		case 'linkmode':
			if(!proto.linkmode.includes(value)){
				console.log('unrecognized pragma value:', 'linkmode :', value, '\n');
				value = 'title';
			}
			if(value === 'static-max' || value === 'expand'){
				let name = el.name[0].toUpperCase()+el.name.substring(1).replace('.','_');
				el.import = [name, el.path];
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

function importStr(imports){
	let str = ''
	for(let a of imports){
		str += `import ${a[0]} from '${a[1]}';\n`;
	}
	return str;	
}

function buildStr(liststr, importstr){
	let str =''; 
	let components = path.resolve('/src/components');
	str += 'import React from \'react\';\nimport {Link} from \'raviger\';\n';
	str += `import List from \'${components}/wob-components.js\';\n`;
	str += importstr || '';
	str += '\nconst posts = '+liststr+';\n';
	str += '\nexport default function f(props){\n';
	str += '    return(<List list={posts} category={props.category}/>);\n}\n'
	return str;
}

function unquoteImport(str){
	let reg = /(?<="import"\s*?:\s*?)"(.*)"(>?,|\n)/gm;
	return str.replace(reg, s => s.replaceAll('"',''))
}

async function writeIndex(filepath, basepath){
	let srcpath = filepath.substring(0,filepath.lastIndexOf('/'));
	let destpath = filepath.replace('.list', '');
	let destname = destpath.substring(destpath.lastIndexOf('/')+1);
	let list = initlists(srcpath);
	list = list.filter(el=>el.name != destname && (el.name.split('.')[0]||'').toLowerCase()!= 'index');
	let imports = [];
	for(let el of list){
		el = Object.assign(el, await getPragma(el));
		el.route = el.path.substring(el.path.indexOf(basepath)+basepath.length);
		el.route = el.route.substring(0,el.route.lastIndexOf('.'));
		let d = parseDate(el.date);
		if(d.err) console.log(el.title, d.err);
		el.timecode = d.epoch || 0;
		delete el.path;
		if(el.import){
			imports.push(el.import);
			el.import = el.import[0];
		}
	}
	list.sort(sortList);
	overrideIndices(list);
	let tmp = await getListParams(filepath);
	let str = JSON.stringify(list, null, 4);
	let istr = importStr(imports) + (tmp||'');
	let s = buildStr(str, istr);
	if(imports.length) s = unquoteImport(s);
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