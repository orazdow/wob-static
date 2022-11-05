function addImport(str, mod, named, source, test, rpath){
	if(test && str.search(test) < 0)
		return str;
	
 	let reg = named ? 
 		`import\\s*?{\\s*?${mod}\\s*?}(.*)'${source}'` : 
 		`import\\s*?\\s*?${mod}\\s*?(.*)'${source}'`;
	let match = str.match(new RegExp(reg, ''));
	let jsxcomment = str.match(new RegExp(`'${source}'.\\s*\\*\\/\\s*}`, ''));
	if(match && !jsxcomment){
		return str;
	}
	else{
		let imp = named ? 
		`import {${mod}} from '${source}'` :
		`import ${mod} from '${source}'`;
		return imp+'\n\n'+str;
	}	
}

module.exports = function(src){
 	const op = this.getOptions();
 	if(op.enabled)
 		return addImport(src, op.module, op.named, op.source, op.test);
 	else return src;
}