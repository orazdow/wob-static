import React from 'react';
import {Link} from 'raviger';
import List from '/src/components/wob-components.js';
const posts = [
    {
        "path": "/home/ollie/Documents/site/mdxtest_2/src/site/posts/a.mdx",
        "name": "a.mdx",
        "title": "dog in meadow",
        "linkmode": "static-max",
        "min": false,
        "route": "/posts/a"
    },
    {
        "path": "/home/ollie/Documents/site/mdxtest_2/src/site/posts/b.mdx",
        "name": "b.mdx",
        "title": "egg",
        "linkmode": "title",
        "min": true,
        "route": "/posts/b"
    },
    {
        "path": "/home/ollie/Documents/site/mdxtest_2/src/site/posts/c.mdx",
        "name": "c.mdx",
        "title": "blepp",
        "linkmode": "title",
        "min": true,
        "route": "/posts/c"
    },
    {
        "path": "/home/ollie/Documents/site/mdxtest_2/src/site/posts/d.mdx",
        "name": "d.mdx",
        "title": "d",
        "linkmode": "title",
        "min": true,
        "route": "/posts/d"
    },
    {
        "path": "/home/ollie/Documents/site/mdxtest_2/src/site/posts/e.mdx",
        "name": "e.mdx",
        "title": "e",
        "linkmode": "title",
        "min": true,
        "route": "/posts/e"
    }
];
export default function f(props){
return(<List list={posts}/>);
}
