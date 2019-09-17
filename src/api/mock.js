class MockSpotifyAPI {
    constructor() {
        this.templ = {"album":{"album_type":"single","artists":[{"external_urls":{"spotify":"https://open.spotify.com/artist/6sFIWsNpZYqfjUpaCgueju"},"href":"https://api.spotify.com/v1/artists/6sFIWsNpZYqfjUpaCgueju","id":"6sFIWsNpZYqfjUpaCgueju","name":"Carly Rae Jepsen","type":"artist","uri":"spotify:artist:6sFIWsNpZYqfjUpaCgueju"}],"available_markets":["AD","AR","AT","AU","BE","BG","BO","BR","CA","CH","CL","CO","CR","CY","CZ","DE","DK","DO","EC","EE","ES","FI","FR","GB","GR","GT","HK","HN","HU","ID","IE","IL","IS","IT","JP","LI","LT","LU","LV","MC","MT","MX","MY","NI","NL","NO","NZ","PA","PE","PH","PL","PT","PY","RO","SE","SG","SK","SV","TH","TR","TW","US","UY","VN","ZA"],"external_urls":{"spotify":"https://open.spotify.com/album/0tGPJ0bkWOUmH7MEOR77qc"},"href":"https://api.spotify.com/v1/albums/0tGPJ0bkWOUmH7MEOR77qc","id":"0tGPJ0bkWOUmH7MEOR77qc","images":[{"height":640,"url":"https://i.scdn.co/image/966ade7a8c43b72faa53822b74a899c675aaafee","width":640},{"height":300,"url":"https://i.scdn.co/image/107819f5dc557d5d0a4b216781c6ec1b2f3c5ab2","width":300},{"height":64,"url":"https://i.scdn.co/image/5a73a056d0af707b4119a883d87285feda543fbb","width":64}],"name":"Cut To The Feeling","release_date":"2017-05-26","release_date_precision":"day","type":"album","uri":"spotify:album:0tGPJ0bkWOUmH7MEOR77qc"},"artists":[{"external_urls":{"spotify":"https://open.spotify.com/artist/6sFIWsNpZYqfjUpaCgueju"},"href":"https://api.spotify.com/v1/artists/6sFIWsNpZYqfjUpaCgueju","id":"6sFIWsNpZYqfjUpaCgueju","name":"Carly Rae Jepsen","type":"artist","uri":"spotify:artist:6sFIWsNpZYqfjUpaCgueju"}],"available_markets":["AD","AR","AT","AU","BE","BG","BO","BR","CA","CH","CL","CO","CR","CY","CZ","DE","DK","DO","EC","EE","ES","FI","FR","GB","GR","GT","HK","HN","HU","ID","IE","IL","IS","IT","JP","LI","LT","LU","LV","MC","MT","MX","MY","NI","NL","NO","NZ","PA","PE","PH","PL","PT","PY","RO","SE","SG","SK","SV","TH","TR","TW","US","UY","VN","ZA"],"disc_number":1,"duration_ms":207959,"explicit":false,"external_ids":{"isrc":"USUM71703861"},"external_urls":{"spotify":"https://open.spotify.com/track/11dFghVXANMlKmJXsNCbNl"},"href":"https://api.spotify.com/v1/tracks/11dFghVXANMlKmJXsNCbNl","id":"11dFghVXANMlKmJXsNCbNl","is_local":false,"name":"Cut To The Feeling","popularity":63,"preview_url":"https://p.scdn.co/mp3-preview/3eb16018c2a700240e9dfb8817b6f2d041f15eb1?cid=774b29d4f13844c495f206cafdad9c86","track_number":1,"type":"track","uri":"spotify:track:11dFghVXANMlKmJXsNCbNl"}

        this.names = ["Lady Gaga", "Dio", "Nic Cage", "Bob Mackie"]
        this.songs = ["Poker Face", "Rainbow", "Some Kind of Wonderful"]
    }
    on_access_token(cbk){
        cbk(null);
    }
    authorize(){
        return;
    }
    ajax(args){
        args.success(this.templ);
    }
}

