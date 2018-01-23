
var COLORS = (function(){
    self.LIGHTRED = "#E57373"
    self.LIGHTGREEN = "#66BB6A"
    self.LIGHTYELLOW = "#FFD54F"
    self.LIGHTORANGE = "#FF9800"
    self.GREY = "grey"
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

  self.severity = {SEVERE:1,BAD:2,NOTGREAT:3}
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
  self.check = function(lyrics){
    words = lyrics.split(/\s+/)
    matches = [];

    for(idx in words){
      var word = words[idx];
      for(bad_word in corpus.indecent){
        if(self.match(word,bad_word)){
          matches.push(new Match(word,bad_word,corpus.indecent[bad_word],'indecent'))
        }
      }
      for(bad_word in corpus.profane){
          if(self.match(word,bad_word)){
            matches.push(new Match(word,bad_word,corpus.profane[bad_word],'profane'))
          }
      }
    }
    console.log(matches)
    return matches;

  };

    self.format = function(lyrics,fn,delim){
        lines = lyrics.split(/\n/);
        for(line_id in lines){
            words = lines[line_id].split(/\s+/);
            for(word_id in words){
                var word = words[word_id]
                for(bad_word in corpus.indecent){
                    if(self.match(word,bad_word)){
                        words[word_id] = fn(word,corpus.indecent[bad_word]);
                        console.log(words[word_id]);
                    }
                }
                for(bad_word in corpus.profane){
                    if(self.match(word,bad_word)){
                        words[word_id] = fn(word,corpus.profane[bad_word]);
                        console.log(words[word_id]);
                    }
                }
                lines[line_id] = words.join(' ')
            }
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
    color = COLORS.LIGHTGREEN
    if(score >= 1.0){
        color = COLORS.LIGHTRED
    }
    else if(score >= 0.5){
        color = COLORS.LIGHTORANGE
    }
    else if(score >= 0.25){
        color = COLORS.LIGHTYELLOW
    }
    if(track.profanity == undefined){
        color = COLORS.GREY;
    }
    $(div).css('background-color',color);

}

WORDCLOUD = null;

update_lyrics = function(track_id,playlist){
    track = playlist[track_id];
    color_track(track,entry);
    if($("#sidebar").attr('track-id') == track_id){
        update_sidebar(track_id,playlist);
    }
}
update_sidebar = function(track_id,playlist){
    track = playlist[track_id];

    $("#sidebar").attr('track-id',track_id)

    $("#track-song",$("#sidebar")).html(track.song)
    $("#track-artist",$("#sidebar")).html(track.artist)
    $("#track-album",$("#sidebar")).html(track.album)
    $("#track-label",$("#sidebar")).html(track.label)
    $("#track-year",$("#sidebar")).html(track.year)
    if(track.lyrics == undefined){
        $("#no-data").show();
        $("#data-exists").hide();
        $("#no-data").attr('track-id',track_id);
        return;
    }
    else{
        $("#no-data").hide();
        $("#data-exists").show();
    }
    var words = {};

    $("#lyrics").html(profanityAnalyzer.format(track.lyrics,function(ucword,score){
        word = ucword.toLowerCase()

        if(!(word in words)){
            words[word] = {text:word,size:12,color:"black"};
        }
        if(score == profanityAnalyzer.severity.SEVERE){
            color = COLORS.LIGHTRED;
            words[word].size += 6;
        }
        else if(score == profanityAnalyzer.severity.BAD){
            color = COLORS.LIGHTORANGE;
            words[word].size += 4;
        }
        else if(score == profanityAnalyzer.severity.NOTGREAT){
            color = COLORS.LIGHTYELLOW;
            words[word].size += 2;
        }
        return "<span style='background-color:"+color+"'>"+word+"</span>"
    },'<br>'));

    console.log(words)
    var wordlist = $.map(words,function(v,k){return v;})
    if(wordlist.length == 0){
        hide_wordcloud();
    }
    else{
        show_wordcloud();
        WORDCLOUD.stop()
            .words(wordlist)
            .font("Impact")
            .fontSize(function(d){return d.size;})
            .rotate(0)
            .on("end",draw_wordcloud)
            .start();
    }

}

render_profanity = function(playlist){
  for(trackid in playlist){
      track = playlist[trackid];
      entry = $("[trackid="+trackid+"]");
      if(track.lyric_state != undefined && track.lyric_state == "complete"){
          entry.click(function(){
              track_id = $(this).attr('trackid');
              update_sidebar(track_id,playlist);

          });

          color_track(track,entry);
      }
      else{
          entry.click(function(){
              track_id = $(this).attr('trackid');
              update_sidebar(track_id,playlist);
          });
          color_track(track,entry);
      }
      
  }

}

hide_wordcloud = function(){
    $("#wordcloud").hide();
}
show_wordcloud = function(){
    $("#wordcloud").show();
}
draw_wordcloud = function(words){
    console.log("DRAW",words)
    var w = $("#wordcloud").width()
    var h = $("#wordcloud").height()
    d3.select("#wordcloud-svg").selectAll("*").remove();
    d3.select("#wordcloud-svg")
        .attr("width",w)
        .attr("height",h)
        .append("g")
        .attr("transform","translate("+[w/2,h/2]+")")
        .attr("id","wcl")
        .selectAll("text")
        .data(words)
        .enter()
        .append('text')
        .style("font-size",function(d){return d.size + "pt";})
        .style("fill",function(d,i){return d.color;})
        .attr("transform",function(d){
            return "translate("+[d.x,d.y]+")"
        })
        .text(function(d){return d.text;});

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
    var canvas_h = $("#wordcloud").height()
    var canvas_w = $("#wordcloud").width()
    WORDCLOUD.size([canvas_w,canvas_h]).start()

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

    WORDCLOUD = d3.layout.cloud()
        .on('end',draw_wordcloud)
        .start();

    console.log(WORDCLOUD);
    $("#wordcloud").append(WORDCLOUD);

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
        var height = $(this).height(),
            scrollHeight = $(this).get(0).scrollHeight;
        var blockScrolling = this.scrollTop === scrollHeight - height && event.deltaY < 0 || this.scrollTop === 0 && event.deltaY > 0;
        return !blockScrolling
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
