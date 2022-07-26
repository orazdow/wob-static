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