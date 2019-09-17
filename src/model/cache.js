

class SpotifyCache {

    constructor(){
        this.key = 'spotify_cache';
    }

    clear(){
        var datastr = window.localStorage.setItem(this.key,
                                                  null);
    }
    cache(tracklist){
        var datastr = window.localStorage.setItem(this.key,
                                                  JSON.stringify(tracklist));
    }
    get(){
        console.log("todo get");
        var datastr = window.localStorage.getItem(this.key);
        console.log(datastr);
        if(datastr == null){
            return null;
        }
        return JSON.parse(datastr);
    }

    is_empty(){
        var data = this.get();
        return data==null;
    }
}
