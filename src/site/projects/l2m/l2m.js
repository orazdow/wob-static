import React, {useEffect, useMemo, useRef} from 'react';
import * as g from './render.js';

const mouse = {x:0,y:0};
const obj = {v: null, i: null};
let rot, translate, proj, colors, scene, ww, wh, ctx, id, rect;

async function init(canvas, width, height){
	ww = width, wh = height;
	canvas.width = ww, canvas.height = wh;
	canvas.style.backgroundColor = '#5c5c5c';
	ctx = canvas.getContext('2d');
	rect = canvas.getBoundingClientRect();
	const lines = (await import("./lines.js")).default;
	obj.v = lines.v;
	obj.i = lines.e;
	// for(let v of obj.v){
		// v[0] *= 1.5
		// v[1] *= 1.5
		// v[0] -= 1
	// }
	rot = g.create_rot(.0, -0.03, -0.0);
	translate = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[mouse.x,mouse.y,0,1]];
	proj = g.create_proj(.7, .4 , .2);
	colors = { bkgd: 'darkslateblue', fill: 'darkslateblue', stroke: 'black' };
	scene = g.create_canvas_scene(ctx, ww, wh, colors, obj.v, obj.i, null, translate, null, proj);
	addEventListener('mousemove', onmousemove);
	addEventListener('touchmove', ontouchmove);
	addEventListener('keydown', onkeydown);
	
	id = setInterval(()=>{
        translate[3][0] = mouse.x*3;
        translate[3][1] = mouse.y*3; 
        translate[3][2] = 1;  
        scene.v_mat = g.lookAt( [-mouse.x*5, -mouse.y*5, -1.], [0,0, .5], .0);
        g.canvasrender(scene);
	}, 30);
}

function leave(){
	clearInterval(id);
	removeEventListener('mousemove', onmousemove);
	removeEventListener('touchmove', ontouchmove);
	removeEventListener('keydown', onkeydown);
}

function onmousemove(e){
    mouse.x = (2.*(e.clientX-rect.x)-ww)/wh;
    mouse.y = (2.*(e.clientY-rect.y)-wh)/wh;
}
function ontouchmove(e){
    mouse.x = (2.*(e.touches[0].clientX-rect.x)-ww)/wh;
    mouse.y = (2.*(e.touches[0].clientY-rect.y)-wh)/wh;
}
function onkeydown(e){
	if(e.key === " "){
		e.preventDefault();
		scene.r_mat = scene.r_mat ? 0 : rot;
	} 
}

export default function Disp({width, height}){
	const canvasRef = useRef();
	useEffect(()=>{
		if(canvasRef.current){
			const canvas = canvasRef.current;
			init(canvas, width, height);
			return leave;
		}
	}, [canvasRef]);

	return useMemo(() => {
		return(
			<canvas
				width={width}
				height={height}
				ref={canvasRef}
			/>
		);

	}, [canvasRef]);
}