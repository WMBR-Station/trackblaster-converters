var ProfanityLevel = {
    SEVERE: "severe",
    BAD: "bad",
    MILD: "mild",
    GOOD: "good",
    UNKNOWN: "unknown"
}

SEVERE_WORDS = [
    "fuck", "fucka", "fucking", "fucker", "motherfucker", "motherfuck",
    "shit", "cunt", "faggot", "nigger", "niglet", "nigga", "niggers",
    "spick"
]

BAD_WORDS = [
    "bitch","whore","negro","pecker","cock","pussy","pussies", "dike",
    "dyke","bastard", "splooge","gringo","gooch","gook","kike","kyke",
    "dick","feltch","vagina","penis","testicle","clit","jizz","queef",
    "rimjob","cum","handjob","hard on","hard-on","humping",
    "cunnilingus","anus","anal","asslicker","buttfucker","beaner"
]

MILD_WORDS = [
    "hell","douche","schlong","damn","ass","fatass","asshole","slut",
    "sex","tit","tits","boobs"
]

function annotate_word(token){
    var token_lower = token.toLowerCase();
    if(SEVERE_WORDS.indexOf(token_lower) >= 0){
        return ProfanityLevel.SEVERE;
    }
    else if(BAD_WORDS.indexOf(token_lower) >= 0){
        return ProfanityLevel.BAD;
    }
    else if(MILD_WORDS.indexOf(token_lower) >= 0){
        return ProfanityLevel.MILD;
    }
    return null;
}
function compute_profanity_score(counts){
    if(ProfanityLevel.SEVERE in counts){
        return ProfanityLevel.SEVERE;
    }
    else if(ProfanityLevel.BAD in counts){
        return ProfanityLevel.BAD;
    }
    else if(ProfanityLevel.MILD in counts){
        return ProfanityLevel.MILD;
    }
    else {
        return ProfanityLevel.GOOD;
    }
}
function scan_for_profanity(lyrics){
    var iterator = lyrics.tokens();
    var term = iterator.next();
    var annots = {};
    while(!term.done){
        var line_no = term.value[0];
        var token_no = term.value[1];
        var token = term.value[2];
        var annotation = annotate_word(token);
        if(annotation){
            lyrics.annotate(line_no,token_no,annotation);
            if(!(annotation in annots)){
                annots[annotation] = 0;
            }
            console.log(annots)
            annots[annotation] += 1;
        }
        term = iterator.next();
    }
    lyrics.status = LyricStatus.ANALYZED;
    lyrics.severity = compute_profanity_score(annots);
}
