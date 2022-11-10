import React, {useEffect, useMemo, useRef} from 'react';
import Perlin from './p5noise.js';
import Delaunay from './delaunay.js';

let ww, wh, ctx; 
let ID, selected, hdots, p;
let loop = true, add = true, mousedown = false, view = 1;
let nodes = [];
let a = 0, b = 0;
const del = Delaunay;
const mouse = {x: 0, y: 0}, rect = {x: 0, y: 0};
const num = 30;

function draw(){ 
	del.reset();
	a += 0.002; 
	for(let i = 0; i < num; i++){
		b+=0.00001;
		nodes[i].x = Perlin.noise(i+b, a)*ww*1.3;
		nodes[i].y = Perlin.noise(2000+i+b, 2000+a+b)*wh*1.3;
		// repell(nodes[i])
		del.add_point(nodes[i].x, nodes[i].y);
	}
	del.demo(ctx, view);
	ID = window.requestAnimationFrame(draw);
}

function start(){
	for(let i = 0; i < num; i++) 
		nodes[i] = {x:0, y:0, vx: 0, vy: 0};
	ID = window.requestAnimationFrame(draw);
};

function init(canvas, width, height){
	ctx = canvas.getContext('2d');
	ww = width;
	wh = height;
	canvas.width = ww;
	canvas.height = wh;
	canvas.style.backgroundColor = '#5c5c5c';
	let r = canvas.getBoundingClientRect();
	rect.x = Math.floor(r.x);
	rect.y = Math.floor(r.y);
	p = document.querySelector('#msg');
	p.innerHTML = 'press space to change view';
	del.init(ww, wh);
	Perlin.noiseDetail(5, 0.3);	
	addEventListener('keydown', onkeydown);
	canvas.addEventListener('mousedown', onmousedown);
	canvas.addEventListener('mouseup', onmouseup);
	addEventListener('mousemove', onmousemove);
	start();
}

function leave(canvas){ 
	window.cancelAnimationFrame(ID);
	removeEventListener('keydown', onkeydown);
	canvas.removeEventListener('mousedown', onmousedown);
	canvas.removeEventListener('mouseup', onmouseup);
	removeEventListener('mousemove', onmousemove);
}

function lerp(a, b, n){
	return n*(b-a)+a;
}

function dist(ax, ay, bx, by){
	return Math.sqrt((ax-bx)*(ax-bx)+(ay-by)*(ay-by));
}

function onkeydown(e){ 
	if(e.key === ' '){
		e.preventDefault();
		view = ++view % 8;
		if(view == 0){
			if(!loop){
				nodes = [];
				for(let i = 0; i < num; i++) nodes[i] = {x:0, y:0, vx: 0, vy: 0};
				ID = window.requestAnimationFrame(draw);
				p.innerHTML = 'press space to change view';
				loop = true;
			}
		}
		if(view > 3){
			if(loop){
				window.cancelAnimationFrame(ID);
				p.innerHTML = 'press space to change view (click to add points or drag to move)';
				loop = false;
				del.reset();
				nodes = [];
			} 
			del.demo(ctx, view, hdots);
		}
		// del.setHashV(view === 5);
	}
}

function onmousemove(e){ 
	mouse.x = e.clientX - rect.x;
	mouse.y = e.clientY - rect.y;

	if(mousedown && view > 3){ 
	    hdots = ((view == 4 || view == 7) && nodes.length < 3) ? nodes.slice(0, 2) : null;
		if(!add){
			selected.x = mouse.x; selected.y = mouse.y;
			del.reset();
			for(var i = 0; i < nodes.length; i++){
				del.add_point(nodes[i].x, nodes[i].y);
			}
			del.demo(ctx, view, hdots);
			// del.drawVCell(ctx, selected, '#5f5f5f');
		}
	}
}

function onmousedown(e){
	mousedown = true;
	if(view > 3){
		add = true;
		for(let i = 0; i < nodes.length; i++){
			if(dist(mouse.x, mouse.y, nodes[i].x, nodes[i].y) <= 12){ 
				add = false; 
				selected = nodes[i]; 
				break;
			}
		}
		if(add){
			nodes.push({x: mouse.x, y: mouse.y});	
			del.reset();
			for(let i = 0; i < nodes.length; i++){
				del.add_point(nodes[i].x, nodes[i].y);
			}
			hdots = ((view == 4 || view == 7) && nodes.length < 3) ? nodes.slice(0, 2) : null;
			del.demo(ctx, view, hdots);
		}
	}
}

function onmouseup(e){
	mousedown = false;
}

function Disp({width = 600, height = 500, style}){
	const canvasRef = useRef();
	useEffect(()=>{
		if(canvasRef.current){
			const canvas = canvasRef.current;
			init(canvas, width, height);
			return ()=>{
				leave(canvas);
			}
		}
	}, [canvasRef]);

	return useMemo(() => {
		return(
			<div>
			<canvas
				width={width}
				height={height}
				ref={canvasRef}
				style={style}
			/>
			<div id="msg" style={{fontSize: '15px'}}/>
			</div>
		);
	}, [canvasRef]);
}

export default Disp;