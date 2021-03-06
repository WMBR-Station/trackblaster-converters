
class GeniusLyrics extends Downloadable {

    constructor(api,track,lyric_path){
        super()
        this.genius_lyric_api = api;
        this.lyric_path = lyric_path;
        this.track = track;
    }
    unpack(data){
	this.track.lyrics.from_text(data);
        scan_for_profanity(this.track.lyrics);

    }
    request(cbk){
        var that = this;
        if(this.lyric_path == null ||
		this.lyric_path == undefined){
            this.track.lyrics.status = LyricStatus.UNAVAILABLE;
            cbk(Status.FAILURE);
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

// other lyric fetching services to consider
// MusixMatch, LyricView
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
	console.log("===========");
        results.forEach(function(entry,index){
            if(entry["type"] == "song" &&
               entry.result.lyrics_state == "complete"){
                var result = entry.result;
                var t1 = new GeniusTrack(result.title,
                                         result.primary_artist.name,
                                         result.id,
                                         result.path.substr(1));
		var s1 = t1.similarity(that.track);
                tracks.push(t1);
                scores.push(s1);
                console.log(t1.title,t1.artist,s1);
                var t2 = new GeniusTrack(result.title_with_featured,
                                         result.primary_artist.name,
                                         result.id,
                                         result.path.substr(1));
		var s2 = t2.similarity(that.track);
                tracks.push(t2);
                scores.push(s2);
                console.log(t2.title,t2.artist,s2);
            }
        });
	if(scores.length == 0){
	   return;
	}
        var best_tid = argmin(scores);
	if(scores[best_tid] > 4){
	   console.log("== NOT FOUND ==");
	   return;
	}
	console.log("===========");
	console.log(that.track.title,that.track.artist);
	console.log(tracks[best_tid]);
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

class GeniusQuery extends Downloadable {
    constructor(lyric_api,genius_api,queue,track){
        super();
        this.track = track;
        this.queue = queue;
        this.genius_api = genius_api;
        this.lyric_api = lyric_api;
        this.genius_id = new GeniusId(genius_api,track);
    }

    request(cbk){
        var that = this;
        if(this.genius_lyrics == null){
            this.genius_id.request(function(status){
                if(status == Status.SUCCESS){
                    that.genius_lyrics = new GeniusLyrics(that.lyric_api,
                                                          that.track,
                                                          that.genius_id.lyric_path);
                    that.queue.add(that);
                    if(that.genius_id.lyric_path == null){
                        status = Status.FAILURE;
                    }
                    else{
                        status = Status.INPROGRESS;
                    }
                }
                cbk(status);
            });
        }
        else{
            this.genius_lyrics.request(cbk);
        }
    }
}
