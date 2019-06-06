var setToolType =function(newToolType){
	tooltype=newToolType;
}

normalEraser.addEventListener('click',function(){
	setToolType("eraser");
});

lineEraser.addEventListener('click',function(){
	setToolType("lineEraser");
});