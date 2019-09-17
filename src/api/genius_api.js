

class GeniusLyricAPI{
    constructor(){}

    get(args){
	var that = this;
	console.log(args.lyric_path);
        $.get({
            url: 'router.php/get_lyrics',
            data: {
                path:btoa(args.lyric_path)
            },
            success: function(data){
		var lyrics = atob(data);
                var parsed =lyrics.split("<div class=\"lyrics\">");
		if(parsed.length == 1){
		   args.error("failed to get lyrics: could not find lyrics in html");
		   return;
		}
		var verses = parsed[1].split("</div>")[0];
                var lyrics_text = $(verses).text();
		args.success(lyrics_text);
            },
            error: function(data){
                args.error(data);
            }
        });
    }
}

class GeniusAPI {

    constructor(){
        this.access_token = GENIUS_ACCESS_TOKEN;
    }

    ajax(args){
        $.ajax({
            method:'GET',
            url:args.url,
            data: {
                q:args.query,
                access_token: this.access_token
            },
            success : function(data){
                args.success(data);
            },
            error: function(err){
                args.error(data);
            }
        });
    }
}
