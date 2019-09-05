
var Status = {
        SUCCESS: "success",
        FAILURE: "failed",
        INPROGRESS: "in_progress",
        PENDING: "pending"
}
class Downloadable {
    constructor(){
        this.status = Status.PENDING
    }
    request(cbk){
        throw "overrideme: make request, and execute callback"
    }
}

class GeniusLyrics extends Downloadable {

    constructor(track,ident){
        super()
        this.genius_id = ident;
        this.track = track;
    }
    unpack(data){
        console.log(data);
    }
    request(cbk){
        var that = this;
        $.get({
            url: 'lyric_retriever.php',
            data: {
                method:'get_lyrics',
                path:btoa(that.genius_id.lyric_path)
            },
            success: function(data){
                that.unpack(atob(data));
                cbk(Status.SUCCESS);
            },
            error: function(data){
                cbk(Status.FAILURE);
            }
        });
    }
}

class GeniusId extends Downloadable {

    constructor(genius_api,track){
        super()
        this.track = track;
        this.genius_api = genius_api;
        this.genius_id = null;
    }
    unpack(data){
        console.log(data)
    }
    request(cbk){
        var that = this;
        var base_url = "https://api.genius.com/search";
        var query = this.track.title + " " + this.track.artists[0];
        this.genius_api.ajax({
            url:base_url,
            query:query,
            success:function(data){
                that.unpack(data);
                cbk(Status.SUCCESS);
            },
            error:function(err){
                cbk(Status.FAILURE);
            }
        });
    }

}
class SpotifyLink extends Downloadable {

    constructor(spotify_api,track_id){
        super()
        this.spotify_api = spotify_api;
        this.track_id = track_id;
        this.track = null;
    }
    to_track(){
        return this.track;
    }
    unpack(data){
        var datum = data[0];
        var album = datum["album"]["name"];
        var album_type = datum["album"]["album_type"];
        var release_date = datum["album"]["release_date"];
        var artists = [];
        datum['artists'].forEach(function (artist_data, index) {
            artists.push(artist_data["name"]);
        });
        var duration = datum["duration_ms"]/1000.0;
        var title = datum["name"];
        var spotify_uri = datum["uri"];
        this.track = new Track(title,artists,album,release_date);
        this.spotify_uri = spotify_uri;
    }
    request(cbk){
        var url = "https://api.spotify.com/v1/tracks/"+this.track_id;
        var that = this;
        this.spotify_api.ajax({
            url: url,
            method: "GET",
            success: function(data){
                that.unpack(data)
                cbk(Status.SUCCESS)
            },
            error: function(err){
                console.log(err)
                cbk(Status.FAILURE)
            }
        });
    }
}
class Lyrics extends Downloadable {
    constructor(){
        super()
        self.lyrics = []
    }
}
class Track {
    constructor(title,artists,album,year){
        this.title = title;
        this.artists = artists;
        this.album = album;
        this.year = year;
        this.lyrics = null;
        this.spotify_uri = null;
    }
}


class WorkQueue {
    constructor(){
        this.queue = []
    }
    add(dlobj){
        this.queue.push(dlobj)
    }
    next(){
        if(this.queue.length == 0){
            if(this.callback){
                this.callback()
                this.callback = null
            }
            return
        }
        var dlobj = this.queue.pop()
        var that = this
        dlobj.status = Status.INPROGRESS
        dlobj.request(function(status){
            dlobj.status = status;
            that.next()
        })
    }
    done(){
        return this.queue.length
    }
    wait(){
        while(!done){
            sleep(10);
        }
    }
    execute(cbk){
        this.callback = cbk
        this.next()
    }
    flush(){
        this.queue = []
    }
}

