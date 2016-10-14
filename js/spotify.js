var SpotifyParser = function(){
    this.init = function(){
        this.tracks = {};
        this.albums = {};
	this.artists = {};
	this.order = [];
    }
    this.init_album = function(album_id){
	if(album_id in this.albums && this.albums[album_id] != null){
		return;
	}	
	this.albums[album_id] = null;
    }
    this.get_album = function(album_id,cbk){
        if(album_id in this.albums && this.albums[album_id] != null){
            cbk();
            return;
        }	
        this.albums[album_id] = null;
        var url = "https://api.spotify.com/v1/albums/"+album_id;
                var that = this
        $.get(url,function(data){
            console.log(data);
            that.albums[album_id] = data;
            if(cbk != undefined){
            cbk();
            }
        })
    }
    this.init_artist = function(artist_id){
        if(artist_id in this.artists && this.artists[artist_id] != null){
            return;
        }	
        this.artists[artist_id] = null;
    }
    this.get_artist = function(artist_id,cbk){
        if(artist_id in this.artists && this.artists[artist_id] != null){
            cbk();
            return;
        }	
        this.artists[artist_id] = null;
        var url = "https://api.spotify.com/v1/artists/"+artist_id;
                var that = this
        $.get(url,function(data){
            that.artists[artist_id] = data;
            console.log(data);
            if(cbk != undefined){
            cbk();
            }
        })
    }
    this.get_track = function(track_id,cbk){
        var url = "https://api.spotify.com/v1/tracks/"+track_id;
        var that = this
        if(this.tracks[track_id] != null){
            cbk();
            return;
        }
        $.get(url,function(data){
            that.tracks[track_id] = data;
            if(data.album != undefined){
		    that.init_album(data.album.id); 
	    }
	    for(var i=0; i < data.artists.length; i++){
		    //that.init_artist(data.artists[i].id);
	    }
	    if(data.album != undefined){
		    that.get_album(data.album.id,cbk); 
	    }
	    for(var i=0; i < data.artists.length; i++){
		    //that.get_artist(data.artists[i].id,cbk);
	    }
	    cbk();
        })
    }
    this._is_done = function(els){
        for(id in els){
            if(els[id] == null){
                return false;
            }
        }
        return true;
    }
    this.is_done = function(){
        return this._is_done(this.tracks) && 
            this._is_done(this.albums) &&
            this._is_done(this.artists);
    }
    this.to_artist_list = function(artists){
        if(artists.length == 1){
            return artists[0].name;
        }
        var names = artists[0].name;
        for(var i=1; i < artists.length-1; i++){
            names += ", " + artists[i].name;
        }
        names += " and "+artists[artists.length-1].name;
        return names;
    }
       
    this.to_model = function(){
        var tracks = [];
        var start_code = new TimeCode(0,0,0,0);
        for(var i=0; i < this.order.length; i++){
            var el = this.tracks[this.order[i]];
            var track = {};
	          track.start = new TimeCode(start_code.time)
            track.duration = new TimeCode().from_msec(el.duration_ms);
            track.title = el.name;
	          track.artist = this.to_artist_list(el.artists);
	          if(el.album != undefined){
		            var album = this.albums[el.album.id];
	    	        track.album = album.name;
		            track.label = album.label;
		            track.year = moment(album.release_date).year();
	          }
	          start_code.add(track.duration);
            tracks.push(track);
        }
        return {
		        artist:"self",
            tracks:tracks
        };

    }
	
    this.get_ir = this.to_model;

    this.parse = function(str,cbk){
        var tracks = str.split("\n");
        this.order = [];
        for(var i=0; i < tracks.length; i++){
            var path = tracks[i].split("/");
            var track_id = path[path.length-1];
            this.tracks[track_id] = null;
            this.order.push(track_id);
        }
        var that = this;
        for(track_id in this.tracks){
            this.get_track(track_id,function(){
                if(that.is_done()){
                    console.log("completed",that.data);
                    cbk( that.to_model());
                }
                else {
                    console.log("incomplete",that.data)
                }
            })
        }
        
    }
    this.init();
}
