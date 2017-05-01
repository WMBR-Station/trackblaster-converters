var parser = new SpotifyParser();
var generator = new TrackblasterGenerator();

var compile = function(){
    var src = $("#input").val().trim();
    $(".download").hide();;
    $(".export-options").hide();
    $(".converter").show();
    parser.parse(src,function(ir){
        var result = generator.generate(ir);
        $("#output").val(result);
	      $(".download").show();
    	  $(".export-options").show();
    });
}
var update = function(){
    	var start_time =get_start_time(); 
	ir = parser.get_ir();
	var result = generator.generate(ir,start_time);
	$("#output").val(result);

}

$(document).ready(function(){
    $("#input").bind("input propertychange", function(){
        compile();
    })
    $("#input_convert").click(function(){
        compile();
    })
    
    $(".download").hide();
    $(".export-options").hide();
    
    $("#download").click(function(){
	      download($("#output").val(),"trackblaster.tab","text/plain")
    });

    $(".export").click(function(){
	      if($(this).hasClass("disabled")){
		        $(this).removeClass("disabled");
		        generator.set_export($(this).attr("field"),true);
		        update();
	      }
	      else{
		        $(this).addClass("disabled");
		        generator.set_export($(this).attr("field"),false);
		        update();
	      }
    });
})
