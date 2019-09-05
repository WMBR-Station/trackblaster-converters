
var SidePanelState = {
    ACTIONS: "actions",
    LYRICS: "lyrics",
    IMPORT:"import"
}

class ImportSidePanel extends ModelView {
    constructor(tracklist){
        super(tracklist);
    }
    view(that){
        return [
            m("h1","Import Playlist From:"),
            m("button","Spotify"),
            m("button","ITunes"),
            m("button","Trackblaster")
        ];
    }
}
class ActionSidePanel extends ModelView {
    constructor(tracklist){
        super(tracklist);
    }
    view(that){
        return m("div",[
            m("button", "Export to Trackblaster"),
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
    constructor(){
        super(new SidePanelModel());
        this.bind("kind");
        this.contents = new ImportSidePanel();
    }
    view(that){
        return m(".sidepanel",that.contents.view(that.contents));
    }
}
