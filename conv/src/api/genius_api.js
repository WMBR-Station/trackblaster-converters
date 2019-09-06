

class GeniusLyricAPI{
    constructor(){}

    get(args){
        $.get({
            url: 'router.php/get_lyrics',
            data: {
                path:btoa(that.lyric_path)
            },
            success: function(data){
                args.success(atob(data));
            },
            error: function(data){
                var verses =data.split("<div class=\"lyrics\">")[1]
                    .split("</div>")[0];
                var lyric_text = $(verses).text();
                args.error(lyric_text);
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
