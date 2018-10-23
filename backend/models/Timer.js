class Timer {
    start(time, callback) {
        this.callback = callback;
        this.startTime = Date.now();
        this.remainingTime = time;
        this.duration = time;
        this.running = true;
        this.timer = setTimeout(function () {
            callback();
        }, time);
    }
    cancel() {
        this.running = false;
        clearTimeout(this.timer);
    }
    pause() {
        this.running = false;
        clearTimeout(this.timer);
        this.remainingTime = this.duration - (Date.now() - this.startTime);
    }
    resume() {
        if(this.running) {
            return;
        }
        this.running = true;
        this.timer = setTimeout(function() {
            callback();
        }, this.remainingTime);
    }
}

module.exports = Timer;