function Point(x,y)
{
	this.x = x;
	this.y = y;
}

function Point_neighbor(i,rel)
{
	switch(i)
	{
		case 0: //left
			return new Point(this.x+this.y-rel.y,this.y+rel.x-this.x);
		case 1: //up
			return new Point(2*this.x-rel.x,2*this.y-rel.y);
		case 2: //down
			return new Point(this.x+rel.y-this.y,this.y+this.x-rel.x);
	}
	return null;
}
Point.prototype.neighbor = Point_neighbor;

function init_Cell(w, h)
{
	var cells = new Array(w);
	Cell.prototype.cells = cells;
	Cell.prototype.w = w;
	Cell.prototype.h = h;
	for(var x=0;x<w;x++)
	{
		cells[x] = new Array(h);
		for(var y=0;y<h;y++)
			cells[x][y] = new Cell(new Point(x,y));
	}
}

function Cell(pt)
{
	this.pt = pt;
	this.cell = document.getElementById("grid").rows[pt.y].cells[pt.x];
	this.img = document.getElementById("grid_"+pt.x+"_"+pt.y);
	this.parent = null;
	this.children = new Array(null,null,null);
}

function Cell_number(rel)
{
	var px = this.pt.x-rel.x, py = this.pt.y-rel.y;
	l = ((this.children[0]==null)?0:1);
	u = ((this.children[1]==null)?0:1);
	r = ((this.children[2]==null)?0:1);
	if(px>0)
		return 1+2*l+4*u+8*r;
	if(px<0)
		return 4+8*l+u+2*r;
	if(py>0)
		return 2+4*l+8*u+r;
	return 8+l+2*u+4*r;
}
Cell.prototype.number = Cell_number;

function permutation(n)
{
	var i, j;
	var nums = new Array(n);
	var perm = new Array(0);
	for(i=0;i<n;i++)
		nums[i] = i;
	for(i=n;i>0;i--)
	{
		j = Math.floor(i*Math.random());
		perm.push(nums[j]);
		nums.splice(j,1);
	}
	return perm;
}

function Cell_grow(rel)
{
	var bs = permutation(3);
	var i;
	for(var j=0;j<3;j++)
	{
		i = bs[j];
		d = this.children[i];
		if(d==null)
		{
			var p = this.pt.neighbor(i,rel);
			var px = p.x, py = p.y;
			if(px>=0&&py>=0&&px<this.w&&py<this.h)
			{
				c = this.cells[px][py];
				if(c.parent==null)
				{
					this.children[i] = c;
					c.parent = this;
					c.cell.style.background = "transparent";
					this.cell.style.background ="transparent";
					this.img.src = "images/tree/"+this.number(rel)+".gif";
					return true;
				}
			}
		}
		else if(d.grow(this.pt))
			return true;
	}
	return false;
}
Cell.prototype.grow = Cell_grow;

function Cell_leaves(leaves)
{
	var i;
	var bs = permutation(3);
	var leaf = true;
	for(var j=0;j<3;j++)
	{
		i = bs[j];
		if(this.children[i]!=null)
		{
			leaf = false;
			this.children[i].leaves(leaves);
		}
	}
	if(leaf)
		leaves.push(this);
	return leaves;
}
Cell.prototype.leaves = Cell_leaves;

Butterfly.prototype.butterflies = new Array(0);
Butterfly.prototype.speed = 10.0;
Butterfly.prototype.flut = 0.9;
Butterfly.prototype.src = "images/butterfly.gif";
Butterfly.prototype.src_a = "images/butterfly_a.gif";
function Butterfly(id, home)
{
	this.i = this.butterflies.length;
	this.butterflies.push(this);
	this.div = document.getElementById(id);
	this.div.style.position = "relative";
	this.img = document.getElementById(id+"_img");
	//this.label = document.getElementById(id+"_label");
	this.home = home;
	this.loc = new Point(0,0);
	this.flying = false;
	this.pinned = false;
	this.timer = null;
	var link = document.getElementById(id+"_link");
	link.onmouseover = link_mouse_over;
	link.onmouseout = link_mouse_out;
}

function link_i(id)
{
	return id.substring(id.indexOf('_')+1, id.indexOf("_link"));
}

function link_mouse_over()
{
	Butterfly.prototype.butterflies[link_i(this.id)].mouse_over();
}

function link_mouse_out()
{
	Butterfly.prototype.butterflies[link_i(this.id)].mouse_out();
}

