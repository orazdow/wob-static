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
		<div className="container">
		<p > B </p>
        <Link href="/" >Home</Link>
        <Link href="/A" >A</Link>
        <Link href="/C" >C</Link>
        <a href="/"> yo</a>
        </div>
	);
}