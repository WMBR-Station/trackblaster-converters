
var LyricStatus = {
    UPLOADED: "uploaded",
    UNAVAILABLE: "unavailable",
    VALIDATED: "validated",
    ANALYZED: "analyzed"
}
var Status = {
    SUCCESS: "success",
    FAILURE: "failed",
    INPROGRESS: "in-progress",
    PENDING: "pending"
}


class Lyrics {
    constructor(){
        this.lyrics = [];
        this._annotations = {};
        this.status = LyricStatus.UNAVAILABLE;
        this.severity = ProfanityLevel.UNKNOWN;
    }
    clear(){
        this.lyrics = [];
        this._annotations = {};
        this.status = LyricStatus.UNAVAILABLE;
    }
    annotations(cbk){
        for(var key in this._annotations){
            var args = key.split(".");
            var line_no = parseInt(args[0]);
            var tok_no = parseInt(args[1]);
            var annot = this._annotations[key];
            cbk(line_no,tok_no,annot);
        }
    }
    annotate(line_no,token_no,annot){
        var key = line_no + "."+token_no;
        this._annotations[key] = annot;
    }
    has_annotation(i,j){
        var key = i+ "."+ j;
        return key in this._annotations;
    }
    annotation(i,j){
        var key = i+ "."+ j;
        return this._annotations[key];
    }
    token(i,j){
        return this.lyrics[i][j];
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
    clear(){
        this.tracks = [];
        this.n = 0;
    }
}
