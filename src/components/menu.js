import React, {useState} from 'react';
import {Link} from 'raviger';


export default function Menu({links, l='', r='', u}){
	const [sel, setSel] = useState(0); 
	const cb = l||u ? e => setSel(e.target.dataset.val) : null;
	const sp = l ? '\u00A0':'';
	const ul = u ? ' menu-sel': '';

	const items = links.map((el, i)=>{
		let name = i == sel ? l+el.name+r: sp+el.name+sp;
		let cl = i == sel ? 'menu-sub'+ul: 'menu-sub';
		let cl2 = ' '+el.class||'';

		return el ? i == 0 ? 
			<Link href={el.path} key={'m'+i} data-val={i} onClick={cb} className={'menu-title'+cl2}>
			{el.name}
			</Link> 
			:
			<Link href={el.path} key={'m'+i} data-val={i} onClick={cb} className={cl+cl2}>
			{name}
			</Link>: null;
	});

	return (<div className="menu">{items}</div>);
}