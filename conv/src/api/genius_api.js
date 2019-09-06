
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
