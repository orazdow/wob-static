import React from 'react';
import List from './list.js';
import {Selector} from '../../components/wob-components.js';

function SelectMenu({onclick}){
	return(
		<div className="sidemenu">
		<li className="fakelink" value="a" onClick={onclick}>a</li>
		<li className="fakelink" value="b" onClick={onclick}>b</li>
		<li className="fakelink" value="c" onClick={onclick}>c</li>
		<li className="fakelink" value="" onClick={onclick}>&nbsp;&nbsp;</li>
		</div>
	)
}

export default function View(props){
	return(
		<div>
			<Selector Menu={SelectMenu} hash={true}>
			<List/>
			</Selector>
			{/*<List/>*/}
		</div>
	);
}