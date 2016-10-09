var TimeCode = function(h,m,s,ms){
    if(m != undefined){
	this.time = moment();
	this.time.hour(h)
	this.time.minute(m)
	this.time.second(s)
	this.time.millisecond(ms)	
    	
    }
    else if(h != undefined) {
        this.time = moment(h);
    }
    this.pad2 = function(number){
    	var str = ""+(number);
    	while(str.length < 2){
    	  	str = "0"+str;
   	 }
   	 return str; 
    }
    this.msec = function(){
            return this.time.hour()*60*60*1000 +
		    this.time.minute()*60*1000 +
		    this.time.second()*1000 + 
		    this.time.millisecond();

    }
    this.to_string = function(){
	return this.time.hour()+":"+this.pad2(this.time.minute());	   
    }
    this.from_msec = function(ms){
	var now = new TimeCode(0,0,0,0);
	now.time.add(ms,'milliseconds')
        return now;
    }

    this.add = function(tc){
	this.time = this.time.add(tc.time.hour(),"hours");
	this.time = this.time.add(tc.time.minute(),"minute");
	this.time = this.time.add(tc.time.second(),"second");
	this.time = this.time.add(tc.time.millisecond(),"millisecond");
    }
}
