
var LyricStatus = {
    UPLOADED: "uploaded",
    UNAVAILABLE: "unavailable",
    VALIDATED: "validated",
    ANALYZED: "analyzed"
}
var Status = {
    SUCCESS: "success",
    FAILURE: "failed",
    INPROGRESS: "in_progress",
    PENDING: "pending"
}


class Lyrics {
    constructor(){
        this.lyrics = [];
        this.annotations = {};
        this.status = LyricStatus.UNAVAILABLE;
        this.severity = ProfanityLevel.UNKNOWN;
    }
    clear(){
        this.lyrics = [];
        this.annotations = {};
        this.status = LyricStatus.UNAVAILABLE;
    }
    annotate(line_no,token_no,annot){
        var key = line_no + "."+token_no;
        this.annotations[key] = annot;
    }
    has_annotation(i,j){
        var key = i+ "."+ j;
        return key in this.annotations;
    }
    annotation(i,j){
        var key = i+ "."+ j;
        return this.annotations[key];
    }
    *tokens(){
        for(var i=0; i < this.lyrics.length; i += 1){
            var line = this.lyrics[i];
            for(var j=0; j < line.length; j += 1){
                var tok = line[j];
                yield [i,j,tok];
            }
        }
    }
    add_line(line){
        var tokens = line.trim().split(/\s+/);
        var word_tokens = tokens.filter(v=>v!='');
        this.lyrics.push(word_tokens);
    }

}
class Track {
    constructor(title,artists,album,year){
        this.title = title;
        this.artists = artists;
        this.album = album;
        this.year = year;
        this.lyrics = new Lyrics();
        this.spotify_uri = null;
    }

    set_lyrics(lyrics){
        this.lyrics = lyrics;
    }
}

class Playlist {
    constructor(){
        this.tracks = [];
        this.n = 0;
    }
    add(track){
        this.tracks.push(track);
        this.n += 1;
    }
    export(){
        var str = "";
        var delim = "\t";
        var endl = "\n";
        var header = ["Hidden","Break","Artist","ArtistLink","Composer","Song","Version","Album","Format","Label","LabelLink","Year","Misc","New","Comp","Comment"];

        str += header.join(delim)+endl;
        for(var i=0; i < this.tracks.length; i++){
            var track = this.tracks[i]
            var vals = ["0","0",track.artists,"","",track.title,"",track.album,"","","",track.year,"","",0,""]
            str += vals.join(delim)+endl;
        }
        return str;
    }
}

class WorkQueue {
    constructor(){
        this.queue = [];
    }
    add(dlobj){
        this.queue.push(dlobj);
    }
    next(){
        if(this.queue.length == 0){
            if(this.callback){
                this.callback();
                this.callback = null;
            }
            return;
        }
        var dlobj = this.queue.pop();
        var that = this;
        dlobj.status = Status.INPROGRESS;
        dlobj.request(function(status){
            dlobj.status = status;
            that.next();
        });
    }
    done(){
        return this.queue.length;
    }
    wait(){
        while(!done){
            sleep(10);
        }
    }
    execute(cbk){
        this.callback = cbk;
        this.next();
    }
    flush(){
        this.queue = [];
    }
}
