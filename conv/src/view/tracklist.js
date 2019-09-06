class LyricsStatusIndicator extends ModelView {
    constructor(lyrics,track,viewport){
        super(lyrics);
        this.track = track;
        this.bind("status");
        this.viewport = viewport;
    }
    view(that){
        var open_lyrics = function(){
            that.viewport.sidepanel.contents
                = new LyricsSidePanel(that.viewport,
                                      that.model,
                                      that.track);
            that.viewport.sidepanel.model.kind
                = SidePanelState.LYRICS;
        };

        var rows= [
            m("td",
              {
                  class:that.model.severity,
                  onclick:open_lyrics
              },
              that.model.status)
        ];
        var text = "view";
        if(that.model.status == LyricStatus.UNAVAILABLE){
            var text = "upload";
        }
        rows.push(m("td", {
            class:text+"-lyrics",
            onclick:open_lyrics
        }, text));
        return rows;
    }
}
class TrackView extends ModelView {
    constructor(model,viewport){
        super(model);
        this.bind("title");
        this.bind("artists");
        this.bind("album");
        this.bind("year");
        this.bind("spotify_uri");
        this.lyrics = new LyricsStatusIndicator(model.lyrics,model,viewport);
    }
    view(arg){
        var model = arg.model;
        var lyric_pane = arg.lyrics;
        var cols = [
            m("td", {class: "title"}, model.title),
            m("td", {class: "artist"}, model.artists),
            m("td", {class: "album"}, model.album),
            m("td", {class: "year"}, model.year),
        ];
        this.lyrics.view(lyric_pane).forEach(function(col,idx){
            cols.push(col);
        });
        return m("tr", cols);
    }
}

class PlaylistView extends ModelView {

    constructor(model,viewport){
        super(model);
        this.bind("n");
        this.viewport = viewport;
    }

    view(that){
        var model = that.model;
        var track_views = [];
        var header = m("tr", [
            m("th", "title"),
            m("th", "artist"),
            m("th", "album"),
            m("th", "year"),
            m("th", "lyrics status"),
            m("th", "lyrics")
        ]);
        track_views.push(header);
        model.tracks.forEach(function(track,index){
            var track_view = new TrackView(track,that.viewport);
            track_views.push(track_view.view(track_view));
        });
        return m(".playlist",
                 m("table",{class:'playlist-table',
                            width:'100%'},track_views));
    }
}