class MockGeniusLyricAPI {
    constructor(){
        this.templ = `
            [Verse 1]
I had a dream, or was it real?
We crossed the line and it was on
(We crossed the line, it was on this time)
I've been denying how I feel
You've been denying what you want
(You want from me, talk to me baby)

[Pre-Chorus]
I want some satisfaction, take me to the stars
Just like, "ahhh"
A-a-ahhh!

[Chorus]
I wanna cut through the clouds, break the ceiling
I wanna dance on the roof, you and me alone
I wanna cut to the feeling, oh yeah
I wanna cut to the feeling, oh yeah
I wanna play where you play with the angels
I wanna wake up with you all in tangles, oh
I wanna cut to the feeling, oh yeah
I wanna cut to the feeling, oh yeah

[Verse 2]
Cancel your reservations
No more fucking hesitations, this is on
(Can't make it stop, give me all you got)
I want it all or nothing
No more in-between, now give your
(Everything to me, let's get real baby)

[Pre-Chorus]
A chemical reaction, take me in your arms
And make me, "ahhh"
A-a-ahhh!

[Chorus]
I wanna cut through the clouds, break the ceiling
I wanna dance in hell, you and me alone
I wanna cut to the feeling, oh yeah
I wanna cut to the feeling, oh yeah
I wanna play where you play with the angels
I wanna wake up with you all in tangles, oh
I wanna cut to the feeling, oh yeah
I wanna cut to the feeling, oh yeah

[Bridge]
Take me to emotion, I want to go all the way
Show me devotion and take me all the way
Take me to emotion, I want to go all the way
Show me devotion slut and take me all the way
All the way, all the way, all the way
Take me all the way, a-a-ahhh!

[Chorus]
I wanna cut through the clouds, break the ceiling
I wanna dance on the roof, you and me alone
I wanna cut to the feeling, oh yeah
I wanna cut to the feeling, oh yeah
I wanna play where you play with the angels
I wanna wake up with you all in tangles, oh
I wanna cut to the feeling, oh yeah
I wanna cut to the feeling, oh yeah

[Outro]
I wanna cut through the clouds
Mmm, cut to the feeling
I wanna dance on the roof, oh oh oh, yeah
I wanna cut to the feeling, I wanna cut to the feeling
I wanna cut to the feeling, I wanna cut to the feeling
`
    }

    get(args){
        args.success(this.templ);
    }

}

class MockGeniusAPI{

