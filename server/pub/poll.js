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
