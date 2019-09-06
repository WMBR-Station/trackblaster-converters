
var SidePanelState = {
    ACTIONS: "actions",
    LYRICS: "lyrics",
    IMPORT:"import",
    LYRICSDOWNLOAD:"lyrics-download",
    SPOTIFYIMPORT:"spotify-import",
    SPOTIFYLOAD:"spotify-load"
}

class GeniusElement extends ModelView {
    constructor(viewport,el){
        super(el);
        this.viewport = viewport;
        this.bind("status");
    }

    view(that){
        return m("tr",[
            m("td", that.model.status),
            m("td", that.model.track.title),
            m("td", that.model.track.artist)
        ]);
    }



}
class LyricsDownloaderSidePanel extends ModelView {

    constructor(viewport){
        var queue = new WorkQueue();
        super(queue);
        this.bind("n");
        this.viewport = viewport;
        this.links = [];
        this.views = [];
        var that = this;
        this.queue = queue;
        this.viewport.playlist.tracks.forEach(function(track){
            var gen = new GeniusQuery(that.viewport.apis.lyrics_api,
                                      that.viewport.apis.genius_api,
                                      that.queue,track);
            that.links.push(gen);
            that.views.push(new GeniusElement(that.viewport, gen));
            that.queue.add(gen);
        });
        that.queue.execute();

    }

    view(that){
        var rows = [];
        this.views.forEach(function(v){
            rows.push(v.view(v));
        });
        if(that.queue.done()){
            that.viewport.sidepanel.contents = new ActionSidePanel(that.viewport);
            that.viewport.sidepanel.state = SidePanelState.ACTIONS;
            that.links = [];
            return [];
        }
        else {
            return m("table",rows);
        }
    }
}
class SpotifyLoadElement extends ModelView {

