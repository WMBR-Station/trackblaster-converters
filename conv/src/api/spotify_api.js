var SpotifyAPI = function(){
    var State = {
        PENDING: "pending",
        READY: "ready"
    }
    this.state = State.PENDING
    this.redirect_uri = window.location.href.split("?")[0] 

    this.spotify_page = "spotify.php"
    this.client_id = SPOTIFY_CLIENT_ID
    this.client_secret = SPOTIFY_CLIENT_SECRET 
    this.callbacks = [];
    console.log(this.redirect_uri)

    this.oauth.on_access_token(function(at){
        console.log("READY");
    })
    this.oauth.authorize()

    this.request_authorization = function(){
        var url = "https://accounts.spotify.com/authorize"
        var client_id = this.client_id;
        var data = {
            client_id: client_id,
            response_type: "token",
            redirect_uri: this.redirect_uri,
        }
        var final_url = url + "?" + $.param(data);
        window.location.replace(final_url);
    }

    this.ajax = function(obj){
        if(this.access_token_valid()){
            if("headers" in obj){
                obj.headers['Authorization'] = 'Bearer ' + this.access_token
            }
            else{
                obj.headers = {'Authorization': 'Bearer '+this.access_token}
            }
            $.ajax(obj);
        }
        else {
            console.log("access token expired");
            this.request_authorization();
        }
    }

    this.access_token_valid = function(){
        console.log(this.access_token,this.expiration_time)
        if(this.access_token != undefined && this.access_token != null){
            var curr_time = new Date();
            console.log(curr_time, this.expiration_time)
            if(curr_time < this.expiration_time){
                return true;
            }
        }
        return false;
        
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
            headers: {
                "Access-Control-Allow-Origin":this.redirect_uri,
                'Accept': 'application/json, application/x-www-form-urlencoded',
                'Access-Control-Allow-Methods': 'GET, POST, PUT',
                'Access-Control-Allow-Headers': 'Content-Type',
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

    this.ready = function(data){
        this.state = State.READY;
        this.access_token = data.access_token;
        this.expiration_time = data.expiration_time;

        for(var i =0; i < this.callbacks.length; i++){
            this.callbacks[i](data.access_token)
        }
        this.callbacks = [];
    }
    this.set_access_token = function(data){
        var expiration_time = new Date();
        var curr_seconds = expiration_time.getSeconds()
        expiration_time.setSeconds(curr_seconds + data.expires_in)
        this.access_token = data.access_token;
        this.expiration_time = expiration_time;

        localStorage["spotify_access_token"] = this.access_token;
        localStorage["spotify_expiration"] = this.expiration_time;
        
    }
    
   
    this.detect_state = function(){
        var curr_url = new URL (window.location)
        var params = new URLSearchParams(curr_url.hash.replace("#","?"));
        var data = {}
        this.state = State.PENDING;
        if(params.has("access_token")){
            data.access_token = params.get('access_token');
            data.expires_in = parseInt(params.get('expires_in'));
            this.state = State.HAS_TOKEN;
        }
        else if(params.has("error")){
            this.state = State.ERROR;
        }
        else if(localStorage.getItem("spotify_access_token") !== null){
            var data = {}
            data.access_token = localStorage.getItem("spotify_access_token");
            var expiration_time_str = localStorage.getItem("spotify_expiration").split("\"")[1];
            data.expiration_time = Date.parse(expiration_time_str);
            var curr_time = new Date()
            if(curr_time >= data.expiration_time ){
                this.state = State.EXPIRED;
            }
            else{
                this.state = State.READY;
            }
        }
        return data

    }

    this.authorize = function(){
        this.detect_state();
        //first request
        if(this.state == State.PENDING){
            this.request_authorization();
        }
        //retreived access token
        else if(this.state == State.HAS_TOKEN){
            this.set_access_token(data);
        }
        //expired
        else if(this.state == State.EXPIRED){
            this.request_authorization();
        }
        else if(this.state == State.READY){
            this.ready(data);
        }
        throw ("unknown state: " + this.state)
    }

}
