var parser = new SpotifyParser();
var generator = new TrackblasterGenerator();

var compile = function(){
    var src = $("#input").val().trim();
    $(".download").hide();;
    $(".export-options").hide();
    $("#output").html("");
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

var open_profanity_checker = function(data){
  var encode_data = encodeURIComponent(data)
  var base_url = "profanity.html?playlist="+encode_data
  var win = window.open(base_url,"_blank")
  win.focus()
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

    $('#profanity').click(function(){
       open_profanity_checker($("#output").val());
    })
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
