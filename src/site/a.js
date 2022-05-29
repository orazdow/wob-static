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

export default function A(props){
	return(
		<div className="container">
		<p> A </p>
        <Link href="/" >Home</Link>
        <Link href="/B" >B</Link>
        </div>
	);
}
