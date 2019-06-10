// vue-mvvm

let target = null;

class Dep {
    constructor() {
        this.subs = [];
    }
    depend(sub) {
        if (this.subs.includes(sub)) return;
        this.subs.push(sub);
    }
    notify() {
        this.subs.forEach(sub => {
            sub();
        });
    }
}


function watcher(fn) {
    Dep.target = fn;
    Dep.target();
    Dep.target = null;
}


function observe(data) {
    let dep = new Dep;
    for (let key in data) {
        let val = data[key];
        Object.defineProperty(data, key, {
            get() {
                Dep.target && dep.depend(Dep.target);
                return val;
            },
            set(v) {
                if (val !== v) {
                    val = v;
                }
                dep.notify(Dep.target);
            }
        });
    }

}

let data = {
    food: "煎饼",
    drink: "可乐",
};

observe(data);

let menu = "";



watcher(() => {
    menu = data.food + data.drink;
    console.log(menu);
});

// 更新

data.food = "油条";
data.drink = "雪碧";