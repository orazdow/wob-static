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
		<div>
		hii
		<Link href="/a" style={styles.link}>A</Link>
		<Link href="/b" style={styles.link}>B</Link>
		<Link href="/posts" style={styles.link}>Posts</Link>
		</div>

	);
}