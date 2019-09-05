
var SidePanelState = {
    ACTIONS: "actions",
    LYRICS: "lyrics"
}

class ActionSidePanel extends ModelView {
    constructor(tracklist){
        super(tracklist);
    }
    view(that){
        return m("h1","Import");
    }
}
class LyricSidePanel extends ModelView {
    constructor(lyrics,track){
        super(lyrics);
        this.track = track;
        this.bind("n_lines");
        this.bind("n_annots");
    }
    view(that){
        return m("h1","Song Information");
    }
}
class SidePanelModel {
    constructor(){
        this.state = SidePanelState.ACTIONS;
        this.model = null;
    }
}

class SidePanel extends ModelView {
    constructor(){
        super(new SidePanelModel());
        this.bind("state");
    }
    view(that){
        if(that.model.state == SidePanelState.ACTIONS){
            var contents = new ActionSidePanel(that.model);
        }
        else if(that.model.state == SidePanelState.LYRICS){
            var contents = new LyricsSidePanel(that.model);
        }
        else{
            throw "unknown state";
        }
        return m(".sidepanel",contents.view(contents));
    }
}
