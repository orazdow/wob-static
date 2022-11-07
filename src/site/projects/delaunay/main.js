const root = document.getElementById('root');
const canv = document.createElement('canvas');

let ww = 800, wh = 700; 
let d = Math.round(Math.max(wh-window.innerHeight,0)*.1)*10;
if(d){d += 46; ww -= d; wh -= d;}
canv.width = ww;
canv.height = wh;
canv.style.backgroundColor = '#5c5c5c';
root.appendChild(canv);
const ctx = canv.getContext('2d');

const p = document.createElement('p');
document.querySelector('body').appendChild(p);
p.innerHTML = 'press space to change view';

const mouse = {x: 0, y: 0};
const num = 30;
let ID, selected, hdots;
let loop = true, add = true, mousedown = false, view = 1;
let nodes = [];
let a = 0, b = 0;

const del = Delaunay;
del.init(ww, wh);
Perlin.noiseDetail(5, 0.3);

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

init();

function init(){
	for(let i = 0; i < num; i++) 
		nodes[i] = {x:0, y:0, vx: 0, vy: 0};
	ID = window.requestAnimationFrame(draw);
};

function loadPattern(imgpath, cb){
	let img = new Image(100,100);
	img.src = imgpath;
	img.onload = ()=>{
		createImageBitmap(img).then((img)=>{
			let pattern = ctx.createPattern(img, 'repeat');
			cb(pattern);
		}); 
	};
}

function repell(node){
	node.vx = lerp(node.vx, (Math.random()-.5)*5, .1);
	node.vy = lerp(node.vy, (Math.random()-.5)*5, .1);
	node.x += node.vx;
	node.y += node.vy;

	let d2 = Math.atan2(node.x-ww*.5, node.y-wh*.5);
	let d2b = Math.sqrt((node.x-ww*.5)*(node.x-ww*.5) + (node.y-wh*.5)*(node.y-wh*.5))*.005;
	node.x -= .5*Math.sin(d2)*d2b; 
	node.y -= .5*Math.cos(d2)*d2b;

	let d = Math.sqrt((node.x-mouse.x)*(node.x-mouse.x) + (node.y-mouse.y)*(node.y-mouse.y));
	let th = Math.atan2(node.x-mouse.x, node.y-mouse.y);
	let dx = 200*Math.sin(th); 
	let dy = 200*Math.cos(th);
	node.x +=dx/d; 
	node.y +=dy/d;	
}

window.onkeydown = (e)=>{
	if(e.key === ' '){
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

window.onmousemove = (e)=>{
	mouse.x = e.clientX;
	mouse.y = e.clientY;
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

window.onmousedown = (e)=>{
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

window.onmouseup = (e)=>{
	mousedown = false;
	// del.demo(ctx, view, hdots);
}

function lerp(a, b, n){
	return n*(b-a)+a;
}

function dist(ax, ay, bx, by){
	return Math.sqrt((ax-bx)*(ax-bx)+(ay-by)*(ay-by));
}