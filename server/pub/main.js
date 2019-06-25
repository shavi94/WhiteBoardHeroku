var socket;
var drawing = false;
var erasing = false;
var erasingline = false;
var tooltype = "draw";
var arr = [];
var id = 0;

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var radius = 2;
var dragging = false;

context.lineWidth = radius*2;

var putPoint = function(e){
	if(dragging){
		if(tooltype == "draw"){
			if(e.touches!=undefined){
				if(event.touches.length == 1){ 
					let r = e.target.getBoundingClientRect();
					e.offsetX = e.touches[0].pageX - r.left;  
					e.offsetY = e.touches[0].pageY - r.top;
				}
			}
			setRadius(parseFloat(radSpan.innerHTML));
			setSwatch({target: document.getElementsByClassName('active')[0]});
			context.globalCompositeOperation = 'source-over';
			context.lineTo(e.offsetX, e.offsetY);
			context.stroke();
			context.beginPath();
			context.arc(e.offsetX, e.offsetY, radius, 0, Math.PI*2);
			context.fill();
			context.beginPath();
			context.moveTo(e.offsetX, e.offsetY);

			var data = {
				x: e.offsetX,
				y: e.offsetY,
				radius: radius,
				color: colorofline,
				state: drawing
			}
			socket.emit('mouse', data);

			var arrdata = [id, {
				x: e.offsetX,
				y: e.offsetY,
				rad: radius
			}];

			arr.push(arrdata);

			drawing = true;

		}else if(tooltype == "eraser"){
			if(e.touches!=undefined){
				if(event.touches.length == 1){ 
					let r = e.target.getBoundingClientRect();
					e.offsetX = e.touches[0].pageX - r.left;  
					e.offsetY = e.touches[0].pageY - r.top;
				}
			}
			context.globalCompositeOperation = 'destination-out';
			context.lineTo(e.offsetX, e.offsetY);
			context.stroke();
			context.beginPath();
			context.arc(e.offsetX, e.offsetY, radius, 0, Math.PI*2);
			context.fill();
			context.beginPath();
			context.moveTo(e.offsetX, e.offsetY);

			var data = {
				x: e.offsetX,
				y: e.offsetY,
				radius: radius,
				state: erasing
			}
			socket.emit('erase', data);

			erasing = true;

		}else if(tooltype == "lineEraser"){
			if(e.touches!=undefined){
				if(event.touches.length == 1){ 
					let r = e.target.getBoundingClientRect();
					e.offsetX = e.touches[0].pageX - r.left;  
					e.offsetY = e.touches[0].pageY - r.top;
				}
			}
			var arrId;
			for(var x=0; x<arr.length;x++){
				for(var l=0; l<5;l++){
					if((arr[x][1].x + l == e.offsetX && arr[x][1].y + l == e.offsetY)||
					(arr[x][1].x - l == e.offsetX && arr[x][1].y - l == e.offsetY)||
					(arr[x][1].x + l == e.offsetX && arr[x][1].y - l == e.offsetY)||
					(arr[x][1].x - l == e.offsetX && arr[x][1].y + l == e.offsetY)||
					(arr[x][1].x == e.offsetX && arr[x][1].y + l == e.offsetY)||
					(arr[x][1].x + l == e.offsetX && arr[x][1].y == e.offsetY)||
					(arr[x][1].x - l == e.offsetX && arr[x][1].y == e.offsetY)||
					(arr[x][1].x == e.offsetX && arr[x][1].y - l == e.offsetY)){
						console.log("found");
						arrId = arr[x][0];
						context.lineWidth = arr[x][1].rad*3;
					}
				}
			}

			for(var y=0; y<arr.length;y++){
				if(arr[y][0]==arrId){
					context.lineWidth = arr[y][1].rad*3;
					context.globalCompositeOperation = 'destination-out';
					context.lineTo(arr[y][1].x, arr[y][1].y);
					context.stroke();
					context.beginPath();
					context.arc(arr[y][1].x, arr[y][1].y, arr[y][1].rad*3, 0, Math.PI*2);
					context.fill();
					context.beginPath();
					context.moveTo(arr[y][1].x, arr[y][1].y);

					var data = {
						x: arr[y][1].x,
						y: arr[y][1].y,
						radius: arr[y][1].rad,
						state: erasingline
					}

					socket.emit('eraseline', data);

					erasingline = true;
				}
			}
		}
	}
}

var engage = function(e){
	context.beginPath();
	dragging=true;
	if(tooltype == "draw"){
		id++;
	}
	putPoint(e);
	
	
}

var disengage = function(e){
	dragging=false;
	drawing=false;
	erasing=false;
	erasingline = false;
	context.beginPath(); //remove this to make line with 2 points
	
}

canvas.addEventListener('mousedown',engage);
canvas.addEventListener('mousemove',putPoint);
canvas.addEventListener('mouseup',disengage);

canvas.addEventListener('touchstart',engage,false);
canvas.addEventListener('touchmove',putPoint,false);
canvas.addEventListener('touchend',disengage,false);