import React from 'react';
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

function List(props){
	
	const list = props.list.map((el) =>{ 
		return <Post key={el.title} post={el}/>
	});

	return(
       <ul>{list}</ul>
	);
}


export{List as default, Post}