import React from 'react';
import {Link} from 'raviger';

export default function A(props){
	return(
		<div className="center">
		<p> A </p>
        <Link href="/" >Home</Link>
        <Link href="/B" >B</Link>
        </div>
	);
}
