
var STATUS = (function(){
    self.VERYBAD = "verybad"
    self.BAD = "bad"
    self.WARN = "warn"
    self.OK = "ok"
    self.UNKNOWN= "unknown"
    self.LOADING = "loading"
    self.get_status = function(score){
      if(score == undefined){
        return self.UNKNOWN
      }
      if(score >= 0.7){
        return self.VERYBAD
      }
      else if(score >= 0.5){
        return self.BAD
      }
      else if(score > 0.0){
        return self.WARN
      }
      else{
        return self.OK
      }
    }
    return self;

})()

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

var Match = function(word,bad_word,severity,category){
  this.init = function(base_word,bad_word,severity,category){
    this.word = base_word;
    this.profanity = bad_word;
    this.severity = severity;
    this.category = category;
  }
  this.init(word,bad_word,severity,category)
}


var ProfanityAnalyzer = function(){

  self.severity = {SEVERE:1.0,BAD:0.69,NOTGREAT:0.29}
  self.corpus = {
    profane: {
        'fuck':self.severity.SEVERE,
        'fucka':self.severity.SEVERE,
        'fucking':self.severity.SEVERE,
        'fucker':self.severity.SEVERE,
        'motherfucker':self.severity.SEVERE,
        'motherfuck':self.severity.SEVERE,
        'shit':self.severity.SEVERE,
        'cunt':self.severity.SEVERE,
        'faggot':self.severity.SEVERE,
        'fag':self.severity.SEVERE,
        'nigger':self.severity.SEVERE,
        'niglet':self.severity.SEVERE,
        'nigga':self.severity.SEVERE,
        'niggas':self.severity.SEVERE,
        'niggers':self.severity.SEVERE,
        'nut sack':self.severity.SEVERE,
        'bitch':self.severity.BAD,
        'whore':self.severity.BAD,
        'negro':self.severity.BAD,
        'pecker':self.severity.BAD,
        'pussy':self.severity.BAD,
        'pussies':self.severity.BAD,
        'dike':self.severity.BAD,
        'dyke':self.severity.BAD,
        'bastard':self.severity.BAD,
        'spick':self.severity.BAD,
        'splooge':self.severity.BAD,
        'gringo':self.severity.BAD,
        'gooch':self.severity.BAD,
        'gook':self.severity.BAD,
        'kike':self.severity.BAD,
        'kyke':self.severity.BAD,
        'hell':self.severity.NOTGREAT,
        'douche':self.severity.NOTGREAT,
        'schlong':self.severity.NOTGREAT,
        'damn':self.severity.NOTGREAT,
        'ass': self.severity.NOTGREAT,
        'fatass': self.severity.NOTGREAT,
        'asshole': self.severity.NOTGREAT,
        'slut': self.severity.NOTGREAT,
      },
      indecent: {
        'cock': self.severity.BAD,
        'dick': self.severity.BAD,
        'feltch': self.severity.BAD,
        'vagina': self.severity.BAD,
        'penis': self.severity.BAD,
        'testicle': self.severity.BAD,
        'clit': self.severity.BAD,
        'jizz': self.severity.BAD,
        'queef': self.severity.BAD,
        'rimjob': self.severity.BAD,
        'cum': self.severity.BAD,
        'cunt': self.severity.BAD,
        'handjob': self.severity.BAD,
        'hard on': self.severity.BAD,
        'humping': self.severity.BAD,
        'cunnilingus': self.severity.BAD,
        'anus': self.severity.BAD,
        'anal': self.severity.BAD,
        'asslicker': self.severity.BAD,
        'buttfucker': self.severity.BAD,
        'beaner': self.severity.BAD,
        'sex': self.severity.NOTGREAT,
        'tit': self.severity.NOTGREAT,
      }
  }
  self.match = function(word,bad_word){
    return word.toLowerCase() == bad_word

  }
  self.check_word = function(word){
      for(bad_word in corpus.indecent){
        if(self.match(word,bad_word)){
          return new Match(word,bad_word,corpus.indecent[bad_word],'indecent')
        }
      }
      for(bad_word in corpus.profane){
          if(self.match(word,bad_word)){
            return new Match(word,bad_word,corpus.profane[bad_word],'profane')
          }
      }
      return undefined
  }
  self.check = function(lyrics){
    words = lyrics.split(/\s+/)
    matches = [];

    for(idx in words){
      var word = words[idx];
      match = self.check_word(word)
      if(match != undefined){
        matches.push(match)
      }
    }
    return matches;

  };
  self.format_word = function(word,fn){
      for(bad_word in corpus.indecent){
          if(self.match(word,bad_word)){
            return fn(word,corpus.indecent[bad_word])
          }
      }
      for(bad_word in corpus.profane){
          if(self.match(word,bad_word)){
            return fn(word,corpus.profane[bad_word])
          }
      }
      return undefined
  }
    self.format = function(lyrics,fn,delim){
        lines = lyrics.split(/\n/);
        for(line_id in lines){
            words = lines[line_id].split(/\s+/);
            for(word_id in words){
                var word = words[word_id]
                match = self.format_word(word,fn)
                if(match != undefined){
                  words[word_id] = match
                }

            }
            lines[line_id] = words.join(' ')
        }
        return lines.join(delim);


    };

    return this;
}

