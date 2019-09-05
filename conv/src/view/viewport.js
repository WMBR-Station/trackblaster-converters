
class Viewport {
    constructor(tracklist){
        this.sidepanel = new SidePanel();
        this.playlist_view = new PlaylistView(tracklist,this);
        this.action_footer = null;
        this.import_dialog = null;
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
