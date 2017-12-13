//Click on X to delete Todo
$("li").on("click", "span", function(event){
  var li = $(this)
  var id = $(this).attr("id")
	$.ajax({
    method: "DELETE",
    url: "/budget/" + id,
    success: function(date) {
      $(li).parent().fadeOut(500,function(){
    		$(li).remove();
    	});
      console.log(org)
    	event.stopPropagation();
      location.reload();
    },
    error: function(err) {
      alert("AJAX Call Error: " + err.responseText)
    }
  })
	event.stopPropagation();
});
