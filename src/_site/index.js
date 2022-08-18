import React from 'react';
import {Link} from 'raviger';

export default function Home(props){
	return(
		<div className="center">
		<p>hii</p>
		<Link href="/a" >A</Link>
		<Link href="/b" >B</Link>
		<Link href="/f" >F</Link>
		<Link href="/posts" >Posts</Link>
		</div>
	);
}