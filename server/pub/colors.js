var swatches = document.getElementsByClassName('swatch');
var colorofline;

for(var i=0; i<swatches.length; i++){
	swatches[i].addEventListener('click',setSwatch);
	
}

function setColor(color){
	colorofline = color;
	context.fillStyle = color;
	context.strokeStyle = color;
	tooltype="draw";
	var active = document.getElementsByClassName('active')[0];
	
	if(active){
		active.className = 'swatch';
	}
}

function setSwatch(e){
	var swatch = e.target;
	setColor(swatch.style.backgroundColor);
	swatch.className += ' active';
}

setSwatch({target: document.getElementsByClassName('active')[0]});