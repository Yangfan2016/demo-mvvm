class Observer {
    constructor(o) {
        let that = this;
        for (let key in o) {
            let val = o[key];
            that.addDeepObserver(val);

            let dep = new Dep();

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
                        that.addDeepObserver(val);
                        dep.notify();
                    }
                }
            });
        }
    }
    addDeepObserver(o) {
        if (!!o && typeof o === "object") {
            new Observer(o);
        }
    }
}

class Dep {
    constructor() {
        this.subs = [];
    }
    addSub(sub) {
        this.subs.push(sub);
    }
    notify() {
        this.subs.forEach(watch => {
            watch.update();
        });
    }
}
Dep.target = null;

class Watcher {
    constructor(vm, key, cb) {
        this.watchs = [];
        this.vm = vm;
        this.cb = cb;
        this.getter = this.parseGetter(key);
        Dep.target = this;
        this.oldVal = this.get();
        Dep.target = null;
    }
    parseGetter(key) { // "b.c"
        let keyList = key.split(".");
        return function (obj) {
            let data = obj;
            let val;
            if (keyList.length === 1) {
                return data[keyList[0]];
            }
            for (let i = 0, len = keyList.length; i < len; i++) {
                let k = keyList[i];
                if (data[k] && typeof data[k] === "object") {
                    data = data[k];
                } else {
                    val = data[k];
                }
            }
            return val;
        }
    }
    get() {
        let value = this.getter(this.vm.$data);
        return value;
    }
    update() {
        let oldVal = this.oldVal;
        let val = this.get();
        if (val !== oldVal) {
            this.cb(val, oldVal);
            this.oldVal = val;
        }
    }
}

class Yue {
    constructor(opts) {
        let vm = this;
        // 初始化数据
        new Observer(opts.data);
        // 挂载data
        vm.$data = opts.data;
        // 代理data
        this.proxyData(opts.data);
        // 初始化watch
        for (let getter in opts.watch) {
            let cb = opts.watch[getter];
            new Watcher(vm, getter, cb);
        }
    }
    proxyData(data) {
        Object.keys(data).forEach(k => {
            Object.defineProperty(this, k, {
                get() {
                    return data[k];
                },
                set(newVal) {
                    if (newVal !== data[k]) {
                        data[k] = newVal;
                    }
                }
            });
        });
    }
}

let y = new Yue({
    data: {
        a: 1,
        b: {
            c: 1
        }
    },
    watch: {
        a: function (val, oldVal) {
            console.log(val, oldVal);
        },
        b: function (val, oldVal) {
            console.log(val, oldVal);
        },
        "b.c": function (val, oldVal) {
            console.log(val, oldVal);
        }
    }
});