var lyricEngine = LyricEngine()
var profanityAnalyzer = ProfanityAnalyzer()

parse_playlist = function(content){
  var entries = content.split("\n")
  var argline = entries[0]
  var args = argline.split('\t')

  tracks = [];
  for(id in entries){
      if(id == 0){
          continue;
      }
      var entry = entries[id];
      vals = entry.split('\t');
      track = {};
      for(idx in vals){
          track[args[idx].toLowerCase()] = vals[idx];
      }
      if(track.artist != "" && track.song != ""){
          tracks.push(track);
      }
  }
  console.log(tracks)
  return tracks;
}

display_playlist = function(playlist){
  var parent = $("#details")
  var templ = $('.templ',parent)

  for(trackid in playlist){
    var track = playlist[trackid]
    console.log(track)
    var track_el = templ.clone().removeClass('templ hidden').attr('trackid',trackid)
    $('.artist',track_el).html(track.artist)
    $('.song',track_el).html(track.song)
    $('.album',track_el).html(track.album)
    parent.append(track_el)
  }

}

screen_track = function(trackid,playlist,cbk){
  if(playlist.length <= trackid){
    console.log('Render..')
    cbk()
    return;
  }
  console.log('-> Track '+(trackid));
  var track = playlist[trackid]
  lyricEngine.get_lyrics(track.song,track.artist,track.album, function(lyricobj,error){
      if(lyricobj != null && lyricobj != undefined){
          track.genius = lyricobj;
          console.log(track);
          if(track.genius.lyrics != null && track.genius.lyrics != undefined ){
              bad_words = profanityAnalyzer.check(track.genius.lyrics);
              track.profanity = bad_words;
              track.lyric_state = track.genius.lyrics_state;
              track.lyrics = track.genius.lyrics;
              cbk()
          }
          else{
              track.profanity = [];
              track.lyric_state = "unknown"
              track.lyrics = null;

          }
      }
      else{
        console.log("ERROR",error)
      }
      screen_track(trackid+1,playlist,cbk)

  })
}

color_track = function(track,div){
    score = 0;

    for(i in track.profanity){
        word = track.profanity[i]
        score += 1.0 / word.severity
    }
    if(track.profanity != undefined){
      color = STATUS.get_status(score)
    }
    else{
      color = STATUS.get_status(undefined)
    }
    $(div).removeClass("loading");
    $(div).addClass(color);

}

WORDCLOUD = null;

update_lyrics = function(track_id,playlist,lyrics){
    track = playlist[track_id];
    track.lyrics = lyrics
    bad_words = profanityAnalyzer.check(track.lyrics);
    track.profanity = bad_words;
    track.lyric_state = "complete"
    entry = $("[trackid="+track_id+"]");
    color_track(track,$(".swatch",entry));
    if($("#sidebar").attr('track-id') == track_id){
        update_sidebar(track_id,playlist);
    }
}

select_profanity = function(word){
  selector = $(".profanity-selector")
  idx = selector.attr('index')
  cword = selector.attr('word')
  profanity_box = $(".profanity-box")
  lyrics_box = $(".lyrics-box")
  this_count = $("[word_key='"+word+"']",profanity_box).attr('word_count')
  if(cword == word){
    idx = (idx + 1) % this_count
  }
  else{
    idx = 0
  }
  selector.attr('word',cword).attr('index',idx)
  this_span = $("[word_key='"+word+"'][word_idx='"+idx+"']",lyrics_box)
  lyrics_box.scrollTop(0)
  span_offset = this_span.offset().top
  par_offset = lyrics_box.offset().top
  offset = span_offset - par_offset
  curr_scroll = lyrics_box.scrollTop()
  lyrics_box.scrollTop(offset-10)
}
update_sidebar_lyrics = function(lyrics,lyrics_div){
  var words = {}
  var add_word = function(word,word_span,severity){
    var key = word.toLowerCase()
    if(! (key in words)){
        words[key] = {count:0,severity:severity}
    }
    idx = words[key].count
    words[key].count += 1
    word_span.attr('word_idx',idx)
    word_span.attr('word_key',key)
  }
  lyrics_div.empty()
  lines = lyrics.split('\n')
  for(lineno in lines){
    line = lines[lineno]
    wordlist = line.split(' ')
    line_div = $("<div/>")
    for(wordidx in wordlist){
        word = wordlist[wordidx]
        word_span = $("<span/>").html(word).addClass('word')
        result = profanityAnalyzer.check_word(word)
        if(result != undefined){
          add_word(word,word_span,result.severity)
          status = STATUS.get_status(result.severity)
          word_span.addClass(status)
        }
        line_div.append(word_span)
    }
    lyrics_div.append(line_div)
  }
  $(".profanity-box").empty()
  for(word in words){
    nwords = words[word].count
    severity = words[word].severity
    new_word = $("<div/>").addClass('bad-word')
    status = STATUS.get_status(severity)
    new_word.html(word+" ("+(nwords)+")")
    .attr('word_key',word).attr('word_count',nwords)
    .addClass(status)
    new_word.click((function(w){return function(){
      select_profanity(w)
    }})(word))
    $(".profanity-box").append(new_word)

  }
}
update_sidebar = function(track_id,playlist){
    track = playlist[track_id];
    track_row = $("[trackid="+track_id+"]")
    $(".track-entry").removeClass("selected")
    track_row.addClass("selected")
    $("#sidebar").attr('track-id',track_id).show()

    $("#track-song",$("#sidebar")).html(track.song)
    $("#track-artist",$("#sidebar")).html(track.artist)
    $("#track-album",$("#sidebar")).html(track.album)
    $("#track-label",$("#sidebar")).html(track.label)
    $("#track-year",$("#sidebar")).html(track.year)
    if(track.lyrics == undefined){
        $("#no-data").show();
        $("#data-exists").hide();
        $("#new-lyrics").attr('track-id',track_id);
        return;
    }
    else{
        $("#no-data").hide();
        $("#data-exists").show();
    }
    var words = {};

    update_sidebar_lyrics(track.lyrics,$("#lyrics"))
}

