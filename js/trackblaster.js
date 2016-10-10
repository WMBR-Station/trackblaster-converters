var TrackblasterGenerator = function(){

   this.init = function(){
        this.playlist_header = ["DJ Name","Date","Start Time", "End Time", "Program Name", "Header", "Subheader"];
        this.playlist_row = {};
        
	this.playlist_header_export = {};
	for(var i=0; i < this.playlist_header.length; i++){
		var fld = this.playlist_header[i];
		this.playlist_header_export[fld] = true;
	}
	this.tracks_header =  ["Hidden","Break","Type","Time","Artist","ArtistLink",
                              "Composer","Song","Version","Album","Format","Label","LabelLink","Year",
                              "Misc","New","Comp","Comment"];
        this.track_rows = [];
        this.track_fields = {};

	this.track_header_export = {};
	for(var i=0; i < this.tracks_header.length; i++){
		var fld = this.tracks_header[i];
		this.track_header_export[fld] = true;
	}
    }
    this.init();
    this.table  = function(){
	this.track_rows = [];
        this.playlist_row = {};
        this.track_fields = {};


    }
    this.set_export = function(field,export_me){
	this.track_header_export[field] = export_me;
    }
    this.track_field = function(rowidx, fld,val){
        if(val == undefined) return;
        while(this.track_rows.length <= rowidx){
            this.track_rows.push({});
        }
        this.track_rows[rowidx][fld] = val;
        if(!(fld in this.track_fields)){
            this.track_fields[fld] = rowidx;
        }
    }
    this.playlist_field = function(fld,val){
        if(val == undefined) return;
        this.playlist_row[fld] = val;
    }
    this.to_string = function(){
        var play_krow = [];
        var play_vrow = [];
        var track_krow = [];
        var track_vrows = [];
        for(var i=0; i < this.track_rows.length;i++){
            track_vrows.push([]);
        }
        for(var i=0; i < this.playlist_header.length; i++){
            var key = this.playlist_header[i];
            if(key in this.playlist_row && this.playlist_header_export[key]){
                play_krow.push(key);
                play_vrow.push(this.playlist_row[key]);
            }
        }
	//track fields
        for(var i=0; i < this.tracks_header.length; i++){
            var key = this.tracks_header[i];
            if(key in this.track_fields && this.track_header_export[key]){
                track_krow.push(key);
                for(var j=0; j < this.track_rows.length; j++){
                    var el = this.track_rows[j];
                    track_vrows[j].push(el[key]);
                } 
            }
        }
        var str = "";
        var delim = "\t"
        var endl = "\n"
        //str += play_krow.join(delim)+endl;
        //str += play_vrow.join(delim)+endl+endl;

        str += track_krow.join(delim)+endl;
        for(var i=0; i < track_vrows.length; i++){
            str += track_vrows[i].join(delim)+endl;
        }
        return str;
    }
    this.generate = function(data,start_time){
      this.table();
      var that = this;
      var time_to_str = function(rel_time){
          if(rel_time == undefined || start_time == undefined) return undefined;
          var time = new TimeCode(rel_time.time)
          time.add(start_time);
          return time.to_string() 
      }
      //this.playlist_field("DJ Name",data.artist)
      //this.playlist_field("Start Time",time_to_str(data.start))
      //this.playlist_field("End Time",time_to_str(data.end))
      var i=0;
      for(var track_idx = 0; track_idx < data.tracks.length; track_idx++){
          var track = data.tracks[track_idx];
          console.log(track);
	  this.track_field(i,"Type","S")
          this.track_field(i,"Artist",track.artist)
          this.track_field(i,"Song",track.title)
          this.track_field(i,"Album",track.album)
          this.track_field(i,"Year",track.year)
          this.track_field(i,"Composer",track.composer)
          this.track_field(i,"Label",track.label)
          this.track_field(i,"Time",time_to_str(track.start))
	  i++;
      }

      return this.to_string();

  }
}
