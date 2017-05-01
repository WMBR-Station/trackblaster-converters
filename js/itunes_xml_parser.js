var grammar = null;
var parser = new ItunesXMLParser();;
var generator = new TrackblasterGenerator();

var compile = function(){
    $(".converter").show();
    var src = $("#input").val().trimRight();
    $("#output").html("");
    $(".download").hide();
    $(".export-options").hide();
    if(src == ""){
	return;
    }
    try{
        var ir = parser.parse(src);
        console.log("IR",ir);
        var result = generator.generate(ir);
        $("#output").val(result);
        $(".debug").hide();;
        $(".download").show();
    	$(".export-options").show();
    }
    catch(err){
        console.log(err)
        var loc2str = function(loc){
            return loc.line + ":"+loc.column
        }
        var debug = $(".debug").show();
        $("#output").val("");
        if(err.location != undefined && err.message != undefined){
            var start_loc = loc2str(err.location.start)
            var end_loc = loc2str(err.location.end)
            $(".start-loc",debug).html(start_loc);
            $(".end-loc",debug).html(end_loc);
            $(".title",debug).html(err.name)
            $(".message",debug).html(err.message);
        }
        else{
            $(".message",debug).html(err);
        }
    }
}

var update = function(){
	compile();
}



var read_file = function(){
    input = $("#file")[0];
    file = input.files[0];
    reader = new FileReader();
    reader.onload = function(data){
        console.log(reader.result);
        $("#input").html(reader.result);
        compile();
    }
    reader.readAsText(file,'utf8');
}

$(document).ready(function(){
    $(".converter").hide();
    $(".download").hide();
    $(".export-options").hide();
    
    $("#input").bind("input propertychange", function(){
        console.log("changed");
        compile();
    })
    
    $("#file").change(function(){
        read_file();
    })
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
