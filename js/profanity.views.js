
LyricEditor = function(root){
    this.init = function(){
        this.views = {}
        this.views.root = $(root)
        this.views.save_lyrics = $('#save-lyrics',this.views.root)
        this.views.new_lyrics = $('#new-lyrics',this.views.root)
        var that = this
        this.views.save_lyrics.click(function(){
            that.save()
        })
        this._obs = Listener()
        this._obs.register('save-lyrics')

    }
    this.save = function(){
        var text = this.views.new_lyrics.val()
        this.views.new_lyrics.val("")
        this._obs.trigger('save-lyrics',text)
        this.hide()

    }
    this.show = function(){
        this.views.root.modal('show')
    }

    this.hide = function(){
        this.views.root.modal('hide')
    }
    this.init()
    return this
}
TrackMetadataView = function(trackdata){
    this.init = function(){
        this.views = {}
        this.views.root = $(trackdata)
        this.views.song = $(".song",this.views.root)
        this.views.artist = $(".artist",this.views.root)
        this.views.art = $(".art",this.views.root)
        this.views.status = $(".status",this.views.root)
        this.views.source = $(".source",this.views.root)
        this.views.profanity = $(".profanity",this.views.root)
        this.views.album = $(".album",this.views.root)
        this.views.label = $(".music-label",this.views.root)
        this.views.url = $(".url",this.views.root)
        this.views.year = $(".year",this.views.root)

        this.views.edit_lyrics = $('#edit-lyrics',this.views.root)
        this.views.search_lyrics = $('#search-lyrics',this.views.root)
        this.lyric_editor = LyricEditor("#edit-lyric-dialog")
        var that = this
        this.views.edit_lyrics.click(function(){
            that.lyric_editor.show()
        })
        this.views.search_lyrics.click(function(){
            that.lyric_editor.show()
            that.model.search_lyrics()
        })

        this.model = null
    }
    this.set_model = function(track){
        this.model = track
        var that = this;
        this.model.listen('song',function(name){
            console.log("set song",name)
            that.views.song.html(name)
        })
        this.model.listen('artist',function(name){
            that.views.artist.html(name)
        })
        this.model.listen('art',function(name){
            that.views.art.attr('src',name)
        })
        this.model.listen('profanity',function(name){
            that.views.profanity.html(name)
        })
        this.model.listen('status',function(name){
            that.views.status.removeClass("ok bad")
            if(name == "found"){
                that.views.status.addClass("ok")
            }
            else if(name == "standby"){
                that.views.status.html("no lyrics")
                    .addClass("bad")
            }
            else if(name == "incorrect"){
                that.views.status.html("incorrect lyrics")
                    .addClass("bad")
            }
            else{
                throw ("unknown status :"+name)
            }
            
        })
        this.model.listen('source',function(name){
            if(name == "web"){
                that.views.status.html("lyrics found online")
                that.views.url.attr('href',track.url)
            }
            else if(name == "local"){
                that.views.status.html("lyrics uploaded by user")
            }
            else if(name == "none"){
            }
        })
        this.model.listen('album',function(name){
            that.views.album.html(name)
        })
        this.model.listen('label',function(name){
            that.views.label.html(name)
        })
        this.model.listen('year',function(name){
            that.views.year.html(name)
        })
        this.model.trigger()
    }
    this.show = function(){
        this.views.root.removeClass('hide').addClass('show')
    }
    this.hide = function(){
        this.views.root.addClass('hide').removeClass('show')
    }
    this.init()
    return this
}

LyricsSidebarView = function(root){
    this.init = function(){
        this.views = {}
        this.views.root = $(root)
        this.views.lyrics = $('.lyrics-box',this.views.root)
        this.views.profanity = $('.profanity-box',this.views.root)
        this.views.colorbar = $('.color-bar',this.views.root)
        this._cache = {}
        return
    }

    this._render_lyrics = function(lyrics,profanity){
        pos = {}
        key = (""+lyrics).hashCode()
        if(! (key in this._cache)){
            for(badword in profanity){
                for(locid in profanity[badword].locs){
                    loc = profanity[badword].locs[locid]
                    if(! (loc[0] in pos)){
                        pos[loc[0]] = {}
                    }
                    pos[loc[0]][loc[1]] = profanity[badword].data

                }
            }
            html = ''
            for(lid in lyrics){
                line = []
                for(wid in lyrics[lid]){
                    if(lid in pos && wid in pos[lid]){
                        badword = pos[lid][wid]
                        text = $('<span/>').attr('id',lid+"."+wid)
                            .addClass(badword.severity)
                            .addClass('word')
                            .html(lyrics[lid][wid]).prop('outerHTML')
                    }
                    else{
                        text = lyrics[lid][wid]
                    }
                    line.push(text)
                }
                html_snippet = line.join(' ') + "<br>"
                html += html_snippet
            }
            this._cache[key] = html
            this.views.lyrics.html(html)
        }
        else{
            this.views.lyrics.html(this._cache[key])
        }
    }
    this._render_profanity = function(profanity){
        console.log(profanity)
    }
    this.show = function(){
        this.views.root.removeClass('hide').addClass('show')
    }
    this.hide = function(){
        this.views.root.addClass('hide').removeClass('show')
    }
    this.search = function(){
        this.model.search()
    }
    this.edit = function(){
        print("[Edit] Implement")
    }
    this.set_model = function(track){
        this.model = track
        var that = this
        this.model.listen('lyrics', function(args){
            that._render_lyrics(args[0],args[1])
        })
        this.model.listen('severity', function(severity){
            that.views.colorbar.removeClass('severe bad verybad warn ok')
                .addClass(severity)
        })
        this.model.listen('profanity',function(profanity){
            that._render_profanity(profanity)
        })
    }
    this.resize = function(){
        var window_height = $(window).height();
        var sidebar_width = $("#sidebar").width();
        var header_height = $(".panel-heading").height();
        var footer_height = $(".panel-footer").height();

        $("#sidebar").height(window_height - header_height - footer_height)
        $("#details").height(window_height - header_height - footer_height)
    }
    this.init()
    return this
}



