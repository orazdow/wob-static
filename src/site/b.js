import React from 'react';
import {Link} from 'raviger';

export default function B(props){
	return(
		<div className="center">
		<p > B </p>
        <Link href="/" >Home</Link>
        <Link href="/A" >A</Link>
        <Link href="/C" >C</Link>
        <a href="/"> yo</a>
        </div>
	);
}