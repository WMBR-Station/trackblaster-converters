if (!Object.prototype.watch) {
    Object.defineProperty(
        Object.prototype,
        "watch", {
            enumerable: false,
            configurable: true,
            writable: false,
            value: function (prop, handler) {
                var old = this[prop];
                var cur = old;
                var getter = function () {
                    return cur;
                };
                var setter = function (val) {
                    old = cur;
                    cur =
                        handler.call(this,prop,old,val);
                    return cur;
                };
                // can't watch constants
                if (delete this[prop]) {
                    Object.defineProperty(this,prop,{
                        get: getter,
                        set: setter,
                        enumerable: true,
                        configurable: true
                    });
                }
            }
        });
}
class ModelView {
    constructor(model){
        this.model = model;
    }
    unbind(name){
        this.model.unwatch(name);
    }
    bind(name){
        this.model.watch(name, function(){m.redraw()});
    }
}

class LyricsPaneModel {
    constructor(){
        this.lyrics = null;
    }
}
class LyricsPane extends ModelView {
    constructor(){
        super(new LyricsPaneModel);
        this.bind("lyrics");
    }
    view(arg){

    }
}
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
        return m("tr", [
            m("td", {class: "title"}, model.title),
            m("td", {class: "artist"}, model.artists),
            m("td", {class: "album"}, model.album),
            m("td", {class: "year"}, model.year),
            m(".lyrics", this.lyrics.view(lyric_pane))
        ]);
    }
}

class PlaylistView extends ModelView {

    constructor(model,viewport){
        super(model);
        this.bind("tracks");
        this.viewport = viewport;
    }

    view(arg){
        var that = arg.tag;
        var model = that.model;
        var track_views = [];
        var header = m("tr", [
            m("td", "title"),
            m("td", "artist"),
            m("td", "album"),
            m("td", "year"),
            m("td", "lyrics")
        ]);
        track_views.push(header);
        model.tracks.forEach(function(track,index){
            var track_view = new TrackView(track,that.viewport);
            track_views.push(track_view.view(track_view));
        });
        return m("playlist",
                 m("table",track_views));
    }
}
