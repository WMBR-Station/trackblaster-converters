
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

    constructor(track,lyric_path){
        super()
        this.lyric_path = lyric_path;
        this.track = track;
    }
    unpack(data){
        console.log("lyric start");
        console.log(data);
        console.log("lyric end");
    }
    request(cbk){
        var that = this;
        $.get({
            url: 'router.php',
            data: {
                method:'get_lyrics',
                path:btoa(that.lyric_path)
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

class GeniusTrack {
    constructor(title,artist,id,path){
        this.title = title;
        this.artist = artist;
        this.genius_id = id;
        this.lyric_path = path;
    }

    similarity(track){
        var that = this;
        var title_sc = levenshtein_distance(this.title,track.title);
        var artist_scs = [];
        track.artists.forEach(function(artist,idx){
            artist_scs.push(levenshtein_distance(that.artist,artist));
        });
        var artist_sc = argmin(artist_scs);
        return title_sc+artist_sc;
    }
}
function argmax(array) {
    return array.map((x, i) => [x, i])
        .reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}
function argmin(array) {
    return array.map((x, i) => [x, i])
        .reduce((r, a) => (a[0] < r[0] ? a : r))[1];
}
class GeniusId extends Downloadable {

    constructor(genius_api,track){
        super();
        this.track = track;
        this.genius_api = genius_api;
        this.genius_id = null;
    }
    unpack(data){
        var results = data['response']['hits'];
        var tracks = [];
        var scores = [];
        var that = this;
        results.forEach(function(entry,index){
            if(entry["type"] == "song" &&
               entry.result.lyrics_state == "complete"){
                var result = entry.result;
                var t1 = new GeniusTrack(result.title,
                                         result.primary_artist.name,
                                         result.id,
                                         result.path);
                tracks.push(t1);
                scores.push(t1.similarity(that.track));
                var t2 = new GeniusTrack(result.title_with_featured,
                                         result.primary_artist.name,
                                         result.id,
                                         result.path);
                tracks.push(t2);
                scores.push(t2.similarity(that.track));

            }
        });
        var best_tid = argmin(scores);
        self.genius_id = tracks[best_tid].id;
        self.lyric_path = tracks[best_tid].lyric_path;
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
        var album = datum.album.name;
        var album_type = datum.album.album_type;
        var release_date = datum.album.release_date;
        var artists = [];
        datum.artists.forEach(function (artist_data, index) {
            artists.push(artist_data.name);
        });
        var duration = datum.duration_ms/1000.0;
        var title = datum.name;
        var spotify_uri = datum.uri;
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

