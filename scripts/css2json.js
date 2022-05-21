// inline style, class attribute to jsx
function toJSX(str){
	let s = str.replace(/style\s*?=\s*?"(.*?)"/g, (match)=>{    
	    let arr = match.match(/(?<=")(.*?)(?=")/)[0].split(';').filter(s=>s.length>1);
	    arr = arr.map(el => el.split(':').map(el => el.replace(' ','')));
	    arr = arr.filter(a=>a.length == 2);
	    arr = arr.map(el => '\"'+el[0]+'\":'+' \"'+el[1]+'\"');
	    let st = 'style={{'+arr.join(',')+'}}';
	    return st;
	});
	return s.replace(/class\s*?=/g, 'className=');
}

// not used (for html-import)
function removeTag(str, tag){
    let _o = '(<'+tag+'[^>]*>)';
    let _c = '(<\/'+tag+'[^>]*>)';
    let o = new RegExp(_o, 'im');
    let c = new RegExp(_c, 'im');
    return str.replace(o, '').replace(c, '');
}
function getTagContent(str, tag, _inc){
    let ex = '(?<=<'+tag+'[^>]*>)([\\s\\S]*?)(?=<\/'+tag+'>)';
    let inc = '(<'+tag+'[^>]*>)([\\s\\S]*?)(<\/'+tag+'>)';
    let reg = new RegExp(_inc? inc : ex, 'm');
    return str.match(reg)[0];
}

module.exports = function(src) {
  return toJSX(src);
};