    constructor(dlentry){
        super(dlentry);
    }
    view(that){
        return m('tr',[
            m('td',{class:that.model.status},that.model.status),
            m('td',that.model.track_id)
        ]);
    }
}
class SpotifyLoadSidePanel extends ModelView {
    constructor(viewport,track_ids){
        var queue = new WorkQueue();
        super(queue);
        this.bind("n");
        this.viewport = viewport;
        this.links = [];
        this.views = [];
        this.queue = queue;
        var that = this;
        track_ids.forEach(function(track_id,i){
            var dlobj = new SpotifyLink(that.viewport.apis.spotify_api,
                                        track_id);
            that.links.push(dlobj);
            that.views.push(new SpotifyLoadElement(dlobj));
            that.queue.add(dlobj);
        });
        this.queue.execute();
    }
    view(that){
        var rows = [];
        that.views.forEach(function(v){
            rows.push(v.view(v));
        });
        if(that.queue.done()){
            that.links.forEach(function(linkobj){
                that.viewport.playlist.add(linkobj.track);
            });
            that.viewport.sidepanel.contents = new ActionSidePanel(that.viewport);
            that.viewport.sidepanel.state = SidePanelState.ACTIONS;
            that.links = [];
        }
        return [
            m("h3", "Importing Spotify Playlist.."),
            m("table",rows)
        ];
    }
}
class SpotifyImportSidePanel {
    constructor(viewport){
        this.viewport = viewport;
        this.loader = null;
    }
    view(that){
        return [
            m("h1", "Spotify Importer"),
            m("textarea",
              {class:"spotify-playlist"},
              "copy-paste spotify playlist here"),
            m("button",{
                onclick: function(){
                    var track_ids = spotify_import($(".spotify-playlist").val());
                    that.viewport.sidepanel.contents = new SpotifyLoadSidePanel(that.viewport,
                                                                                track_ids);
                    that.viewport.sidepanel.state = SidePanelState.SPOTIFYLOAD;
                }
            }, "Import")
        ];
    }
}
class ImportSidePanel {
    constructor(viewport){
        this.viewport = viewport;
    }
    view(that){
        console.log(that)
        return [
            m("h1","Import Playlist From:"),
            m("button",{onclick:function(){
                that.viewport.sidepanel.contents = new SpotifyImportSidePanel(that.viewport);
                that.viewport.sidepanel.state = SidePanelState.SPOTIFYIMPORT;
            }},"Spotify"),
            m("button","ITunes"),
            m("button","Trackblaster")
        ];
    }
}
class ActionSidePanel {
    constructor(viewport){
        this.viewport = viewport;
    }
    view(that){
        return m("div",[
            m("button", {
                onclick:function(){
                    var text = trackblaster_export(that.viewport.playlist);
                    download(text,"playlist.txt","plain/text");
                }
            },"Export to Trackblaster"),
            m("button", {
                onclick:function(){
                    that.viewport.sidepanel.contents = new LyricsDownloaderSidePanel(that.viewport);
                    that.viewport.sidepanel.state = SidePanelState.LYRICSDOWNLOAD;
                }
            }, "Scan for Profanity")
        ]);
    }
}
class LyricsSidePanel extends ModelView {
    constructor(viewport,lyrics,track){
        super(lyrics);
        this.viewport = viewport;
        this.track = track;
        this.bind("n_lines");
        this.bind("n_annots");
    }
    view_delete_lyrics_button(){
        var that = this;
        return m("button",{
            onclick:function(){
                that.track.lyrics.clear();
                that.track.lyrics.severity = ProfanityLevel.UNKNOWN;
                that.track.lyrics.status = LyricStatus.UNAVAILABLE;
            }
        },"delete lyrics")
    }
    view_severity_selector(){
        var options = [];
        var that = this;
        for(var level in ProfanityLevel){
            if(level == ProfanityLevel.UNKNOWN){
                continue;
            }
            var name = ProfanityLevel[level];
            options.push(m("option",{value:name,
                                     selected:name==this.track.lyrics.severity,
                                     class:name},name));
        }

        return m("select",{
            id:"severity-select",
            class:this.track.lyrics.severity,
            onchange:function(args){
                var val = $("#severity-select").val();
                $("#severity-select").removeClass().addClass(val);
                that.track.lyrics.severity = val;
            }
        },options);
    }
    view_lyrics_viewport(){
        var lyrics = this.model;
        var lines = [];
        lyrics.lyrics.forEach(function(line,idx1){
            var toks = [];
            line.forEach(function(token,idx2){
                if(lyrics.has_annotation(idx1,idx2)){
                    console.log(lyrics.annotations);
                    var annot = lyrics.annotation(idx1,idx2);
                    toks.push(m("mark",{class:annot},token));
                }
                else{
                    toks.push(token);
                }
                toks.push(" ");
            });
            lines.push(m("div",{id:"line"+idx1},toks));
        });
        return m(".lyrics",lines);
    }
    view_annotations_viewport(){
        var lyrics = this.model;
        var annotations = [];
        var jump_to_line = function(lineno){
            var w = $('.lyrics');
            var row = $('#line'+lineno);
            var top = w.scrollTop() + row.position().top - 1.3*w.height();
            console.log(row.position(),w.scrollTop());
            $('.lyrics').animate({scrollTop: top}, 1000 );
        };
        lyrics.annotations(function(lineno,tokno,annot){
            annotations.push(m("div",{
                class:annot,
                onclick:(function(l){
                    return function(){jump_to_line(l);};
                })(lineno)
            },lyrics.token(lineno,tokno)));
        });
        return m("div",annotations);
    }
    view_back_button(){
        return m(".back-button",{
            onclick:function(){
                that.viewport.sidepanel.contents = new ActionSidePanel(that.viewport);
                that.viewport.sidepanel.model.kind
                    = SidePanelState.ACTIONS;
            }
        },"<<");
    }
    view_unknown_lyrics_viewport(){
        var that = this;
        var lyrics_search = m("button",
                              {
                                  onclick:function(){
                                      var query = that.track.title + " ";
                                      query += that.track.artists + " lyrics";
                                      window.open("https://www.google.com/search?q="+
                                                  encodeURIComponent(query));
                                  }
                              },
                              "Search for Lyrics");
        var lyrics_upload = m("button",
                              {
                                  onclick:function(){
                                      var lyrics = $("#user-lyrics").val();
                                      that.model.from_text(lyrics);
                                      scan_for_profanity(that.model);
                                  }
                              },"Upload");
        var lyrics_area =  m("textarea",{
            id:"user-lyrics",
            hint:"paste lyrics here"
        }, "paste lyrics here");

        return m("div",[lyrics_search,
                        lyrics_area,
                        lyrics_upload]);

    }
    view(that){
        var lyrics = that.model;
        var header = [
            m("div",that.track.title),
            m("div",that.track.artist),
            m("div",that.track.album),
            m("div",that.track.year)
        ];
        if(lyrics.status == LyricStatus.UNAVAILABLE){
            var data = that.view_unknown_lyrics_viewport();
            return [
                that.view_back_button(),
                m("h2","Track Information"),
                header,
                m("h2","Lyrics"),
                data
            ];
        }
        else{
            header.push(that.view_severity_selector());
            var data = that.view_lyrics_viewport();
            var annotations = this.view_annotations_viewport();
            return [
                that.view_back_button(),
                that.view_delete_lyrics_button(),
                m("h2","Track Information"),
                header,
                m("h2","Annotations"),
                annotations,
                m("h2","Lyrics"),
                data
            ];
        }
    }
}
class SidePanelModel {
    constructor(){
        this.kind = SidePanelState.ACTIONS;
    }
}

class SidePanel extends ModelView {
    constructor(viewport){
        super(new SidePanelModel());
        this.bind("kind");
        this.viewport = viewport;
        this.contents = new ImportSidePanel(this.viewport);
    }
    view(that){
        return m(".sidepanel",that.contents.view(that.contents));
    }
}
