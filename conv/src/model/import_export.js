
function trackblaster_import(plaintext){
    throw "not implemented";
}

function spotify_import(plaintext){
    var links = plaintext.split("\n");
    var track_ids = [];
    links.forEach(function(link,i){
        var tokens = link.split("/");
        var track_id = tokens[tokens.length - 1];
        track_ids.push(track_id);
    });
    return track_ids;
}

function is_defined(token){
	return token != "" 
		&& token != null 
		&& token != undefined;
}
function itunes_import(playlist,plaintext){
    var tracks = plaintext.split("\r");
    for(var i=1; i < tracks.length; i++){   //start from 1 to skip the header
        var data = tracks[i].split("\t");
        var title = data[0];
        var artists = [data[1]];
        var album = data[3];
        var year = data[16];
	if(is_defined(title) && is_defined(data[1])){
        	track = new Track(title,artists,album, year);
        	playlist.add(track);
	}
    }
}

function trackblaster_export(playlist){
    var str = "";
    var delim = "\t";
    var endl = "\n";
    var header = ["Hidden","Break","Artist","ArtistLink","Composer","Song","Version","Album","Format","Label","LabelLink","Year","Misc","New","Comp","Comment"];

    str += header.join(delim)+endl;
    for(var i=0; i < playlist.tracks.length; i++){
        var track = playlist.tracks[i];
        var vals = ["0","0",track.artists,"","",
                    track.title,"",track.album,"","","",
                    track.year,"","",0,""];
        str += vals.join(delim)+endl;
    }
    return str;
}
