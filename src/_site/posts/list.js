import React from 'react';
import {Link} from 'raviger';
import List from '/src/components/wob-components.js';

const posts = [
    {
        "name": "a.mdx",
        "title": "PortAudio Wrapper",
        "linkmode": "title",
        "date": "2019/07/05 2:15pm",
        "keywords": [
            "a",
            "b"
        ],
        "min": true,
        "route": "/posts/a",
        "timecode": 1562361300000
    },
    {
        "name": "d.mdx",
        "title": "d",
        "linkmode": "title",
        "date": "2019/07/05 2:00 pm",
        "min": true,
        "route": "/posts/d",
        "timecode": 1562360400000
    },
    {
        "name": "c.mdx",
        "title": "blepp",
        "linkmode": "title",
        "min": true,
        "route": "/posts/c",
        "timecode": 0
    },
    {
        "name": "e.mdx",
        "title": "e",
        "linkmode": "title",
        "min": true,
        "route": "/posts/e",
        "timecode": 0
    },
    {
        "name": "b.mdx",
        "title": "egg",
        "linkmode": "title",
        "min": true,
        "route": "/posts/b",
        "timecode": 0
    }
];

export default function f(props){
    return(<List list={posts} category={props.category}/>);
}
