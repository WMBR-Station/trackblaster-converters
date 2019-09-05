
class GeniusLyrics extends Downloadable {

    constructor(api,track,lyric_path){
        super()
        this.genius_lyric_api = api;
        this.lyric_path = lyric_path;
        this.track = track;
    }
    unpack(data){
        var lines = data.split("\n");
        var that = this;
        this.track.lyrics.clear();
        lines.forEach(function(line,idx){
            that.track.lyrics.add_line(line);
        });
        this.track.status = LyricStatus.UPLOADED;
    }
    request(cbk){
        var that = this;
        if(this.lyric_path == null){
            this.track.set_lyrics(null);
            return;
        }
        this.genius_lyric_api.get({
            lyric_path:this.lyric_path,
            success:function(data){
                that.unpack(data);
                cbk(Status.SUCCESS);
            },
            error:function(data){
                console.log(data);
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

class GeniusId extends Downloadable {

    constructor(genius_api,track){
        super();
        this.track = track;
        this.genius_api = genius_api;
        this.genius_id = null;
        this.lyric_path = null;
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
                                         result.path.substr(1));
                tracks.push(t1);
                scores.push(t1.similarity(that.track));
                var t2 = new GeniusTrack(result.title_with_featured,
                                         result.primary_artist.name,
                                         result.id,
                                         result.path.substr(1));
                tracks.push(t2);
                scores.push(t2.similarity(that.track));

            }
        });
        var best_tid = argmin(scores);
        this.genius_id = tracks[best_tid].id;
        this.lyric_path = tracks[best_tid].lyric_path;
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