render_profanity = function(playlist){
  for(trackid in playlist){
      track = playlist[trackid];
      entry = $("[trackid="+trackid+"]")
      swatch = $(".swatch",entry)
      if(track.lyric_state != undefined && track.lyric_state == "complete"){
          entry.click(function(){
              track_id = $(this).attr('trackid');
              update_sidebar(track_id,playlist);

          });

          color_track(track,swatch);
      }
      else{
          entry.click(function(){
              track_id = $(this).attr('trackid');
              update_sidebar(track_id,playlist);
          });
          color_track(track,swatch);
      }

  }

}
screen_playlist = function(playlist){
    screen_track(0,playlist,function(){
      render_profanity(playlist);
    })
}

populate_playlist_from_text = function(content){
    tracks = parse_playlist(content);
    pl = tracks;
    display_playlist(pl);
    screen_playlist(pl);
    return pl
}

populate_mock_playlist = function(content){
    pl = MOCK_PLAYLIST
    display_playlist(pl)
    render_profanity(pl)
    return pl

}
populate_playlist_from_file = function(content,cbk){
    fr = new FileReader();
    fr.onload = function(){
        pl = populate_playlist_from_text(fr.result)
        cbk(pl)
    }
    fr.readAsText(content)

}

DEBUG = true
resize_sidebar = function(content){
    var window_height = $(window).height();
    var sidebar_width = $("#sidebar").width();
    var header_height = $(".panel-heading").height();
    var footer_height = $(".panel-footer").height();

    $("#sidebar").height(window_height - header_height - footer_height)
    $("#details").height(window_height - header_height - footer_height)

}

open_lyrics_search = function(song,artist){
    query = song + " " + artist + " lyrics"
    url = "https://www.google.com/search?q="+encodeURIComponent(query)
    window.open(url)

}
save_lyrics = function(track_id,lyrics,playlist){
    playlist[track_id] = track

    bad_words = profanityAnalyzer.check(lyrics);
    track.lyrics = lyrics
    track.profanity = bad_words;
    track.lyric_state = 'local';

    display_playlist(playlist);
    render_profanity(playlist);

    update_sidebar(track_id,playlist);
    console.log("SAVING",lyrics)
}
$(document).ready(function(){
    var url = new URL(self.location);
    var playlist_args = url.searchParams.get("playlist");
    var playlist = null
    //populate_mock_playlist("MOCK DATA");


    console.log(WORDCLOUD);
    $("#sidebar").hide()

    $(window).resize(function(){
        resize_sidebar();
    })
    resize_sidebar();

    $("#search-lyrics").click(function(){
        song = $("#track-song", $("#sidebar")).html()
        artist = $("#track-artist", $("#sidebar")).html()
        open_lyrics_search(song,artist)
    })

    $("#save-lyrics").click(function(){
        track_id = $("#sidebar").attr('track-id')
        new_lyrics = $("#new-lyrics").val()
        save_lyrics(track_id,new_lyrics,playlist)
        $("#new-lyrics").val('')
    })
    $(".steal-scroll").off('mousewheel').on("mousewheel", function(event){
        return true
    })


    if(DEBUG){
        playlist = populate_mock_playlist()
    }
    else if(playlist_args != undefined && playlist_args != null){
        console.log(playlist)
        playlist = populate_playlist_from_text(atob(playlist))
    }


    $("#file").change(function(){
        console.log($(this).val())
        if($(this).prop('files').length > 0){
            var f = $(this).prop('files')[0]
            populate_playlist_from_file(f,function(pl){
                playlist = pl
            })
        }
    })
})
