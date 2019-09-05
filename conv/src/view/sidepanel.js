
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
        this.api = new MockGeniusAPI();
        this.links = [];
        this.views = [];
        var that = this;
        this.queue = queue;
        this.viewport.playlist.tracks.forEach(function(track){
            var gen = new GeniusId(that.api,track);
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
        return m("table",rows);
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
    constructor(viewport,links){
        var queue = new WorkQueue();
        super(queue);
        this.bind("n");
        this.viewport = viewport;
        this.links = [];
        this.views = [];
        this.queue = queue;
        this.api = new MockSpotifyAPI();
        var that = this;
        links.forEach(function(link,i){
            var tokens = link.split("/");
            var track_id = tokens[tokens.length - 1];
            var dlobj = new SpotifyLink(that.api,track_id);
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
                that.viewport.playlist.add(linkobj.to_track());
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
                    var text = $(".spotify-playlist").val();
                    var links = text.split("\n");
                    that.viewport.sidepanel.contents = new SpotifyLoadSidePanel(that.viewport,
                                                                                links);
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
                    var text = that.viewport.playlist.export();
                    download(text,"playlist.txt","plain/text");
                }
            },"Export to Trackblaster"),
            m("button", {
                onclick:function(){
                    that.viewport.sidepanel.contents = new LyricsDownloaderSidePanel(that.viewport);
                    that.viewport.sidepanel.state = SidePanelState.LYRICSDOWNLOAD;
                }
            }, "Get Lyrics"),
            m("button", "Scan for Profanity"),
            m("button", "Clear Playlist")
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
    view(that){
        var lyrics = that.model;
        console.log(that);
        var header = [
            m("div",that.track.title),
            m("div",that.track.artist),
            m("div",that.track.album),
            m("div",that.track.year)
        ];
        var data = [];
        if(lyrics.status == LyricStatus.UNAVAILABLE){
            data = [m("button","Search for Lyrics"),
                    m("textarea","paste lyrics here"),
                    m("button","Upload Lyrics")];
        }
        else{
            var lines = [];
            lyrics.lyrics.forEach(function(line,idx1){
                var toks = [];
                line.forEach(function(token,idx2){
                    if(lyrics.has_annotation(idx1,idx2)){
                        console.log(lyrics.annotations);
                        var annot = lyrics.annotation(idx1,idx2);
                        toks.push(m("mark",token));
                    }
                    else{
                        toks.push(token);
                    }
                    toks.push(" ");
                });
                lines.push(m("div",toks));
            });
            data = [m(".lyrics",lines)];
        }
        return [
            m(".back-button",{
                onclick:function(){
                    that.viewport.sidepanel.contents = new ActionSidePanel(that.viewport);
                    that.viewport.sidepanel.model.kind
                        = SidePanelState.ACTIONS;
                  }
              },"<<"),
            m("h2","Track Information"),
            header,
            m("h2","Lyrics"),
            data
        ];
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
