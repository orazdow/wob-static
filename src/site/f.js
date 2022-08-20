import React from 'react';
import {useRoutes, Link} from "raviger";
import MenuRouter from '../components/menurouter.js';

{/* @endpoint /f* */}
import Index from './index.js';
import A from './a.js';
import B from './b.js';
import Posts from './posts/index.js';

const routes = {
	'/': ()=> <Index/>,
	'/a': ()=> <A/>,
	'/b': ()=> <B/>, 
	'/posts': ()=> <Posts/>, 
};

const links = [
	{path: '/f', name: 'home'}, 
	{path: '/f/posts', name: 'posts'},
	{path: '/f/a', name: 'a'},
	{path: '/f/b', name: 'b'}
];

export default function F(props){
	return(
		<div className="center">
		<p> F </p>
		<hr/>
		<MenuRouter basepath='/f' routes={routes} links={links} className="center"/>
		<hr/>
		<p><Link href='/'>back</Link></p>
		
		</div>
	);
}
