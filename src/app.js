import {createRoot} from 'react-dom/client';
import React, {useEffect} from 'react';
import {useRoutes} from 'raviger';
import routes from './routes.js'
import './css/global.scss';

function App(props){
	let route = useRoutes(routes);

	return(
		<div>
        {route}
		</div>
	);
} 

// document.body.style.backgroundColor = 'darkslateblue';
const root = createRoot(document.getElementById('root'));
root.render(<App/>);