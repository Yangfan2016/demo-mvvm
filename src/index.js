function Observer(o) {
    for (let key in o) {
        let val = o[key];
        addDeepObserver(val);

        let dep=new Dep();

        Object.defineProperty(o, key, {
            enumerable: true,
            get() {
                Dep.target && dep.addSub(Dep.target);
                return val;
            },
            set(newVal) {
                if (newVal !== val) {
                    val = newVal;
                    // 增加监听
                    addDeepObserver(val);
                    dep.notify();
                }
            },
        });
    }
}

function addDeepObserver(o) {
    if (!!o && typeof o === "object") {
        new Observer(o);
    }
}


class Dep{
    constructor() {
        this.subs=[];
    }
    addSub(sub) {
        this.subs.push(sub);
        console.log(this.subs);
    }
    notify() {
        this.subs.forEach(watch=> {
            watch.update();
        });
    }
}
Dep.target=null;

class Watcher{
    constructor(vm,wacthDist) {
        this.watchs=[];
        this.vm=vm;
        Dep.target=this;
        Object.keys(wacthDist).forEach(key=>{
            this.watchs.push({
                key:key,
                fn:wacthDist[key],
            });
        });
    }
    update() {
        this.watchs.forEach(w=>{
            let data=this.vm.$data[w.key];
            w.fn(data);
        });
    }
}

class Yue{
   constructor(opts) {
       let vm=this;
       // 初始化数据
       new Observer(opts.data);
       // 初始化watch
       new Watcher(vm,opts.watch);
       // 挂载data
       vm.$data=opts.data;
   } 
}


let y=new Yue({
    data:{
        a: 1,
        b: {
            c: 1
        }
    },
    watch:{
        "a":function (val,oldVal) {
            console.warn(val,oldVal);
        }
    }
});

y.$data.a=2;