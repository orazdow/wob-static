const dirTree = require("directory-tree");
const fs = require('node:fs');
const path = require('node:path');

const baseroute = path.resolve('src/site');

function dfs(arr, cb){
	for(let el of arr){		
		cb(el)
		if(el.children)
			dfs(el.children, cb);
	}
}

async function deleteFile(fpath){
	try{
		await fs.promises.open(fpath);
		console.log('deleting:', fpath);
		try{
			await fs.promises.unlink(fpath);
		}catch(err){
			console.log('error deleting', fpath);
		}	
	}
	catch(err){
		console.log(fpath, 'does not exist');
		return;
	}
}

async function deleteLists(basepath){
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
		}
	});
	for(let file of listfiles){
		let ifile = file.replace('.list', '');
		await deleteFile(ifile);
	}
}

(async ()=>{
	await deleteLists(baseroute);
	await deleteFile('./src/routes.js');
})();