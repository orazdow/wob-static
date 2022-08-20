import React from 'react';
import {Link} from 'raviger';
import Menu from './menu.js';

const links = [{name: 'Wob-static', path: '/'}, {name: 'projects', path: 'posts'}];

export default function Home(props){
	return(
		<div className="center-template">
		<Menu links={links}/>	
			{props.children}
		</div>		
	);
}