import React from 'react';
import {useRoutes} from "raviger";
import Menu from './menu.js';

export default function MenuRouter({className, basepath, routes, links}){
	let route = useRoutes(routes, { basePath: basepath});
	return (
		<div className={className || ''}>
		<Menu links={links} l='[' r=']' u={false}/>
			{route}
		</div>
	);
}
