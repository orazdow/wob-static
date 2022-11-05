import React from 'react';

import About from '/home/ollie/Documents/site/wob-static/src/site/about.mdx';
import Index from '/home/ollie/Documents/site/wob-static/src/site/index.mdx';
import Delaunay_Triangulation from '/home/ollie/Documents/site/wob-static/src/site/projects/Delaunay_Triangulation.mdx';
import Index_projects from '/home/ollie/Documents/site/wob-static/src/site/projects/index.js';
import Line_to_model from '/home/ollie/Documents/site/wob-static/src/site/projects/line_to_model.mdx';
import Tmp_template from '/home/ollie/Documents/site/wob-static/src/components/template.js';

const routes = {
    '/about': () => <Tmp_template><About/></Tmp_template>,
    '/': () => <Tmp_template><Index/></Tmp_template>,
    '/projects/Delaunay_Triangulation': () => <Delaunay_Triangulation/>,
    '/projects': () => <Tmp_template><Index_projects/></Tmp_template>,
    '/projects/line_to_model': () => <Line_to_model/>,
};

export default routes;