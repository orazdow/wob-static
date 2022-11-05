import React, {useEffect, useMemo, useRef} from 'react';
import * as g from './render.js';

async function loadModel(width, height, canvas){
	const lines = (await import("./lines.js")).default;
	const ww = width, wh = height;
	const ctx = canvas.getContext('2d');
	canvas.width = ww; canvas.height = wh;
	canvas.style.backgroundColor = '#5c5c5c';
	let obj_v = lines.v;
	let obj_i = lines.e;
	for(let v of obj_v){
		v[0] *= 1.5
		v[1] *= 1.5
		v[0] -= 1
	}

	const mouse = {x:0,y:0};
	window.onmousemove = (e)=>{
	    mouse.x = (2.*e.clientX-ww)/wh;
	    mouse.y = (2.*e.clientY-wh)/wh;
	}
	window.ontouchmove = (e)=>{
	    mouse.x = (2.*e.touches[0].clientX-ww)/wh;
	    mouse.y = (2.*e.touches[0].clientY-wh)/wh;
	}

	document.onkeydown = (e)=>{
    	if(e.key === " ") scene.r_mat = scene.r_mat ? 0 : rot;
	}

	let rot = g.create_rot(.0, -0.03, -0.0);
	// obj_v = g.mat_mul_4(obj_v, g.create_rot(0.2, -0.5, 0.7));
	let translate = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[mouse.x,mouse.y,0,1]];
	let proj = g.create_proj(.7, .4 , .2);
	let colors = { bkgd: 'darkslateblue', fill: 'darkslateblue', stroke: 'black' };
	let scene = g.create_canvas_scene(ctx, ww, wh, colors, obj_v, obj_i, null, translate, null, proj);

	let t = 0;
	window.setInterval(()=>{
        translate[3][0] = mouse.x*3;
        translate[3][1] = mouse.y*3; 
        translate[3][2] = 1;  
        scene.v_mat = g.lookAt( [-mouse.x*5, -mouse.y*5, -1.], [0,0, .5], .0);
        // translate[3][0] = mouse.x*2-2;
        // translate[3][1] = mouse.y*3; 
        // translate[3][2] = 3;  
        // scene.v_mat = g.lookAt( [-mouse.x, -mouse.y, -.0], [-1, 0, .5], 1);
        g.canvasrender(scene, (t++)*.1);
	}, 30);
}

function Disp({width, height}){

	const canvasRef = useRef();

	useEffect(()=>{

		if(canvasRef.current){
			loadModel(width, height, canvasRef.current);
		}

	}, [canvasRef]);

	return useMemo(() => {
		return(
			<canvas
				width={width}
				height={height}
				style={{ width: '100%', height: '100%' }}
				ref={canvasRef}
			/>
		);

	}, [canvasRef]);
}

export default Disp;