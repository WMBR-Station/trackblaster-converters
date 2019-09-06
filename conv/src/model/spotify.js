
class SpotifyLink extends Downloadable {

    constructor(spotify_api,track_id){
        super()
        this.spotify_api = spotify_api;
        this.track_id = track_id;
        this.track = null;
    }
    unpack(datum){
	console.log(datum);
        var album = datum.album.name;
        var album_type = datum.album.album_type;
        var release_date = datum.album.release_date;
        var artists = [];
        datum.artists.forEach(function (artist_data, index) {
            artists.push(artist_data.name);
        });
        var duration = datum.duration_ms/1000.0;
        var title = datum.name;
        var spotify_uri = datum.uri;
        this.track = new Track(title,artists,album,release_date);
	this.track.spotify_uri = spotify_uri;
       	console.log(this.track);
    }
    request(cbk){
        var url = "https://api.spotify.com/v1/tracks/"+this.track_id;
        var that = this;
        this.spotify_api.ajax({
            url: url,
            method: "GET",
            success: function(data){
                that.unpack(data);
                cbk(Status.SUCCESS);
            },
            error: function(err){
                console.log(err);
                cbk(Status.FAILURE);
            }
        });
    }
}
