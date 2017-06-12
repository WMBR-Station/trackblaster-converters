var SpotifyAuth = function(){
    this.state = 0
    this.redirect_uri = window.location.href.split("?")[0] 

    this.client_id = CLIENT_ID
    this.client_secret = CLIENT_SECRET 
    this.callbacks = [];
    console.log(this.redirect_uri)

    this.request_authorization = function(){
        var url = "https://accounts.spotify.com/authorize"
        var client_id = this.client_id;
        var data = {
            client_id: client_id,
            response_type: "code",
            redirect_uri: this.redirect_uri,
        }
        var final_url = url + "?" + $.param(data);
        window.location.replace(final_url);
        
    }

    this.get_authorization = function(){
        var payload = this.client_id + ":" + this.client_secret
        return 'Basic ' + window.btoa(unescape(encodeURIComponent(payload)))
    }

    this.get_access_token = function(){
        var url = "https://accounts.spotify.com/api/token"
        var data = {
            grant_type: "authorization_code",
            code:this.code,
            redirect_uri: this.redirect_uri,
            client_id: this.client_id,
            client_secret: this.client_secret
        }
        var that = this;
        $.ajax({
            method:"POST",
            url: url,
            data: data,
            dataType: "text",
            header: {
                'Accept': 'application/json, application/x-www-form-urlencoded',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            complete:function(r,data){
                console.log(r,data);
            }
        })
    }
    this.on_access_token = function(cbk){
        this.callbacks.push(cbk);
    }
    this.ready = function(){
        this.state = 2;
        for(var i =0; i < this.callbacks.length; i++){
            this.callbacks[i](this.access_token)
        }
        this.callbacks = [];
    }
    this.store_access_token = function(data){
        var expiration_time = new Date();
        expiration_time.setSeconds(expiration_time.getSeconds() + data.expires_in)
        localStorage["spotify_access_token"] = data.access_token;
        localStorage["spotify_expiration"] = expiration_time;
        localStorage["spotify_refresh_token"] = data.refresh_token;
        
    }
    this.update_access_token = function(data){
        var expiration_time = new Date();
        expiration_time.setSeconds(expiration_time.getSeconds() + data.expires_in)
        localStorage["spotify_access_token"] = data.access_token;
        localStorage["spotify_expiration"] = expiration_time;
        
    }
    this.refresh_access_token = function(){
        var url = "https://accounts.spotify.com/api/token"
        var data = {
            grant_type : "refresh_token",
            refresh_token: localStorage["spotify_refresh_token"]
        }
        var that = this;
        $.ajax({
            method:"POST",
            url:url,
            data:data,
            headers:this.get_header(),
            success:function(data){
                console.log("successfully refreshed token")
                that.update_access_token(data);
                that.ready();
            },
            error:function(error){
                console.log("failed to refresh token")
                console.log(error);
            }
        })
        
    }
    this.detect_state = function(){
        var curr_url = new URL (window.location)
        var params = new URLSearchParams(curr_url.search);
        this.state = 0;
        if(params.has("code")){
            this.code = params.get('code');
            this.state = 1;
        }
        else if(params.has("error")){
            this.state = -1;
        }
        else if(localStorage.getItem("spotify_access_token") !== null){
            this.access_token = localStorage.getItem("spotify_access_token");
            this.refresh_token = localStorage.getItem("spotify_refresh_token");
            this.expiration = localStorage.getItem("spotify_expiration");

            if(new Date() >= this.expiration){
                this.state = 3;
            }
            else{
                this.state = 2;
            }
        }

    }

    this.authorize = function(){
        this.detect_state();
        console.log(this.state);
        if(this.state == 0){
            this.request_authorization();
        }
        else if(this.state == 1){
            this.get_access_token();
        }
        else if(this.state == 3){
            this.refresh_access_token();
        }
        else{
            this.ready();
        }
    }

}
