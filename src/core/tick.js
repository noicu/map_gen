class Tick {
  actions = [];
  constructor(timeout) {
    this.timeout = timeout || 1000;
    // var a = Math.random()
    // this.add(() => {
    //   console.log(a)
    // })
    // console.log(this)
    this.init();
  }
  init() {
    this.clear();
    this.timer = setInterval(this.action, this.timeout);
  }
  action = () => {
    for (let i = 0; i < this.actions.length; i++) {
      this.actions[i]();
    }
  }
  add(func) {
    this.actions.push(func);
    this.init();
  }
  clear(func) {
    if (func) {
      for (let i = 0; i < this.actions.length; i++) {
        if (func == this.actions[i]) this.actions.splice(i, 1);
      }
    } else {
      clearInterval(this.timer);
    }
  }
}

export default Tick;
