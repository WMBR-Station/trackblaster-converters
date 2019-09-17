
class APIManager {
    constructor (){
        this.genius_api = new GeniusAPI();
        this.spotify_api = new SpotifyAPI();
        this.lyrics_api = new GeniusLyricAPI();
    }
}

class MockAPIManager {
    constructor (){
        this.genius_api = new MockGeniusAPI();
        this.spotify_api = new MockSpotifyAPI();
        this.lyrics_api = new MockGeniusLyricAPI();
    }
}
