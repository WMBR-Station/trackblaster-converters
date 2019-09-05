

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
