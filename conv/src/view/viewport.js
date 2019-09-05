
class Viewport {
    constructor(tracklist){
        this.side_panel = new SidePanel();
        this.playlist_view = new PlaylistView(tracklist,this);
        this.action_footer = null;
        this.import_dialog = null;
    }
    view(arg){
        var that = arg.tag;
        var playlist_view = that.playlist_view;
        var side_panel = that.side_panel;
        return m("viewport",
                 [
                     m(".playlist", playlist_view.view(playlist_view)),
                     side_panel.view(side_panel)
                 ]);
    }
}
