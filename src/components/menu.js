import React from 'react';
import {Link} from 'raviger';

export default function Menu({links}){

	const items = links.map((el, i)=>{
		return el ? i === 0 ? 
			<Link href={el.path} key={'m'+i}>
			<span className="menu-title">{el.name}
			</span>
			</Link> 
			:
			<Link href={el.path} key={'m'+i}>
			<span className="menu-sub">{el.name}
			</span>
			</Link> : null;
	});

	return (<div className="menu">{items}</div>);
}

export function StateMenu({links, l='', r='', u}){
	const [sel, setSel] = useState(0); 
	const cb = l||u ? e => setSel(e.target.dataset.val) : null;
	const sp = l ? '\u00A0':'';
	const ul = u ? ' menu-sel': '';

	const items = links.map((el, i)=>{
		let name = i == sel ? l+el.name+r: sp+el.name+sp;
		let cl = i == sel ? 'menu-sub'+ul: 'menu-sub';
		return el ? i == 0 ? 
			<Link href={el.path} key={'m'+i} onClick={cb}>
			<span data-val={i} className={'menu-title'}>{el.name}
			</span>
			</Link> 
			:
			<Link href={el.path} key={'m'+i} onClick={cb}>
			<span data-val={i} className={cl}>{name}
			</span>
			</Link>: null;
	});

	return (<div className="menu">{items}</div>);
}