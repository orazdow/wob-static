import React from 'react';
import {Link} from 'raviger';
import List from '/src/components/wob-components.js';

{/* @template  template.js  */}

const posts = [
    {
        "name": "Delaunay_Triangulation.mdx",
        "title": "Delaunay Triangulation",
        "linkmode": "title",
        "min": true,
        "route": "/projects/Delaunay_Triangulation",
        "timecode": 0
    },
    {
        "name": "line_to_model.mdx",
        "title": "Line to Model",
        "linkmode": "title",
        "min": true,
        "route": "/projects/line_to_model",
        "timecode": 0
    },
    {
        "name": "Portaudio_Wrapper.mdx",
        "title": "Portaudio Wrapper",
        "linkmode": "title",
        "min": true,
        "route": "/projects/Portaudio_Wrapper",
        "timecode": 0
    },
    {
        "name": "soundlib.mdx",
        "title": "soundlib",
        "linkmode": "title",
        "min": true,
        "route": "/projects/soundlib",
        "timecode": 0
    }
];

export default function f(props){
    return(<List list={posts} category={props.category}/>);
}
