import React from 'react';
import {Link} from 'raviger';

const styles = {
	p:{
		'textAlign':'center',
		'marginTop':'10%'
	},
	link:{
		'textAlign': 'center',
		'fontSize':'4ch',
		'color':'blue',
		'margin':'20px'
	}
};

export default function Home(props){
	return(
		<div className="container">
		<p>hii</p>
		<Link href="/a" >A</Link>
		<Link href="/b" >B</Link>
		<Link href="/posts" >Posts</Link>
		</div>

	);
}