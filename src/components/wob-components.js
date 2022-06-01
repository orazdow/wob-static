import React, {useState, useEffect} from 'react';
import {Link} from 'raviger';

function Post(props){

	return(
		<li className="min post post-min" onClick={null}>
            <h5 className="min heading">
            <Link className="min link" href={props.post.route}>{props.post.title}</Link>
            </h5>  
            <p className="min desc">{props.post.description}</p> 
            <p className="min date"><small>{props.post.date}</small></p>      
        </li>
    );
}

function filter(list, category) {
    return list.filter(el =>
        el.keywords && el.keywords.includes(category)
    );
}

function List(props){

	const arr = props.category ? 
		filter(props.list, props.category) : props.list;

	const list = arr.map((el) =>{ 
		return <Post key={el.title} post={el}/>
	});

	return(
		<ul>{list}</ul>
	);
}

function Selector({children, Menu, hash}){
	useEffect(()=>{
		window.addEventListener('hashchange', event => { 
			setCategory(event.target.location.hash.substr(1)||'');
		});
	},[]);

	const [cat, setCategory] = useState(window.location.hash.substr(1)||'');

	const cb = (event) => {
		let val = event.target.getAttribute('value');
		setCategory(val);
		if(hash) window.location.hash = val;
	}

	return(
		<div>
		<Menu onclick={cb}/>
		{React.cloneElement(children, {category:cat})}
		</div>
	);
}

export{List as default, Post, Selector}