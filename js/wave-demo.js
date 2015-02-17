// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();


function ObjManager()
{
	this.init = function()
	{
		this.objs = 
		{
			terrain:new Terrain()
			//shadow:new MascotShadow(),
			//body:new MascotBody(),
			//head:new MascotHead(),
		};

		for (var property in this.objs ) {
		    if (this.objs.hasOwnProperty(property)) {
		        
		        var obj = this.objs[property];
		        obj.init();
		    }
		}
	}

	this.update = function()
	{
		for (var property in this.objs ) {
		    if (this.objs.hasOwnProperty(property)) {
		        
		        var obj = this.objs[property];

		        if (  'update' in obj ) {
		        	obj.update();
		        }
		    }
		}
	}

	this.draw = function()
	{
		for (var property in this.objs ) {
		    if (this.objs.hasOwnProperty(property)) {
		        
		        var obj = this.objs[property];

		        if (  'draw' in obj ) {
		        	obj.draw();
		        }
		    }
		}
	}

	this.get = function( a_name )
	{
		return this.objs[a_name];
	}
}

function Terrain()
{
	this.init = function()
	{
		this.numPts = 16;
		this.pts = new Array(this.numPts);

		for ( var i = 0; i < this.numPts; i+=1 )
		{
			this.pts[i] = {x:0,y:0};
		}
	};

	this.updatePts = function()
	{
		var screenWidth = g_canvas.width;
		var screenHeight = g_canvas.height;

		var numPts = this.numPts;
		var deltaX = screenWidth / (numPts-1);
		var heightBase = screenHeight * 0.15;
		var time = g_time * 0.5;

		for ( var i = 0; i < numPts; i+=1 )
		{
			//var yRand = noise.simplex2(i*0.2, time) *0.5 + 0.5;

			var posX = deltaX * i;

			var yRand = Math.sin( posX*0.005 + time*4.0 ) * 0.5+0.5;
			var posY = screenHeight - yRand * heightBase;

			var pt = this.pts[i];
			pt.x = posX;
			pt.y = posY;
		}
	};

	this.update = function()
	{
		this.updatePts();
	};

	this.draw = function()
	{
		var screenWidth = g_canvas.width;
		var screenHeight = g_canvas.height;

		var numPts = this.numPts;
		var deltaX = screenWidth / numPts;
		var heightBase = screenHeight * 0.3;
		var time = g_time * 0.5;

		g_ctx.fillStyle = '#74CED9';
		g_ctx.strokeStyle = 'white';
		g_ctx.lineWidth = 7;
		g_ctx.beginPath();
		g_ctx.moveTo( screenWidth, screenHeight );
		g_ctx.lineTo( 0, screenHeight );

		for ( var i = 0; i < numPts; i+=1 )
		{
			var pt = this.pts[i];
			g_ctx.lineTo(pt.x, pt.y);
		}

		g_ctx.closePath();
		g_ctx.fill();
		g_ctx.stroke();

		// draw line
		g_ctx.beginPath();
		g_ctx.moveTo( this.pts[0].x, this.pts[0].y );
		for ( var i = 0; i < numPts; i+=1 )
		{
			var pt = this.pts[i];
			g_ctx.lineTo(pt.x, pt.y+17.0);
		}
		g_ctx.stroke();
		g_ctx.lineWidth = 1;
	};
}

var g_canvas = document.getElementById("draw-area");
var g_ctx = g_canvas.getContext("2d");
var g_dt = 1.0 / 60.0;
var g_time = 0.0;

// objs
var g_objs = new ObjManager();
g_objs.init();

function resizeCanvas() {
	if ( g_canvas.width != window.innerWidth || g_canvas.height != window.innerHeight)
	{
    	g_canvas.width = window.innerWidth;
    	g_canvas.height = window.innerHeight;
    }
}

/******************/

function render()
{
	g_ctx.fillStyle="#fff";
	var height_val = document.getElementById('client_outer');
	g_ctx.fillRect(0,0, height_val.width, height_val.height);

	g_objs.update();
	g_objs.draw();
}

(function animloop(){
  requestAnimFrame(animloop);
  resizeCanvas();
  render();
  g_time += g_dt;
})();