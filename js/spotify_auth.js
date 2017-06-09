var SpotifyAuthWorkflow = function(){
    this.state = 0
    this.redirect_uri = "http://curious-cube.csail.mit.edu:8000/spotify.html"

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
        return;
        window.location.replace(final_url);
        
    }

    this.get_header = function(){
        var payload = this.client_id + ":" + this.client_secret
        return "Basic "+btoa(payload)
    }

    this.get_access_token = function(){
        var url = "https://accounts.spotify.com/api/token"
        var data = {
            grant_type: "authorization_code",
            code:this.code,
            redirect_uri: this.redirect_url
        }
        var that = this;
        $.ajax({
            method:"POST",
            url:url,
            data:data,
            beforeSend:function(request){
                request.setRequestHeader("Authorization",that.get_header());
                request.setRequestHeader("Access-Control-Allow-Origin","*");
            },
            success:function(data){
                console.log("successfully request access token")
                that.store_access_token(data);
                that.ready();
            },
            failure:function(){
                console.log("failed to request authorization")
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
            failure:function(){
                console.log("failed to refresh token")
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
        else if(param.has("error")){
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
