import React from 'react';
import {Link} from 'raviger';
import List from '/src/components/wob-components.js';
const posts = [
    {
        "name": "a.mdx",
        "title": "PortAudio Wrapper",
        "linkmode": "static-max",
        "date": "2019/07/05",
        "keywords": [
            "a",
            "b"
        ],
        "min": false,
        "route": "/posts/a"
    },
    {
        "name": "b.mdx",
        "title": "egg",
        "linkmode": "title",
        "min": true,
        "route": "/posts/b"
    },
    {
        "name": "c.mdx",
        "title": "blepp",
        "linkmode": "title",
        "min": true,
        "route": "/posts/c"
    },
    {
        "name": "d.mdx",
        "title": "d",
        "linkmode": "title",
        "min": true,
        "route": "/posts/d"
    },
    {
        "name": "e.mdx",
        "title": "e",
        "linkmode": "title",
        "min": true,
        "route": "/posts/e"
    }
];
export default function f(props){
return(<List list={posts} category={props.category}/>);
}