    constructor(){
        this.templ = {"meta":{"status":200},"response":{"hits":[{"highlights":[],"index":"song","type":"song","result":{"annotation_count":4,"api_path":"/songs/2955349","full_title":"Cut to the Feeling by Carly Rae Jepsen","header_image_thumbnail_url":"https://images.genius.com/ad523611d10b7b671e603ab175d91d57.300x300x1.jpg","header_image_url":"https://images.genius.com/ad523611d10b7b671e603ab175d91d57.1000x1000x1.jpg","id":2955349,"lyrics_owner_id":4355603,"lyrics_state":"complete","path":"/Carly-rae-jepsen-cut-to-the-feeling-lyrics","pyongs_count":16,"song_art_image_thumbnail_url":"https://images.genius.com/ad523611d10b7b671e603ab175d91d57.300x300x1.jpg","song_art_image_url":"https://images.genius.com/ad523611d10b7b671e603ab175d91d57.1000x1000x1.jpg","stats":{"unreviewed_annotations":0,"hot":false,"pageviews":82759},"title":"Cut to the Feeling","title_with_featured":"Cut to the Feeling","url":"https://genius.com/Carly-rae-jepsen-cut-to-the-feeling-lyrics","primary_artist":{"api_path":"/artists/21150","header_image_url":"https://images.genius.com/bd48e566dfadae1088b4072a5f9394dd.1000x233x1.png","id":21150,"image_url":"https://images.genius.com/ae76bc6bebf4274385f95f9fe648f2f9.786x786x1.jpg","is_meme_verified":false,"is_verified":true,"name":"Carly Rae Jepsen","url":"https://genius.com/artists/Carly-rae-jepsen","iq":458}}},{"highlights":[],"index":"song","type":"song","result":{"annotation_count":22,"api_path":"/songs/3405190","full_title":"Best & Worst Songs of 2017 by Mike M","header_image_thumbnail_url":"https://images.genius.com/2734ac1aff59c9e8def38946863839ed.272x409x1.jpg","header_image_url":"https://images.genius.com/2734ac1aff59c9e8def38946863839ed.272x409x1.jpg","id":3405190,"lyrics_owner_id":190907,"lyrics_state":"complete","path":"/Mike-m-best-and-worst-songs-of-2017-annotated","pyongs_count":1,"song_art_image_thumbnail_url":"https://images.genius.com/2734ac1aff59c9e8def38946863839ed.272x409x1.jpg","song_art_image_url":"https://images.genius.com/2734ac1aff59c9e8def38946863839ed.272x409x1.jpg","stats":{"unreviewed_annotations":0,"hot":false},"title":"Best & Worst Songs of 2017","title_with_featured":"Best & Worst Songs of 2017","url":"https://genius.com/Mike-m-best-and-worst-songs-of-2017-annotated","primary_artist":{"api_path":"/artists/596495","header_image_url":"https://images.genius.com/2734ac1aff59c9e8def38946863839ed.272x409x1.jpg","id":596495,"image_url":"https://images.genius.com/2734ac1aff59c9e8def38946863839ed.272x409x1.jpg","is_meme_verified":false,"is_verified":false,"name":"Mike M","url":"https://genius.com/artists/Mike-m","iq":42677}}},{"highlights":[],"index":"song","type":"song","result":{"annotation_count":1,"api_path":"/songs/3101501","full_title":"New Music Friday 05/26/17 by Spotify","header_image_thumbnail_url":"https://images.genius.com/4defb2d0b45e544711e5dbabe266a370.300x300x1.png","header_image_url":"https://images.genius.com/4defb2d0b45e544711e5dbabe266a370.1000x1000x1.png","id":3101501,"lyrics_owner_id":93685,"lyrics_state":"complete","path":"/Spotify-new-music-friday-05-26-17-annotated","pyongs_count":null,"song_art_image_thumbnail_url":"https://images.genius.com/a145348938ecc107df70df67d9b38ec1.300x300x1.jpg","song_art_image_url":"https://images.genius.com/a145348938ecc107df70df67d9b38ec1.300x300x1.jpg","stats":{"unreviewed_annotations":0,"hot":false},"title":"New Music Friday 05/26/17","title_with_featured":"New Music Friday 05/26/17","url":"https://genius.com/Spotify-new-music-friday-05-26-17-annotated","primary_artist":{"api_path":"/artists/69342","header_image_url":"https://images.genius.com/6e4f3fc4533e3f41728c5e80d8a2b1d6.400x400x1.jpg","id":69342,"image_url":"https://images.genius.com/141d96cdaf6ed557155c18ed91af11e6.1000x1000x1.png","is_meme_verified":false,"is_verified":false,"name":"Spotify","url":"https://genius.com/artists/Spotify"}}},{"highlights":[],"index":"song","type":"song","result":{"annotation_count":2,"api_path":"/songs/3349931","full_title":"Female Year-End List 2017 by Genius Users","header_image_thumbnail_url":"https://images.genius.com/572b51ce3c79ecabece7c4a976ba915f.300x300x1.png","header_image_url":"https://images.genius.com/572b51ce3c79ecabece7c4a976ba915f.1000x1000x1.png","id":3349931,"lyrics_owner_id":1873201,"lyrics_state":"complete","path":"/Genius-users-female-year-end-list-2017-annotated","pyongs_count":2,"song_art_image_thumbnail_url":"https://images.genius.com/572b51ce3c79ecabece7c4a976ba915f.300x300x1.png","song_art_image_url":"https://images.genius.com/572b51ce3c79ecabece7c4a976ba915f.1000x1000x1.png","stats":{"unreviewed_annotations":0,"hot":false},"title":"Female Year-End List 2017","title_with_featured":"Female Year-End List 2017","url":"https://genius.com/Genius-users-female-year-end-list-2017-annotated","primary_artist":{"api_path":"/artists/226635","header_image_url":"https://images.genius.com/84cc3d01a49c09fe0e40fc9ab1dbbdd9.1000x495x1.png","id":226635,"image_url":"https://images.genius.com/572b51ce3c79ecabece7c4a976ba915f.1000x1000x1.png","is_meme_verified":false,"is_verified":false,"name":"Genius Users","url":"https://genius.com/artists/Genius-users"}}},{"highlights":[],"index":"song","type":"song","result":{"annotation_count":1,"api_path":"/songs/3161928","full_title":"L17 by ​KST","header_image_thumbnail_url":"https://images.genius.com/94a592f1a21786ebe8f18411a9f68feb.300x300x1.jpg","header_image_url":"https://images.genius.com/94a592f1a21786ebe8f18411a9f68feb.1000x1000x1.jpg","id":3161928,"lyrics_owner_id":93685,"lyrics_state":"complete","path":"/Kst-l17-annotated","pyongs_count":null,"song_art_image_thumbnail_url":"https://images.genius.com/94a592f1a21786ebe8f18411a9f68feb.300x300x1.jpg","song_art_image_url":"https://images.genius.com/94a592f1a21786ebe8f18411a9f68feb.1000x1000x1.jpg","stats":{"unreviewed_annotations":0,"hot":false},"title":"L17","title_with_featured":"L17","url":"https://genius.com/Kst-l17-annotated","primary_artist":{"api_path":"/artists/1173791","header_image_url":"https://images.genius.com/5d9fd826e38ad61f98aa9b6985263347.1000x263x121.gif","id":1173791,"image_url":"https://images.genius.com/666df3373a6179fd6c98d2abb1225a75.480x480x1.jpg","is_meme_verified":false,"is_verified":false,"name":"​KST","url":"https://genius.com/artists/Kst","iq":556892}}},{"highlights":[],"index":"song","type":"song","result":{"annotation_count":0,"api_path":"/songs/3382837","full_title":"HITS OF 2017 by T10MO","header_image_thumbnail_url":"https://images.genius.com/9bcb7384453051e15860b18d33fd2da2.300x169x1.jpg","header_image_url":"https://images.genius.com/9bcb7384453051e15860b18d33fd2da2.1000x563x1.jpg","id":3382837,"lyrics_owner_id":4848848,"lyrics_state":"complete","path":"/T10mo-hits-of-2017-lyrics","pyongs_count":null,"song_art_image_thumbnail_url":"https://images.genius.com/9bcb7384453051e15860b18d33fd2da2.300x169x1.jpg","song_art_image_url":"https://images.genius.com/9bcb7384453051e15860b18d33fd2da2.1000x563x1.jpg","stats":{"unreviewed_annotations":0,"hot":false},"title":"HITS OF 2017","title_with_featured":"HITS OF 2017","url":"https://genius.com/T10mo-hits-of-2017-lyrics","primary_artist":{"api_path":"/artists/1004029","header_image_url":"https://assets.genius.com/images/default_avatar_300.png?1567632499","id":1004029,"image_url":"https://assets.genius.com/images/default_avatar_300.png?1567632499","is_meme_verified":false,"is_verified":false,"name":"T10MO","url":"https://genius.com/artists/T10mo"}}},{"highlights":[],"index":"song","type":"song","result":{"annotation_count":0,"api_path":"/songs/389464","full_title":"Versace (remix) by Stefan The First","header_image_thumbnail_url":"https://assets.genius.com/images/default_cover_image.png?1567632499","header_image_url":"https://assets.genius.com/images/default_cover_image.png?1567632499","id":389464,"lyrics_owner_id":720795,"lyrics_state":"complete","path":"/Stefan-the-first-versace-remix-lyrics","pyongs_count":1,"song_art_image_thumbnail_url":"https://assets.genius.com/images/default_cover_image.png?1567632499","song_art_image_url":"https://assets.genius.com/images/default_cover_image.png?1567632499","stats":{"unreviewed_annotations":0,"hot":false},"title":"Versace (remix)","title_with_featured":"Versace (remix)","url":"https://genius.com/Stefan-the-first-versace-remix-lyrics","primary_artist":{"api_path":"/artists/334877","header_image_url":"https://assets.genius.com/images/default_avatar_300.png?1567632499","id":334877,"image_url":"https://assets.genius.com/images/default_avatar_300.png?1567632499","is_meme_verified":false,"is_verified":false,"name":"Stefan The First","url":"https://genius.com/artists/Stefan-the-first"}}},{"highlights":[],"index":"song","type":"song","result":{"annotation_count":300,"api_path":"/songs/3759189","full_title":"May 2019 Album Release Calendar by Genius","header_image_thumbnail_url":"https://images.genius.com/9a4199be89a393339c9b1f7681a45ebc.300x300x1.jpg","header_image_url":"https://images.genius.com/9a4199be89a393339c9b1f7681a45ebc.583x583x1.jpg","id":3759189,"lyrics_owner_id":498964,"lyrics_state":"complete","path":"/Genius-may-2019-album-release-calendar-annotated","pyongs_count":1,"song_art_image_thumbnail_url":"https://images.genius.com/9a4199be89a393339c9b1f7681a45ebc.300x300x1.jpg","song_art_image_url":"https://images.genius.com/9a4199be89a393339c9b1f7681a45ebc.583x583x1.jpg","stats":{"unreviewed_annotations":0,"hot":false,"pageviews":44974},"title":"May 2019 Album Release Calendar","title_with_featured":"May 2019 Album Release Calendar","url":"https://genius.com/Genius-may-2019-album-release-calendar-annotated","primary_artist":{"api_path":"/artists/204611","header_image_url":"https://images.genius.com/887be16f52b0dec817adc23304662df0.900x176x1.jpg","id":204611,"image_url":"https://images.genius.com/8ed669cadd956443e29c70361ec4f372.1000x1000x1.png","is_meme_verified":true,"is_verified":true,"name":"Genius","url":"https://genius.com/artists/Genius","iq":71903}}},{"highlights":[],"index":"song","type":"song","result":{"annotation_count":1,"api_path":"/songs/4244340","full_title":"Albums I've Listened To by Pessoa","header_image_thumbnail_url":"https://images.genius.com/2d4205a008afead38a93f1010ea27796.300x300x1.jpg","header_image_url":"https://images.genius.com/2d4205a008afead38a93f1010ea27796.500x500x1.jpg","id":4244340,"lyrics_owner_id":5667167,"lyrics_state":"complete","path":"/Pessoa-albums-ive-listened-to-annotated","pyongs_count":1,"song_art_image_thumbnail_url":"https://images.genius.com/2d4205a008afead38a93f1010ea27796.300x300x1.jpg","song_art_image_url":"https://images.genius.com/2d4205a008afead38a93f1010ea27796.500x500x1.jpg","stats":{"unreviewed_annotations":0,"hot":false},"title":"Albums I’ve Listened To","title_with_featured":"Albums I've Listened To","url":"https://genius.com/Pessoa-albums-ive-listened-to-annotated","primary_artist":{"api_path":"/artists/1385462","header_image_url":"https://images.genius.com/b68402036c1e29749f4c4558d030ee6f.300x169x160.gif","id":1385462,"image_url":"https://images.genius.com/382dfd1b83b1f76c3be23b914c6112e9.582x582x1.jpg","is_meme_verified":false,"is_verified":false,"name":"Pessoa","url":"https://genius.com/artists/Pessoa","iq":290108}}}]}};
    }

    ajax(args){
        args.success(this.templ);
    }


}
