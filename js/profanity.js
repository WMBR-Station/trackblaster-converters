
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


display_playlist = function(playlist){
  var parent = $(".track-box")
  var templ = $('.templ',$("#details"))

  for(trackid in playlist){
    var track = playlist[trackid]
    console.log(track)
    var track_el = templ.clone()
    .removeClass('templ hidden').attr('trackid',trackid)
    $('.artist',track_el).html(track.artist)
    $('.song',track_el).html(track.song)
    $('.album',track_el).html(track.album)
    parent.append(track_el)
  }

}

screen_track = function(trackid,playlist,track_cbk,done_cbk){
  if(playlist.length <= trackid){
    console.log('<DONE>')
    done_cbk();
    return;
  }
  console.log('-> Track '+(trackid));
  var track = playlist[trackid]
  lyricEngine.get_lyrics(track.song,track.artist,track.album, function(lyricobj,error){
      if(lyricobj != null && lyricobj != undefined){
          track.genius = lyricobj;
          if(track.genius.lyrics != null && track.genius.lyrics != undefined ){
              bad_words = profanityAnalyzer.check(track.genius.lyrics);
              track.profanity = bad_words;
              track.lyric_state = track.genius.lyrics_state;
              track.lyrics = track.genius.lyrics;
          }
          else{
              track.profanity = undefined;
              track.lyric_state = "unknown"
              track.lyrics = null;
          }
      }
      else{
        console.log("ERROR",error)
      }
      track_cbk(trackid)
      screen_track(trackid+1,playlist,track_cbk,done_cbk)

  })
}

color_track = function(track,div){
    if(track.profanity != undefined){
      score = 0;
      for(i in track.profanity){
        word = track.profanity[i]
        score += 1.0 / word.severity
      }
      color = STATUS.get_status(score)
    }
    else{
      color = STATUS.get_status(undefined)
    }
    console.log(track,color)
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

render_profanity_track = function(playlist,trackid){
    track = playlist[trackid];
    entry = $("[trackid="+trackid+"]")
    swatch = $(".swatch",entry)
    entry.click((function(tid){
      return function(){
        update_sidebar(tid,playlist);
      }
    })(trackid));

    color_track(track,swatch);
}
render_profanity = function(playlist){
  for(trackid in playlist){
    render_profanity_track(trackid)
  }
}
screen_playlist = function(playlist){
    screen_track(0,playlist,
      function(tid){
        render_profanity_track(playlist,tid)
      },
      function(){
      }
    )
}


function assert(cond){
    if(! cond){
        throw "Assertion Failed"
    }
}


DEBUG = false

save_lyrics = function(track_id,lyrics,playlist){
    playlist[track_id] = track

    bad_words = profanityAnalyzer.check(lyrics);
    track.lyrics = lyrics
    track.profanity = bad_words;
    track.lyric_state = 'local';
    $(".track-box").empty();
    display_playlist(playlist);
    render_profanity(playlist);

    update_sidebar(track_id,playlist);
    console.log("SAVING",lyrics)
}


data = {}
$(document).ready(function(){
    data.view = new MasterView()
    data.uploader = new FileUploader("#upload-dialog",data.view.trackview)
    data.uploader.mock()

    $(window).resize(function(){
        data.view.resize()
    })

    $('.toggled').toggleClass('toggle')

    $(".steal-scroll").off('mousewheel').on("mousewheel", function(event){
        return true
    })

})
