import React from 'react';
import Menu from './menu.js';


const links = [
	{name: 'Ollie Razdow', path: '/'}, 
	{name: 'projects', path: 'projects'},
	{name: 'about', path: 'about'},
	{name: '', path: 'http://www.github.com/orazdow', class: 'gh-logo'}
];

export default function Home(props){
	return(
		<div className="main-template">

			<Menu links={links} l="[" r="]"/>

			{props.children}

		</div>		
	);
}