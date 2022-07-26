import React from 'react';

import A from '/home/ollie/Documents/site/wob-static/src/site/a.js';
import B from '/home/ollie/Documents/site/wob-static/src/site/b.js';
import Index_c from '/home/ollie/Documents/site/wob-static/src/site/c/c.index.mdx';
import D from '/home/ollie/Documents/site/wob-static/src/site/c/d.mdx';
import E from '/home/ollie/Documents/site/wob-static/src/site/c/e.mdx';
import Index from '/home/ollie/Documents/site/wob-static/src/site/index.js';
import A_posts from '/home/ollie/Documents/site/wob-static/src/site/posts/a.mdx';
import B_posts from '/home/ollie/Documents/site/wob-static/src/site/posts/b.mdx';
import C from '/home/ollie/Documents/site/wob-static/src/site/posts/c.mdx';
import D_posts from '/home/ollie/Documents/site/wob-static/src/site/posts/d.mdx';
import E_posts from '/home/ollie/Documents/site/wob-static/src/site/posts/e.mdx';
import Index_posts from '/home/ollie/Documents/site/wob-static/src/site/posts/index.js';
import Tmp_template from '/home/ollie/Documents/site/wob-static/src/components/template.js';

const routes = {
    '/a': () => <A/>,
    '/b': () => <B/>,
    '/c': () => <Index_c/>,
    '/c/d': () => <D/>,
    '/c/e': () => <E/>,
    '/': () => <Index/>,
    '/posts/a': () => <A_posts/>,
    '/posts/b': () => <B_posts/>,
    '/posts/c': () => <C/>,
    '/posts/d': () => <D_posts/>,
    '/posts/e': () => <E_posts/>,
    '/posts': () => <Tmp_template><Index_posts/></Tmp_template>,
};

export default routes;