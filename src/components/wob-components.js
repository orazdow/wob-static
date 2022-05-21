import React from 'react';
import {Link} from 'raviger';

function Post(props){
	// const [min, setmin] = useState(props.post.min);
	return(
		<li className="post post-min" onClick={null}>
            <h5 className="min-heading">
            <Link href={props.post.route}>{props.post.title}</Link>
            </h5>  
            <p className="min-desc">{props.post.description}</p> 
            <p className="min-date"><small>{props.post.date}</small></p>      
        </li>
    );
}

function List(props){
	const list = props.list.map((el) =>{ return <Post key={el.title} post={el}/>});
	return(
       <ul>
       	{list}
       </ul>
	);
}

export{/*Post, */List as default};