String.prototype.hashCode = function(){
    var hash = 0;
    for (var i = 0; i < this.length; i++) {
        var character = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+character;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

function assert(cond,msg){
    if(! cond){
        throw msg
    }
}
var Globals = {
    STATUS: {
        STANDBY: "standby",
        PENDING: "pending",
        LYRICS: "found",
        MISMATCH: "incorrect"
    },
    SOURCE: {
        WEB: "web",
        MANUAL: "manual",
        NONE: "none"
    },
    SEVERITY: {
        OK: 'ok',
        NOTGREAT: 'notgreat',
        BAD: 'bad',
        SEVERE: 'severe'
    },
    CATEGORY: {
        INDECENCY: 'indecency',
        CURSING: 'cursing'
    }

}
var Listener = function(){
    this.init = function(){
        this._events = {}
    }
    this.register = function(name){
        this._events[name] = {}
    }
    this.listen = function(name,cbk){
        //assert(name in this._events,
        //       "NO-KEY: "+name+","+this.events)
        n = Object.keys(this._events[name]).length
        this._events[name][n] = cbk
        return n
    }
    this.trigger = function(eventname,value){
        for(cbkid in this._events[eventname]){
            var cbk = this._events[eventname][cbkid]
            cbk(value)
        }
    }
    this.init()
    return this
}


var TrackModel = function(song,artist,album,label,year){
    this.init = function(){
        this.song = song
        this.artist = artist
        this.album = album
        this.label = label
        this.year = year
        this.profanity = {}
        this.severity = null
        this.lyrics = null
        this.source = Globals.SOURCE.NONE
        this.status = Globals.STATUS.STANDBY
        this.art = ''
        this.url = ''
        this._obs = new Listener()
        var events = ['song','artist','album','label','year','art',
                      'source','status','severity','profanity','lyrics'];
        for(eid in events){
            this._obs.register(events[eid]);
        }


    }
    
    this.copyFrom = function(obj){
        this.song = obj.song
        this.artist = obj.artist
        this.album = obj.album
        this.label = obj.label
        this.year = obj.year
        this.profanity = obj.profanity
        this.severity = obj.severity
        this.lyrics = obj.lyrics
        this.source = obj.source
        this.status = obj.status
        this.trigger()
    }
    this.listen = function(name,cbk){
        this._obs.listen(name,cbk)
    }
    this.trigger = function(){
        this._obs.trigger('song',this.song)
        this._obs.trigger('artist',this.artist)
        this._obs.trigger('album',this.album)
        this._obs.trigger('label',this.label)
        this._obs.trigger('year',this.year)
        this._obs.trigger('source',this.source)
        this._obs.trigger('status',this.status)
        this._obs.trigger('severity',this.severity)
        this._obs.trigger('profanity',this.profanity)
        this._obs.trigger('lyrics',[this.lyrics,this.profanity])
        this._obs.trigger('art',this.art)
    }
    this.set_url = function(url){
        self.url = url
        this._obs.trigger('url',this.url)
    }
    this.test = function(song,artist){
        song_ref = FuzzySet([this.song])
        artist_ref = FuzzySet([this.artist])
        song_match = song_ref.get(song)
        artist_match = artist_ref.get(artist)
        if(! (song_match == null)){
            song_score = song_match[0][0]
        }
        else {
            song_score = 0
        }
        if(! (artist_match == null)){
            artist_score = artist_match[0][0]
        }
        else {
            song_score = 0
        }
        total_score = song_score*artist_score
        if(total_score < 0.5){
            this.status = Globals.STATUS.MISMATCH
            this._obs.trigger('status',this.status)

        }
    }
    this.set_art = function(art){
        self.art = art
        this._obs.trigger('art',this.art)
    }
    this.locs = function(word){
        return this.profanity[word].locs
    }

    this._build_lyrics = function(text){
        lines = text.split(/\n/)
        lyrics = []
        profanity = {}
        severities = {} 
        for(lid in lines){
            words = lines[lid].split(/[ ]+/);
            for(wid in words){
                var word = words[wid]
                badword = profanityAnalyzer.check_word(word);
                if(! (badword == undefined)){
                    if(! (badword.profanity in profanity)){
                        profanity[badword.profanity] = {locs:[],data:badword}
                    }
                    profanity[badword.profanity].locs.push([lid,wid])
                    severities[badword.severity] = true
                }
            }
            lyrics.push(words)
        }

        severity = Globals.SEVERITY.OK
        if(Globals.SEVERITY.SEVERE in severities){
            severity = Globals.SEVERITY.SEVERE
        }
        else if(Globals.SEVERITY.BAD in severities){
            severity = Globals.SEVERITY.BAD
        }
        else if(Globals.SEVERITY.NOTGREAT in severities){
            severity = Globals.SEVERITY.NOTGREAT
        }

        return [lyrics,profanity,severity]
    }
    this.set_lyrics = function(source,new_lyrics){
        returns = this._build_lyrics(new_lyrics)
        this.lyrics =returns[0]
        this.profanity = returns[1]
        this.severity = returns[2]
        this.source = source
        this.status = Globals.STATUS.LYRICS
        this._obs.trigger('source',this.source)
        this._obs.trigger('lyrics',(this.lyrics,this.profanity))
        this._obs.trigger('profanity',this.profanity)
        this._obs.trigger('severity',this.severity)
        this._obs.trigger('status',this.status)

    }
    this.search_lyrics = function(){
        query = this.song + " " + this.artist + " lyrics"
        url = "https://www.google.com/search?q="+encodeURIComponent(query)
        window.open(url)

    }

    this.init()
    return this
}
var WebSourcePlaylistModel = function(trackblaster_playlist){
    this.init = function(){
        this.tracks = []
        for(track in trackblaster_playlist){
            tr = new TrackModel(track.song,track.artist,
                            track.album,track.label,track.year)
            this.tracks.push(tr)
        }

    }
    this.tracks = function(){
        return this.tracks
    }

    this.load = function(){

    }
    this.init()
    return this
}

var MockPlaylistModel = function(){
    this.init = function(){
        this.tracks = []
        for(tid in MOCK_PLAYLIST){
            track = MOCK_PLAYLIST[tid]
            tr = new TrackModel(track.song,track.artist,
                                track.album,track.label,track.year)
            if(track.genius){
                tr.set_lyrics(Globals.SOURCE.WEB,track.genius.lyrics,
                            metadata={
                                song:track.genius.title,
                                artist:track.genius.primary_artist.name,
                                art:track.genius.header_image_thumbnail_url,
                                url:track.genius.url
                            })
                tr.set_art(track.genius.header_image_thumbnail_url)
                tr.set_url(track.genius.url)
                same = tr.test(track.genius.title,track.genius.primary_artist.name)
            }
            this.tracks.push(tr)
        }
    }


    this.load = function(){
    }
    this.init()
    return this
}

