
var LyricEngine = function(){

  self.access_token = 'JispcI7JETA2nLAFyab6ylOsdwtWKXj49QJ0NUFfpK5LqQydCU2-e83D_lqcCyvs'

  self.get_song_id = function(song,artist,album,cbk){
    var base_url = "https://api.genius.com/search";
      // ?artist=".$artist."&song=".$song
      var query = song+" "+artist;
      var qset = FuzzySet();
      qset.add(query);;

      $.ajax({
        method:'GET',
        url:base_url,
        data: {
            q:query,
            'access_token': self.access_token
        },
        success: function(data,error){
            console.log(data,error)
            if(data.response.hits.length > 0){
                console.log(data.response.hits,artist,song);
                for(hitno in data.response.hits){
                    result = data.response.hits[hitno].result;
                    matches = qset.get(result.full_title)
                    console.log(matches,result.full_title,song,artist);
                    if(matches != null && matches.length > 0){
                        cbk(result,null)
                        return;
                    }
                }
                cbk(null,{message:'song mismatch'})
            }
            else{
            cbk(null,{message:'no results found'})
            }
        },
        error: function(error){
            cbk(null,error)
        }
      })
  }

  self.get_song_lyrics = function(result,cbk){
      base_url = "lyric_retreiver.php"
      console.log(result);
      path = result.path.split('/')[1];
      data = {method:'get_lyrics',path:btoa(path)};

      $.get({
        url :base_url,
        data:data,
        success: function(data,error){
          lyrics = atob(data)
          verses =lyrics.split("<div class=\"lyrics\">")[1].split("</div>")[0]
          lyric_text = $(verses).text();
          cbk(lyric_text)
        },
        error: function(data,error){
          cbk(null,error);
        }
      })
  }

  self.get_lyrics = function(song,artist,album,cbk){
    self.get_song_id(song,artist,album,function(result,error){
      if(result != null && result != undefined){
            self.get_song_lyrics(result,function(data,error){
              if(data != null && data != undefined){
                result.lyrics = data;
                cbk(result);
              }
              else {
                result.lyrics = null
                cbk(result);
              }
            })
      }
      else{
          cbk(null);
      }
    })
  }

  return this;
}

var lyricEngine = LyricEngine()
