
var ProfaneWord = function(word,bad_word,severity,category){
  this.init = function(bad_word,severity,category){
    this.profanity = bad_word;
    this.severity = severity;
    this.category = category;
  }
  this.init(word,bad_word,severity,category)
}


var ProfanityAnalyzer = function(){
  cursing = Globals.CATEGORY.CURSING
  this.corpus = {}
  this.corpus[Globals.CATEGORY.CURSING] =  {
        'fuck':Globals.SEVERITY.SEVERE,
        'fucka':Globals.SEVERITY.SEVERE,
        'fucking':Globals.SEVERITY.SEVERE,
        'fucker':Globals.SEVERITY.SEVERE,
        'motherfucker':Globals.SEVERITY.SEVERE,
        'motherfuck':Globals.SEVERITY.SEVERE,
        'shit':Globals.SEVERITY.SEVERE,
        'cunt':Globals.SEVERITY.SEVERE,
        'faggot':Globals.SEVERITY.SEVERE,
        'fag':Globals.SEVERITY.SEVERE,
        'nigger':Globals.SEVERITY.SEVERE,
        'niglet':Globals.SEVERITY.SEVERE,
        'nigga':Globals.SEVERITY.SEVERE,
        'niggas':Globals.SEVERITY.SEVERE,
        'niggers':Globals.SEVERITY.SEVERE,
        'nut sack':Globals.SEVERITY.SEVERE,
        'bitch':Globals.SEVERITY.BAD,
        'whore':Globals.SEVERITY.BAD,
        'negro':Globals.SEVERITY.BAD,
        'pecker':Globals.SEVERITY.BAD,
        'pussy':Globals.SEVERITY.BAD,
        'pussies':Globals.SEVERITY.BAD,
        'dike':Globals.SEVERITY.BAD,
        'dyke':Globals.SEVERITY.BAD,
        'bastard':Globals.SEVERITY.BAD,
        'spick':Globals.SEVERITY.BAD,
        'splooge':Globals.SEVERITY.BAD,
        'gringo':Globals.SEVERITY.BAD,
        'gooch':Globals.SEVERITY.BAD,
        'gook':Globals.SEVERITY.BAD,
        'kike':Globals.SEVERITY.BAD,
        'kyke':Globals.SEVERITY.BAD,
        'hell':Globals.SEVERITY.NOTGREAT,
        'douche':Globals.SEVERITY.NOTGREAT,
        'schlong':Globals.SEVERITY.NOTGREAT,
        'damn':Globals.SEVERITY.NOTGREAT,
        'ass': Globals.SEVERITY.NOTGREAT,
        'fatass': Globals.SEVERITY.NOTGREAT,
        'asshole': Globals.SEVERITY.NOTGREAT,
        'slut': Globals.SEVERITY.NOTGREAT,
  };
  this.corpus[Globals.CATEGORY.INDECENCY] = {
        'cock': Globals.SEVERITY.BAD,
        'dick': Globals.SEVERITY.BAD,
        'feltch': Globals.SEVERITY.BAD,
        'vagina': Globals.SEVERITY.BAD,
        'penis': Globals.SEVERITY.BAD,
        'testicle': Globals.SEVERITY.BAD,
        'clit': Globals.SEVERITY.BAD,
        'jizz': Globals.SEVERITY.BAD,
        'queef': Globals.SEVERITY.BAD,
        'rimjob': Globals.SEVERITY.BAD,
        'cum': Globals.SEVERITY.BAD,
        'cunt': Globals.SEVERITY.BAD,
        'handjob': Globals.SEVERITY.BAD,
        'hard on': Globals.SEVERITY.BAD,
        'humping': Globals.SEVERITY.BAD,
        'cunnilingus': Globals.SEVERITY.BAD,
        'anus': Globals.SEVERITY.BAD,
        'anal': Globals.SEVERITY.BAD,
        'asslicker': Globals.SEVERITY.BAD,
        'buttfucker': Globals.SEVERITY.BAD,
        'beaner': Globals.SEVERITY.BAD,
        'sex': Globals.SEVERITY.NOTGREAT,
        'tit': Globals.SEVERITY.NOTGREAT,
    }
    self.match_word = function(word,bad_word){
        return word.toLowerCase() == bad_word
    }
    self.check_word = function(word){
        for(category in corpus){
            for(bad_word in corpus[category]){
                if(self.match_word(word,bad_word)){
                    return new ProfaneWord(bad_word,
                                          corpus[category][bad_word],
                                          category)
                }
            }
        }
        return undefined
  }
  return this;
}

var profanityAnalyzer = ProfanityAnalyzer()

