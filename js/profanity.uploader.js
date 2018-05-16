


FileUploader = function(modal,view) {

    this.init = function(){
        this.target = view
        this.views = {}
        this.views.root = $(modal)
        this.views.file = $("input",this.views.root)
        this.views.status = $("#status",this.views.root)
        var that = this
        this.views.file.change(function(){
            if($(this).prop('files').length > 0){
                var filedata = $(this).prop('files')[0]
                that.read(filedata)
            }
        })
    }


    this.parse = function(content){
        var entries = content.split("\n")
        var argline = entries[0]
        var args = argline.split('\t')

        tracks = [];
        for(id in entries){
            if(id == 0){
                continue;
            }
            var entry = entries[id];
            vals = entry.split('\t');
            track = {};
            for(idx in vals){
                track[args[idx].toLowerCase()] = vals[idx];
            }
            if(track.artist != "" && track.song != ""){
                tracks.push(track);
            }
        }
        console.log(tracks)
        return tracks
}
    this.error = function(msg){
        this.views.status.html(msg)
            .removeClass('success').addClass('fail')
    }
    this.success = function(msg){
        this.views.status.html(msg)
            .removeClass('fail').addClass('success')
    }
    this.read = function(content){
        fr = new FileReader();
        var that = this;
        fr.onload = function(){
            try {
                pl = that.parse(fr.result);
                that.success('successfully imported file');
                that.source = new WebSourcePlaylistModel(pl);
                that.target.set_model(that.source);
                that.hide();
                that.source.load();
            }
            catch(err) {
                that.error("[ERROR] "+err);
                console.log(err);
            }
        }
        fr.readAsText(content)
    }
    this.hide = function(){
        this.views.root.modal('hide')
    }
    this.mock = function(){
        this.source = new MockPlaylistModel()
        this.target.set_model(this.source);
        this.source.load();

    }

    this.show = function(){
        this.views.root.modal('show')
    }

    this.init()
    return this
}
