openFormPollBtn.addEventListener('click',function(){
    document.getElementById("myForm").style.display = "block";
    
    $("#question").val("");
    $("#opt1").val("");
    $("#opt2").val("");
    $("#opt3").val("");

});

closePoll.addEventListener('click',function(){
    document.getElementById("myForm").style.display = "none";
});

closechart.addEventListener('click',function(){
    $('#chartDiv').hide();
	$('#pollresults').hide();
});

sharechart.addEventListener('click',function(){
    socket.emit('share graph',arraytoshare,layoutshare);
    $('#chartDiv').hide();
    $('#pollresults').hide();
    $('#chatWindow').append('<p><small><em>You have share the vote graph</em><small></p>');
    scrollDown();
})