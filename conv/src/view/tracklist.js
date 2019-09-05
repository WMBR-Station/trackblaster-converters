class LyricsStatusIndicator extends ModelView {
    constructor(model,viewport){
        super(model);
        this.bind("status");
        this.viewport = viewport;
    }
    view(arg){
        var model = arg.model;
        var rows= [
            m("td", {class:"lyrics"}, model.status)
        ];
        if(model.status != LyricStatus.UNAVAILABLE){
            rows.push(m("td", {class:"view-lyrics"}, "view lyrics"));
        }
        else{
            rows.push(m("td", {}, ""));
        }
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
        this.lyrics = new LyricsStatusIndicator(model.lyrics,viewport);
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
            m("td", "title"),
            m("td", "artist"),
            m("td", "album"),
            m("td", "year"),
            m("td", "lyrics status"),
            m("td", "lyrics")
        ]);
        track_views.push(header);
        model.tracks.forEach(function(track,index){
            var track_view = new TrackView(track,that.viewport);
            track_views.push(track_view.view(track_view));
        });
        return m(".playlist",
                 m("table",track_views));
    }
}
