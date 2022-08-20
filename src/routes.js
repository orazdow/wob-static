import React from 'react';

import About from '/home/ollie/Documents/site/wob-static/src/site/about.mdx';
import Index from '/home/ollie/Documents/site/wob-static/src/site/index.mdx';
import Indexx from '/home/ollie/Documents/site/wob-static/src/site/indexx.js';
import Portaudio_Wrapper from '/home/ollie/Documents/site/wob-static/src/site/projects/Portaudio_Wrapper.md';
import Index_projects from '/home/ollie/Documents/site/wob-static/src/site/projects/index.js';
import Soundlib from '/home/ollie/Documents/site/wob-static/src/site/projects/soundlib.md';
import Tmp_template from '/home/ollie/Documents/site/wob-static/src/components/template.js';

const routes = {
    '/about': () => <Tmp_template><About/></Tmp_template>,
    '/': () => <Tmp_template><Index/></Tmp_template>,
    '/indexx': () => <Tmp_template><Indexx/></Tmp_template>,
    '/projects/Portaudio_Wrapper': () => <Portaudio_Wrapper/>,
    '/projects': () => <Tmp_template><Index_projects/></Tmp_template>,
    '/projects/soundlib': () => <Soundlib/>,
};

export default routes;