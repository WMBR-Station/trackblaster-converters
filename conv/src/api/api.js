
class APIManager {
    constructor (){
        this.genius_api = new GeniusAPI();
        this.spotify_api = new SpotifyAPI();
        this.lyrics_api = new GeniusLyricAPI();
        this.spotify_api.on_access_token(function(at){
            console.log("READY");
        });
        this.spotify_api.authorize();
    }
}

class MockAPIManager {
    constructor (){
        this.genius_api = new MockGeniusAPI();
        this.spotify_api = new MockSpotifyAPI();
        this.lyrics_api = new MockGeniusLyricAPI();
    }
}
