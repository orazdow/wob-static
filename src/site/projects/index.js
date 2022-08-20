import React from 'react';
import {Link} from 'raviger';
import List from '/src/components/wob-components.js';

{/* @template  template.js  */}

const posts = [
    {
        "name": "Portaudio_Wrapper.md",
        "title": "Portaudio Wrapper",
        "linkmode": "title",
        "min": true,
        "route": "/projects/Portaudio_Wrapper",
        "timecode": 0
    },
    {
        "name": "soundlib.md",
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
