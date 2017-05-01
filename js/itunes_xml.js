var XMLTypeTracker = function(data){
	this.init = function(data){
		this.cats = {};
		this.cats.integer = 0;
		this.cats.string = 0;
		this.cats.date = 0;
		this.data = data;
	}
	
	this._next = function(key){
		var cat = this.data[key];
		if(this.cats[key] >= cat.length){
			console.log("data for key "+key+" doesn't exist");
			return;
		}	
		var d = cat[this.cats[key]];
		this.cats[key] += 1;
		return d;
	}
	this.next_string = function(){return this._next("string")}
	this.next_integer = function(){return this._next("integer")}
	this.next_date = function(){return this._next("date")}
	this.init(data);
}

var ItunesXMLParser = function(){
	  this.x2js = new X2JS({escapeMode:true});

	  this.parse_track = function(xmldata){
		    var data = {};
		    var getter = new XMLTypeTracker(xmldata);
		    for(var idx = 0; idx < xmldata.key.length; idx+=1){
			      var key = xmldata.key[idx];
			      if(key == "Track ID"){
				        data["track-id"] = getter.next_integer();
			      }
			      else if(key == "Name"){
				        data["title"] = getter.next_string();
			      }
			      else if(key == "Artist"){
				        data["artist"] = getter.next_string();
			      }
			      else if(key == "Album"){
				        data["album"] = getter.next_string();
			      }
			      else if(key == "Genre"){
				        data["genre"] = getter.next_string();
			      }
			      else if(key == "Size"){
				        data["size"] = getter.next_integer();
			      }
            else if(key == "Total Time"){
                data["duration"] = getter.next_integer();
            }
            else if(key == "Date Added"){
                data["date-added"] = getter.next_date();
            }
            else if(key == "Play Count"){
                data["play-count"] = getter.next_integer();
            }
            else if(key == "Release Date"){
                data["release-date"] = getter.next_date();
                if(! ("year" in data)){
                    data["year"] = data["release-date"].split("-")[0];
                }
            }
            else if(key == "Bit Rate"){
                data["bitrate"] = getter.next_integer();
            }
            else if(key == "Sample Rate"){
                data["sample_rate"] = getter.next_integer();
            }
            else if(key == "Year"){
                data["year"] = getter.next_integer();
            }
            else if(key == "Persistent ID"){
                data["persistent-id"] = getter.next_string();
            }
            else if(key == "Track Type"){
                data["track-type"] = getter.next_string();
            }
            else if(key == "Podcast"){
            }
            else if(key == "Location"){
                data["location"] = getter.next_string();
            }
            else if(key == "Composer"){
                data["composer"] = getter.next_string();
            }
            else if(key == "Album Artist" || key == "Kind" ||
                    key == "Sort Album" || key == "Sort Artist" ||
                   key == "Sort Name"){
                getter.next_string();
            }
            else if(key == "Track Number" || key == "Disc Count" ||
                    key == "Artwork Count" || key == "Track Count" ||
                    key == "Normalization" || key == "Disc Number" ||
                    key == "Library Folder Count" || key == "Skip Count" ||
                    key == "File Folder Count" || key == "File Type"
                   ){
                getter.next_integer();
            }
            else if(key == "Play Date"){
                getter.next_integer();
                
            }
            else if(key == "Play Date UTC" ||
                   key == "Date Modified" || key == "Skip Date"){
                getter.next_date();
            }
            else if(key == "Protected" || key == "Apple Music" || key == "Loved" ||
                   key == "Explicit"){
                //booleans
            }
            else{
                console.log("unknown key:",key);
            }
        }
        return data;

	  }
    this.get_ir = function(order,tracks){
        
		    var tracks = [];
		    for(var i=0; i < order.length; i++){
			      var el = tracks[order[i]];
			      var track = {};
			      track.duration = new TimeCode().from_msec(el.duration_ms);
			      track.title = el.name;
			      track.artist = this.to_artist_list(el.artists);
			      if(el.album != undefined){
				        var album = this.albums[el.album.id];
				        track.album = album.name;
				        track.label = album.label;
				        track.year = moment(album.release_date).year();
			      }
			      tracks.push(track);
		    }
        return {
            artist:"self",
            tracks:tracks
        };
	  }


	  this.parse = function(text){
        text_esc = text.replace(/&/g,"&#038;")
        console.log(text_esc);
		    var obj = this.x2js.xml_str2json(text_esc);
        if(obj == null){
            console.log(this.x2js);
            return;
        }
        var trackkeys = obj.plist.dict.dict.key;
		    var trackvals = obj.plist.dict.dict.dict;
        //only get the first playlist
        var playlist= obj.plist.dict.array.dict.array;

        var tracks = {};
		    if(trackkeys.length != trackvals.length){
			      console.log("mismatch between keys and vals");
		    }
		    for(var i=0; i < trackkeys.length; i+=1){
			      var tid = trackkeys[i];
			      var tval = trackvals[i];
			      tracks[tid] = this.parse_track(tval);
		    }
        console.log("==== playlist");
        var plist = [];
        console.log(playlist);
        for(var i = 0; i < playlist.dict.length; i++){
            var trackid = playlist.dict[i].integer;
            plist.push(tracks[trackid]);
        }
        return {tracks:plist};
	  }

}
