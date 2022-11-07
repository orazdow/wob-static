/*========Delaunay=Triangulation========*/

// ((global)=>{

	var triangles, labels = 0, hashv = false, ww, wh, st;

	/*global.*/
	const Delaunay = {
		init: init,
		reset: reset,
		add_point: add_split,
		display: display,
		demo : demo,
		cell_coords: cell_coords,
		setNeighbors: setNeighbors,
		setHashV: setHashV,
		drawVLines: drawVLines,
		drawLine: drawLine,
		drawTriangle: drawTriangle,
		drawEllipse: drawEllipse,
		drawVCell: drawVCell,
		drawVCellPatt: drawVCellPatt,
		test: ()=>{console.log('yoyoyoyoyoyoyoy')}
	};
	export default Delaunay;
	// ---------------------------------------
	// init / clear
	// ---------------------------------------

	function init(w = 500, h = 500, _hashv = false){
		ww = w; wh = h;
		hashv = _hashv;
		triangles = new TriangleTable();
		st = Triangle(Node(-3000, wh+3000), Node(ww/2, -3000), Node(ww+3000, wh+3000));
		st.boundary = true;
		triangles.add(st);
	}

	function reset(){
		triangles.triangles = {};
		triangles.edgetriangles = {};
		triangles.vtriangles = {};
		triangles.add(st);
	}

	function setHashV(b){
		hashv = Boolean(b);
	}

	// ---------------------------------------
	// display 
	// ---------------------------------------

	function display(ctx, delaunay=true, voronoi, ellipse, c1='#000', c2='#f00', c3='#f00'){
		ctx.clearRect(0, 0, ww, wh);
		for(let key in triangles.triangles){
			let t = triangles.triangles[key];
			if(!t.boundary){    
				setNeighbors(t);
				if(delaunay){
					ctx.strokeStyle = c1;				 
					drawTriangle(ctx, t.a, t.b, t.c);
				}
				if(voronoi){
					ctx.strokeStyle = c2;
					drawVLines(ctx, t);
				}
				if(ellipse){
					ctx.strokeStyle = c3;
					drawEllipse(ctx, t.center.x, t.center.y, t.center.r);					
				}
			}
		}
	}

	function demo(ctx, mode, markers){
		ctx.clearRect(0, 0, ww, wh);
		for(let key in triangles.triangles){
			let t = triangles.triangles[key];
			if(!t.boundary){
				setNeighbors(t);
				if(mode !=1 && mode != 5){
					ctx.strokeStyle = '#fff';				 
					drawTriangle(ctx, t.a, t.b, t.c);
					if(mode == 0 ){
						let f = t.center.r; 
						ctx.fillStyle = `rgb(${f},${f},${f})`; 
						ctx.fill();
					}
				}
				if(mode == 3 || mode == 7){ 
					ctx.strokeStyle = '#ff283c';
					drawEllipse(ctx, t.center.x, t.center.y, t.center.r);
				}
			}
			if(mode == 1 || mode == 2 || mode == 5 || mode == 6){
				ctx.strokeStyle = '#ff283c';
				drawVLines(ctx, t)
			}
		}
		if(markers){
			ctx.strokeStyle = '#fff';
			for(let n of markers){
				drawEllipse(ctx, n.x, n.y, 2);
			}
		}	
	}

	function drawTriangle(ctx, a, b, c, stroke){
	    ctx.beginPath();
	    ctx.moveTo(a.x, a.y);
	    ctx.lineTo(b.x, b.y);
	    ctx.lineTo(c.x, c.y);
	    ctx.lineTo(a.x, a.y);
	    ctx.closePath();
	    ctx.stroke();
	}

	function drawEllipse(ctx, x, y, r){
	    ctx.beginPath();
	    ctx.arc(x, y, r, 0, 6.28318530718);
	    ctx.closePath();
	    ctx.stroke();
	}

	function drawLine(ctx, a, b){
		ctx.beginPath();
		ctx.moveTo(a.x, a.y);
		ctx.lineTo(b.x, b.y);
		ctx.closePath();
		ctx.stroke();
	}

	function drawVLines(ctx, t){
		drawEllipse(ctx, t.a.x, t.a.y, 3); 
		drawEllipse(ctx, t.b.x, t.b.y, 3); 
		drawEllipse(ctx, t.c.x, t.c.y, 3);
		if(t.ta){
			drawLine(ctx, t.center, t.ta.center);
			drawLine(ctx, t.center, t.tb.center);
			drawLine(ctx, t.center, t.tc.center);
		}
	}

	function drawVCell(ctx, node, fill = '#00f', stroke){
		let arr = cell_coords(node);
		ctx.beginPath();
		ctx.fillStyle = fill;
		ctx.strokeStyle = stroke;
		for(let p of arr)
			ctx.lineTo(p.center.x, p.center.y);

		ctx.closePath();
		ctx.fill();
		if(stroke) ctx.stroke();
	}

	function drawVCellPatt(ctx, node, pattern, matrix, stroke){ 
		let arr = cell_coords(node);
		ctx.beginPath();
		ctx.strokeStyle = stroke;
		ctx.fillStyle = pattern;
		for(let p of arr)
			ctx.lineTo(p.center.x, p.center.y);

		ctx.closePath();
		if(pattern && matrix)
			pattern.setTransform(matrix.translate(node.x-30,node.y-80));
		ctx.fill();
		if(stroke) ctx.stroke();
	}
	
	//-------------------------------------------
	// add point
	//-------------------------------------------

	// add points and split edges
	function add_split(x, y){
		let t = null;
	    let n = Node(x, y); 
	    let index = null;
		let keys = Object.keys(triangles.triangles);	
		for (let i =  keys.length-1; i >= 0; i--){
			if(isInTriangle(n, triangles.triangles[keys[i]])){
	 			t = triangles.triangles[keys[i]]; 
	 			index = i; 
	 			break;
	 		}
		}
	    if(t){ 
			let a = t.a; 
			let b = t.b; 
			let c = t.c;
			if(n.x === a.x && n.y === a.y){return} //same point

			if(index > 0) //dont delete supertriangle
				triangles.remove(t); 

			let ta = Triangle(n, a, b); 
			let tb = Triangle(n, b, c); 
			let tc = Triangle(n, a, c); 

			triangles.add(ta);
			triangles.add(tb);
			triangles.add(tc);

			check(ta, a, b);
			check(tb, b, c);
			check(tc, a, c);
	    }
	}

	//----------------------------------------------------------------

	// check triangle with neigbor for delaunay condition
	// https://www.ti.inf.ethz.ch/ew/Lehre/CG13/lecture/Chapter%207.pdf	
	function check(triA, a, b){
		let p = getOppositePoint(triA, a, b); 
		   
		let triB = triangles.getNeighbor(triA, a, b);
		if(!triB) return;

		let d = getOppositePoint(triB, a, b); 
	   
		if(isDelaunay(triA, d)){
			triA.boundary = isBoundary(triA, st);
			return;
		}

		triangles.remove(triA);
		triangles.remove(triB); 

		let t1 = Triangle(p, a, d);
		let t2 = Triangle(p, b, d);

		triangles.add(t1);
		triangles.add(t2);
	 	
	 	check(t1, a, d);
	 	check(t2, b, d);    
	}

	function Node(x, y){
		return {x: x, y: y, label: ++labels};	
	}

	function Triangle(nodea, nodeb, nodec){
		let circ = circumCenter(nodea, nodeb, nodec);
		return{
			a: nodea, b: nodeb, c: nodec,
			center: {x: circ[0], y: circ[1], r: circ[2]},
			label: ++labels,
			boundary: false
		}
	}

	function getOppositePoint(t, a, b){
		if(t.a !== a && t.a !== b) return t.a;	
	    else if(t.b !== a && t.b !== b) return t.b;
		else if(t.c !== a && t.c !== b) return t.c;
		else return null;		
	}

	function setNeighbors(t){
		t.ta = triangles.getNeighbor(t, t.a, t.b);
		t.tb = triangles.getNeighbor(t, t.b, t.c);
		t.tc = triangles.getNeighbor(t, t.a, t.c);
	}

	// http://totologic.blogspot.fr/2014/01/accurate-point-in-triangle-test.html
	function isInTriangle(point, triangle){
		let x = point.x,
		y = point.y,
		x1 = triangle.a.x, 
		x2 = triangle.b.x, 
		x3 = triangle.c.x,
		y1 = triangle.a.y, 
		y2 = triangle.b.y, 
		y3 = triangle.c.y;
		let a = ((y2 - y3)*(x - x3) + (x3 - x2)*(y - y3)) / ((y2 - y3)*(x1 - x3) + (x3 - x2)*(y1 - y3));
		let b = ((y3 - y1)*(x - x3) + (x1 - x3)*(y - y3)) / ((y2 - y3)*(x1 - x3) + (x3 - x2)*(y1 - y3));
		let c = 1 - a - b;
		return ( (0 <= a && a <= 1) && (0 <= b && b <= 1) && (0 <= c && c <= 1) );
	}

	// https://www.ics.uci.edu/~eppstein/junkyard/circumcenter.html
	// https://en.wikipedia.org/wiki/Circumscribed_circle
	function circumCenter(a, b, c){
		let D = (a.x - c.x) * (b.y - c.y) - (b.x - c.x) * (a.y - c.y);

		let pX = (((a.x - c.x) * (a.x + c.x) + (a.y - c.y) * (a.y + c.y)) / 2 * (b.y - c.y) 
		     -  ((b.x - c.x) * (b.x + c.x) + (b.y - c.y) * (b.y + c.y)) / 2 * (a.y - c.y)) / D;

		let pY = (((b.x - c.x) * (b.x + c.x) + (b.y - c.y) * (b.y + c.y)) / 2 * (a.x - c.x)
		     -  ((a.x - c.x) * (a.x + c.x) + (a.y - c.y) * (a.y + c.y)) / 2 * (b.x - c.x)) / D;
		    
		let r = dist(pX, pY, a.x, a.y);
		return [pX, pY, r];    
	}

	function dist(ax, ay, bx, by){
		return Math.sqrt((ax-bx)*(ax-bx)+(ay-by)*(ay-by));
	}

	function isDelaunay(tri, point){
		return ((dist(tri.center.x, tri.center.y, point.x, point.y)-tri.center.r) >= 0);
	}

	function isBoundary(t1, t2){
		return t1.a === t2.a || t1.b === t2.a || t1.c === t2.a || t1.a === t2.b 
		|| t1.b === t2.b || t1.c === t2.b || t1.a === t2.c || t1.b === t2.c || t1.c === t2.c;
	}

	function inTArray_splice(arr, t){
		for(let i = 0; i < arr.length; i++){
			if(t.label == arr[i].label){
				arr.splice(i,1);
				return true;
			}
		}	return false;
	}

	function cell_coords(pivot){
		let arr = triangles.getV(pivot);
		if(!arr) return [];
		let coords = [arr.pop()];
		let t = coords[0];
		setNeighbors(t);
		while(arr.length > 0){
			if(inTArray_splice(arr, t.ta)){
				t = t.ta;
				coords.push(t);
				setNeighbors(t);
			}
			else if(inTArray_splice(arr, t.tb)){
				t = t.tb;
				coords.push(t);
				setNeighbors(t);
			}
			else if(inTArray_splice(arr, t.tc)){
				t = t.tc;
				coords.push(t);
				setNeighbors(t);
			}
		}
		return coords;
	}

	function edge_hashkey(a,b){
		return a > b ? a+'_'+b : b+'_'+a;
	}

	// can lookup triangles, edge neigbors and vertex adjacent triangles
	function TriangleTable(){
		this.triangles = {};
		this.edgetriangles = {};
		this.vtriangles = {};

		//hashes triangle and edges
		this.add = function(t){
			let key = t.a.label+'_'+t.b.label+'_'+t.c.label;   
			this.triangles[key] = t;

			let edgekeys = [
				edge_hashkey(t.a.label,t.b.label),
				edge_hashkey(t.b.label,t.c.label),
				edge_hashkey(t.c.label,t.a.label)
			];
		 
			for(let i = 0; i < 3; i++){
				if(this.edgetriangles[edgekeys[i]] === undefined)
					this.edgetriangles[edgekeys[i]] = []; 	
			  	if(this.edgetriangles[edgekeys[i]].length < 2)
			  		this.edgetriangles[edgekeys[i]].push(t);
			}

			if(hashv){
				let vkeys = [
					t.a.x+'_'+t.a.y,
					t.b.x+'_'+t.b.y,
					t.c.x+'_'+t.c.y
				];
			 
				for(let i = 0; i < 3; i++){
					if(this.vtriangles[vkeys[i]] === undefined)
						this.vtriangles[vkeys[i]] = []; 	
			  		this.vtriangles[vkeys[i]].push(t);
				}
			}
	  
		}

		this.getV = function(node){
			let key = node.x+'_'+node.y;
			return this.vtriangles[key];
		}

		//returns triangle 
		this.get = function(t){
			let key = t.a.label+'_'+t.b.label+'_'+t.c.label;   
		 	return this.triangles[key];
		}

		// returns array
		this.getAtEdge = function(a, b){
		     return this.edgetriangles[edge_hashkey(a.label,b.label)];
		}

		//returns neighbor opposite ab   
		this.getNeighbor = function(t, a, b){
			let key = edge_hashkey(a.label,b.label)
			let e = this.edgetriangles[key];
			for (let i = e.length-1; i >= 0; i--) {
				if(e[i] !== t){
					return e[i];
				}
			}
		}

		//unhashes triangle
		this.remove = function(t){
			let key = t.a.label+'_'+t.b.label+'_'+t.c.label;   
			delete this.triangles[key];  


			let edgekeys = [
				edge_hashkey(t.a.label,t.b.label),
				edge_hashkey(t.b.label,t.c.label),
				edge_hashkey(t.c.label,t.a.label)
			];

			for(let i = 0; i < 3; i++){
				if(this.edgetriangles[edgekeys[i]])	
					for(let j = this.edgetriangles[edgekeys[i]].length; j >= 0; j--){
						if(this.edgetriangles[edgekeys[i]][j] === t){ 
							this.edgetriangles[edgekeys[i]].splice(j, 1); break;}	 
					}
			}

			if(hashv){
				let vkeys = [
					t.a.x+'_'+t.a.y,
					t.b.x+'_'+t.b.y,
					t.c.x+'_'+t.c.y
				];

				for(let i = 0; i < 3; i++){
					if(this.vtriangles[vkeys[i]])	
						for(let j = this.vtriangles[vkeys[i]].length; j >= 0; j--){
							if(this.vtriangles[vkeys[i]][j] === t){ 
								this.vtriangles[vkeys[i]].splice(j, 1); break;}			
						}
				}
			}
		
		}
	}

// })(window);