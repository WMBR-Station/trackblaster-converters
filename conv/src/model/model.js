api = new MockSpotifyAPI()
q = new WorkQueue()
var song1 = new SpotifyLink(api,
                            "7HnycoSDt76YPYnVzLWeIO")
var song2 = new SpotifyLink(api,
                            "6uimn4Kh5FtNZh3bmbqdOq")
q.add(song1)
q.add(song2)
q.execute()

var api = new MockGeniusAPI()
track1 = song1.to_track()
id1 = new GeniusId(api,track1)
q.add(id1)
q.execute()

var api = new MockGeniusLyricAPI();
var lyric = new GeniusLyrics(api, track1,id1.lyric_path);
q.add(lyric);
q.execute();

scan_for_profanity(track1.lyrics);
