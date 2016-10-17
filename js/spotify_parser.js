var parser = new SpotifyParser();
var generator = new TrackblasterGenerator();

var compile = function(){
    var src = $("#input").val().trim();
    var start_time =get_start_time(); 
    $(".download").hide();;
    $(".export-options").hide();
    if(start_time == null){
	return;
    }
    $(".converter").show();
    parser.parse(src,function(ir){
        console.log(ir);
        var result = generator.generate(ir,start_time);
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
var get_start_time = function(){
    var start_time = $("#start_time").timepicker();
    if(start_time == undefined || start_time == ""){
        return null;
    }
    else{
        
	var args = new Date(start_time.getTime());
        return new TimeCode(args.getHours(),args.getMinutes(),
                            0,0)
    }
}


$(document).ready(function(){
    $("#input").bind("input propertychange", function(){
        console.log("changed");
        compile();
    })
    $("#input_convert").click(function(){
        console.log("changed");
        compile();
    })
    $(".timepicker").timepicker({
	    timeFormat: 'h:mm p',
    	    change:function(){
		compile();
	    } 
    });
    
    $(".converter").hide();
    $(".download").hide();
    $(".export-options").hide();
    
    $("#download").click(function(){
	console.log("download");
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
