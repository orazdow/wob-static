import React, {useState, useEffect} from 'react';
import {Link} from 'raviger';

function Post(props){
	return(
		<li className="min post post-min">
            <h5 className="min heading">
            <Link className="min link" href={props.post.route}>{props.post.title}</Link>
            </h5>  
            <p className="min desc">{props.post.description}</p> 
            <p className="min date"><small>{props.post.date}</small></p>      
        </li>
    );
}

function Post_card(props){
	return(
		<Link className="min link" href={props.post.route}>
		<li className="min post post-min">
            <h5 className="min heading">
            {props.post.title}
            </h5>  
            <p className="min desc">{props.post.description}</p> 
            <p className="min date"><small>{props.post.date}</small></p>      
        </li>
        </Link>
    );
}

function Post_expand(props){
	const [max, setMax] = useState(false);
	const El = props.post.import;
	const cb = ()=>{setMax(!max);};
	return(
		max ?  <li onClick={cb}><El/></li> :
		<li className="min post post-min" onClick={cb}>
            <h5 className="min heading">
            <Link className="min link" href={props.post.route}>{props.post.title}</Link>
            </h5>  
            <p className="min desc">{props.post.description}</p> 
            <p className="min date"><small>{props.post.date}</small></p>      
        </li>
    );
}

function Post_max(props){
	const El = props.post.import;
	return(
		El ? <li><El/></li> : <Post post={props.post}/>
	);
}

function Post_static(props){
	return(
		<li className="min post post-min-static">
            <h5 className="min heading">
            <div className="min link">{props.post.title}</div>
            </h5>  
            <p className="min desc">{props.post.description}</p> 
            <p className="min date"><small>{props.post.date}</small></p>      
        </li>
    );
}

const post_map = {
	'title': Post, 
	'card': Post_card, 
	'expand': Post_expand, 
	'static-max': Post_max, 
	'static-min': Post_static
};

function filter(list, category) {
    return list.filter(el =>
        el.keywords && el.keywords.includes(category)
    );
}

function List(props){

	const arr = props.category ? 
		filter(props.list, props.category) : props.list;

	const list = arr.map((el) =>{ 
		const El = post_map[el.linkmode];
		return <El key={el.title} post={el}/>
	});

	return(
		<ul>{list}</ul>
	);
}

function Selector({children, Menu, hash}){
	useEffect(()=>{		
		window.addEventListener('popstate', event => { 
			setCategory(window.location.hash.substr(1)||'');
		});
	},[]);

	const [cat, setCategory] = useState(window.location.hash.substr(1)||'');

	const cb = (event) => {
		let val = event.target.getAttribute('value')||'';
		if(hash) window.location.hash = val;
		else setCategory(val);
	}

	return(
		<div>
		<Menu onclick={cb}/>
		{React.cloneElement(children, {category:cat})}
		</div>
	);
}

export{List as default, Post, Selector}