TrackView = function(root){
    this.init = function(root){
        this.views = {}
        this.views.root = root
        this.views.song = $('.song',this.views.root)
        this.views.artist = $('.artist',this.views.root)
        this.views.album = $('.album',this.views.root)
        this.views.swatch = $('.swatch',this.views.root)
        this.model = null
        this._obs = new Listener()
        this._obs.register('click')
        var that = this
        this.views.root.click(function(){
            that._obs.trigger('click',that)
        })
    }

    this.listen = function(name,event){
        this._obs.listen(name,event)
    }
    this.bind = function(model){
        var that = this
        this.model = model
        model.listen('song',function(name){
            that.views.song.html(name)
        })
        model.listen('artist',function(name){
            that.views.artist.html(name)
        })
        model.listen('album',function(name){
            that.views.album.html(name)
        })
        model.listen('profanity',function(name){
            return
        })
        model.listen('severity',function(name){
            that.views.swatch.removeClass('ok notgreat bad severe')
                .addClass(name)
        })
        model.listen('source',function(name){
            return
        })
        model.listen('status',function(name){
            if(name == Globals.STATUS.STANDBY){
                that.views.swatch.removeClass('loading mismatch').addClass('standby')
            }
            else if(name == Globals.STATUS.PENDING){
                that.views.swatch.addClass('loading').removeClass('standby mismatch')
            }
            else if(name == Globals.STATUS.LYRICS){
                that.views.swatch.removeClass('loading mismatch standby')
            }
            else if(name == Globals.STATUS.MISMATCH){
                that.views.swatch.removeClass('loading standby').addClass('mismatch')
            }
            else {
                throw ("unknown status: "+name)
            }
            return
        })
    }
    this.init(root)
    return this
}




TracklistView = function(name){
    this.init = function(){
        this.views = {}
        this.views.root = $(name)
        this.views.templ = $('.templ',this.views.root)
        this.views.trackbox = $('.track-box',this.views.root)
        this.views.tracks = []
        this._model = null
        this._obs = new Listener()
        this._obs.register('select')
        this._selected = null
    }
    this.selected = function(){
        return this._selected
    }
    this.listen = function(name,cbk){
        this._obs.listen(name,cbk)
    }
    this.select = function(view){
        $('.selected',this.views.root).removeClass('selected')
        view.views.root.addClass('selected')
        this._selected = view
        this._obs.trigger('select',view.model)
    }
    this.refresh = function(){
        this._obs.trigger('select',this._selected.model)
    }
    this.set_model = function(model){
        this._model = model
        var that = this
        var add_track = function(track){
            domobj = that.views.templ.clone()
            domobj.removeClass('templ hidden')
            var view = new TrackView(domobj)
            view.bind(track)
            track.trigger()
            view.listen('click',function(view){
                that.select(view)
            })
            that.views.tracks.push(view)
            that.views.trackbox.append(domobj)
        }
        for(trackid in this._model.tracks){
            track = this._model.tracks[trackid]
            add_track(track)
        }
    }
    this.init()
    return this
}

MasterView = function(){

    this.init = function(){
        this.trackview = new TracklistView('#details')
        this.lyricpanel = new LyricsSidebarView('#sidebar')
        this.metaheader = new TrackMetadataView('#metadata')
        this.selected = new TrackModel('','','','','')
        this.metaheader.set_model(this.selected)
        this.lyricpanel.set_model(this.selected)
        this.lyric_editor = this.metaheader.lyric_editor

        var that = this
        this.lyric_editor.listen('save-lyrics', function(lyrics){
            that.trackview.selected().model
                .set_lyrics(Globals.SOURCE.MANUAL, lyrics)
            that.trackview.refresh()
        })

        this.trackview.listen('select',function(trackobj){
            that.selected.copyFrom(trackobj)
            that.metaheader.show()
            if(trackobj.lyrics != undefined){
                that.lyricpanel.show()
            }
            else{
                that.lyricpanel.hide()
            }
        })

    }
    this.init();
    return this
}