function Butterfly_mouse_over()
{
	//this.label.style.visibility = "visible";
	clearTimeout(this.timer); //don't flutter
	this.img.src = this.src_a;
	this.pinned = true;
	var x = this.butterflies;
	for(var i=0;i<x.length;i++)
	{
		if(i!=this.i)
			x[i].flutter();
	}
}
Butterfly.prototype.mouse_over = Butterfly_mouse_over;

function Butterfly_mouse_out()
{
	//this.label.style.visibility = "hidden";
	this.img.src = this.src;
	this.pinned = false;
	var x = this.butterflies;
	for(var i=0;i<x.length;i++)
			x[i].fly();
}
Butterfly.prototype.mouse_out = Butterfly_mouse_out;

function Butterfly_move(dx,dy)
{
	this.loc.x += dx;
	this.loc.y += dy;
	this.div.style.left = this.loc.x;
	this.div.style.top = this.loc.y;
}
Butterfly.prototype.move = Butterfly_move;

function Butterfly_fly()
{
	if(this.pinned)
		return;
	if(this.flying)
	{
		var dx = this.home.x-this.loc.x, dy = this.home.y-this.loc.y;
		var d = Math.sqrt(dx*dx+dy*dy);
		if(d>this.speed)
		{
			this.move(dx*this.speed/d,dy*this.speed/d);
			this.timer = setTimeout("Butterfly.prototype.butterflies["+this.i+"].fly()",100);
		}
		else
		{
			this.img.src = this.src;
			this.flying = false;
			this.timer = setTimeout("Butterfly.prototype.butterflies["+this.i+"].flutter()",Math.random()*30000);
		}
	}
	else
	{
		this.img.src = this.src_a;
		this.flying = true;
		this.timer = setTimeout("Butterfly.prototype.butterflies["+this.i+"].fly()",500);
	}
}
Butterfly.prototype.fly = Butterfly_fly;

function sign(x)
{
	if(x<0)
		return -1;
	return 1;
}

function Butterfly_flutter()
{
	if(this.pinned)
		return;
	if(this.flying)
	{
		var sx = sign(this.loc.x-this.home.x);
		var sy = sign(this.loc.y-this.home.y);
		var dx = sx*this.speed*Math.random();
		var dy = sy*Math.sqrt(this.speed*this.speed-dx*dx);
		this.move(dx,dy);
		if(Math.random()<=this.flut)
			this.timer = setTimeout("Butterfly.prototype.butterflies["+this.i+"].flutter()",100);
		else
			this.timer = setTimeout("Butterfly.prototype.butterflies["+this.i+"].fly()",100);
	}
	else
	{
		this.img.src = this.src_a;
		this.flying = true;
		this.timer = setTimeout("Butterfly.prototype.butterflies["+this.i+"].flutter()",500);
	}
}
Butterfly.prototype.flutter = Butterfly_flutter;

var timer, root, ground, timer2, begun=false;
var WIDTH = 5, HEIGHT = 5;

function no_grow()
{
	return false;
}

function init()
{
	init_Cell(WIDTH,HEIGHT);
	root = Cell.prototype.cells[2][4];
	root.parent = true;
	Cell.prototype.cells[2][3].grow = no_grow;
	ground = new Point(2,5);
	var x;
	for(i=0;i<5;i++)
	{
		x = new Butterfly("butterfly_"+i, new Point(0,-100));
		x.fly();
	}
	//timer = setTimeout("grow()",4000);
}

function start()
{
	if(!begun)
	{
		begun = true;
		grow();
	}
}

function grow()
{
	if(root.grow(ground))
		timer = setTimeout("grow()",100);
	else
	{
		var leaves = root.leaves(new Array(0));
		var pt, pts = new Array(5);
		var i;
		for(i=0; i<leaves.length; i++)
		{
			pt = leaves[i].pt;
			pts[i] = new Point((pt.x-i)*102,(pt.y-6)*102);
		}
		for(i=leaves.length; i<5; i++)
			pts[i] = new Point(0,0);
		var x = Butterfly.prototype.butterflies;
		for(i=0;i<5;i++)
		{
			x[i].home = pts[i];
			x[i].fly();
		}
	}
}

function stop()
{
	clearTimeout(timer);
	clearTimeout(timer2);
	var x = Butterfly.prototype.butterflies;
	for(var i=0;i<x.length;i++)
		clearTimeout(x[i].timer);
}
