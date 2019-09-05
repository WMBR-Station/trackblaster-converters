if (!Object.prototype.watch) {
    Object.defineProperty(
        Object.prototype,
        "watch", {
            enumerable: false,
            configurable: true,
            writable: false,
            value: function (prop, handler) {
                var old = this[prop];
                var cur = old;
                var getter = function () {
                    return cur;
                };
                var setter = function (val) {
                    old = cur;
                    cur =
                        handler.call(this,prop,old,val);
                    return cur;
                };
                // can't watch constants
                if (delete this[prop]) {
                    Object.defineProperty(this,prop,{
                        get: getter,
                        set: setter,
                        enumerable: true,
                        configurable: true
                    });
                }
            }
        });
}
class ModelView {
    constructor(model){
        this.model = model;
    }
    unbind(name){
        this.model.unwatch(name);
    }
    bind(name){
        this.model.watch(name, function(p,o,n){m.redraw();return n;});
    }
}


class Downloadable {
    constructor(){
        this.status = Status.PENDING
    }
    request(cbk){
        throw "overrideme: make request, and execute callback"
    }
}



class WorkQueue {
    constructor(){
        this.queue = [];
        this.n = 0;
    }
    add(dlobj){
        this.queue.push(dlobj);
        this.n += 1;
    }
    next(){
        if(this.queue.length == 0){
            if(this.callback){
                this.callback();
                this.callback = null;
            }
            return;
        }
        var dlobj = this.queue.pop();
        var that = this;
        dlobj.status = Status.INPROGRESS;
        dlobj.request(function(status){
            dlobj.status = status;
            that.completed -= 1;
            that.next();
        });
    }
    done(){
        return this.queue.length == 0;
    }
    wait(){
        while(!done){
            sleep(10);
        }
    }
    execute(cbk){
        this.callback = cbk;
        this.next();
    }
    flush(){
        this.queue = [];
    }
}
