import React from 'react';
import {Link} from 'raviger';
import Menu from './menu.js';

const links = [{name: 'Ollie Razdow', path: '/'}, {name: 'projects', path: 'posts'}];

export default function Home(props){
	return(
		<div className="template">
		<div className="center-margin">
		<Menu links={links}/>
		</div>
			{props.children}
		</div>		
	);
}