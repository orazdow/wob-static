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

export default function B(props){
	return(
		<div>
		<p style={styles.p}> B </p>
        <Link href="/" style={styles.link}>Home</Link>
        <Link href="/A" style={styles.link}>A</Link>
        <Link href="/C" style={styles.link}>C</Link>
        <a href="/"> yo</a>
        </div>
	);
}