
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
