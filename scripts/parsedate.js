/*
	valid formats:
	'2019/07/05'
	'07/05/2019'
	'2019/07/05 4:15 pm'
	'2019/07/05 4:15'
	'07/05/2019 4:15'

	returns:
	{
	  string: '2019/07/05 4:15 pm',
	  fields: { y: 2019, m: 7, d: 5, hh: 4, mm: 15, hh24: 16, ampm: 'pm' },
	  epoch: 1565021700000,
	  err: null
	}
	or {err: err_msg}

	'' 
	returns: {epoch: 0}
*/

/*
	global list sorting options:
	date_priority: (true )sort dates at top of list
	date_descending: (true) most recent at top
	alpha descending: reversed alpha
*/
const sort_options = {
	date_priority: true,
	date_descending: true,
	alpha_descending: false
}

function parseDate(s){
    let d_err = 'incorrect date: expected mm/dd/yyyy or yyyy/mm/dd';
    if(!s) return {epoch: 0};
    let fields = {};
    let arr = s.split(' ');
    let d_str = arr[0];
    let d = d_str.split('/');
    if(d.length != 3) 
    	return {err: d_err};

    let _i = -1;
    for(let i = 0; i < 3; i++) 
    	if(d[i].length == 4)
    		_i = i;

    if(_i < 0) 
    	return {err: d_err};

    fields['y'] = +d.splice(_i,1)[0];
    fields['m'] = +d[0];
    fields['d'] = +d[1];

    if(arr.length >= 2){
        let timestr = arr.slice(1).join('');
        let t_err = 'incorrect time format '+timestr;
        timestr = timestr.replace(' ','');
        let tarr = timestr.split(':');
        let ampm = undefined;
        if(tarr.length != 2 || isNaN(tarr[0])) return {err: t_err};   
        if(isNaN(tarr[1])){
            let idx = tarr[1].search(/(am|pm)/gi);
            if(idx < 0) return {err: t_err};              
            ampm = tarr[1].substring(idx, idx+2)
            tarr[1] = tarr[1].replace(ampm, '');
            if(isNaN(tarr[1])) return {err: t_err};
        }

        fields['hh'] = +tarr[0];
        fields['mm'] = +tarr[1];
        fields['hh24'] = fields['hh'];
        fields['ampm'] = ampm;
        if(ampm == 'pm' && fields['hh'] < 13){
            fields['hh24'] = fields['hh']+12;
        }
    }
    let date = new Date(fields.y, fields.m-1, fields.d);
    if(fields.hh24 != undefined && fields.mm != undefined){
        date.setHours(fields.hh24);
        date.setMinutes(fields.mm);
    }
    let ret = {
        string: s,
        fields: fields,
        epoch: date.getTime(),
        err: null
    }
    return ret;    
}


function sort(a, b){ 
	let adesc = sort_options.alpha_descending;
	let ddesc = sort_options.date_descending;
	let dpriority = sort_options.date_priority;
	let r = adesc ? 
		b.title.localeCompare(a.title) : a.title.localeCompare(b.title);
	if(r !== 0 && !dpriority) 
		return r;
	else{
		if(a.timecode > b.timecode){
			if(ddesc) return -1
			else return (dpriority && b.timecode > 0) ? 1 : -1
		} 
		else if(a.timecode < b.timecode){
			if(ddesc) return 1
			else return (dpriority && a.timecode > 0) ? -1 : 1
		}
		else return r;
	}
}

// rearrange list with index field overrides if present
function overrideIndices(arr){
    let list = [];
    for(let e of arr){
        if(e.index || e.index === 0)
            list.push(e);
    }
    let len = list.length;
    if(len == 0) return;
    let copy = arr.map(e=>e);
    for(let i = 0; list.length > 0 && i < 100; i++){
        let e = list.pop();
        let _i = copy.findIndex((el)=>{
            return el.title == e.title && el.route == e.route;
        });
        if(_i >= 0){
            copy.splice(_i, 1);
            copy.splice(e.index, 0, e);
        }
    }
    if(copy.length === arr.length){
        arr.forEach((e, i)=>{
            arr[i] = copy[i];
        });
        console.log('overrode', len, 'indices');
    }
}


module.exports = {
	parseDate: parseDate,
	sortList: sort,
	overrideIndices: overrideIndices
}