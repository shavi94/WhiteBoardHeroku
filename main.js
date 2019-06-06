var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var radius = 2;
var dragging = false;

context.lineWidth = radius*2;

var putPoint = function(e){
	if(dragging){
		context.lineTo(e.offsetX, e.offsetY);
		context.stroke();
		context.beginPath();
		context.arc(e.offsetX, e.offsetY, radius, 0, Math.PI*2);
		context.fill();
		context.beginPath();
		context.moveTo(e.offsetX, e.offsetY);
	}
}

var engage = function(e){
	dragging=true;
	putPoint(e);
	
}

var disengage = function(e){
	dragging=false;
	context.beginPath(); //remove this to make line with 2 points
	
}

canvas.addEventListener('mousedown',engage);
canvas.addEventListener('mousemove',putPoint);
canvas.addEventListener('mouseup',disengage);