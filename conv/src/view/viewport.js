
class Viewport {
    constructor(apis){
        this.apis = apis;
        this.playlist = new Playlist();
        this.sidepanel = new SidePanel(this);
        this.playlist_view = new PlaylistView(this.playlist,this);
    }
    view(arg){
        var that = arg.tag;
        var playlist_view = that.playlist_view;
        var side_panel = that.sidepanel;
        return m(".viewport",
                 [
                     side_panel.view(side_panel),
                     playlist_view.view(playlist_view)
                 ]);
    }
}
