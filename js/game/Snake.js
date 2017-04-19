function Snake (settings) {
    this.settings = {
        motionDelay: 300,
        bodyColor: "#999",
        headColor: "#900"
    };

    this.triggers = {
        "move": []
    };

    this.reset = function() {
        this.body = [new Cell(3, 1), new Cell(2, 1), new Cell(1, 1)];
        this.direction = "right";
    };

    this.init = function(settings) {
        this.settings.extend(settings || {});
        this.reset();
    };

    this.isOccupied = function (targetCell) {
        return this.body.some(function(snakeCell){
            return snakeCell.equals(targetCell);
        });
    };

    this.isCrashed = function () {
        var snake = this,
            head = snake.getHead();
        return this.body.some(function(snakeCell){
            return snakeCell.equals(head) && head != snakeCell;
        });
    };

    this.go = function () {
        var snake = this;
        this.motionInterval = setInterval(function(){
            snake.move();
        }, this.settings.motionDelay);
    };

    this.stop = function () {
        if (this.motionInterval) {
            clearInterval(this.motionInterval);
        }
    };

    this.move = function () {
        var head = this.getHead().clone();
        switch (this.direction) {
            case "left":
                head.x--;
                break;
            case "right":
                head.x++;
                break;
            case "top":
                head.y--;
                break;
            case "bottom":
                head.y++;
                break;
        }
        this.body.pop();
        this.body.unshift(head);
        this.triggers.move.each(function (callback) {
            callback();
        })
    };

    this.increase = function () {
        this.body.push(this.getTail());
    };

    this.getHead = function () {
        return this.body[0];
    };

    this.getTail = function () {
        return this.body[this.body.length - 1];
    };

    this.on = function (event, callback) {
        this.triggers[event].push(callback);
    };

    this.turnLeft = function () {
        this.direction = "left";
    };

    this.turnRight = function () {
        this.direction = "right";
    };

    this.turnTop = function () {
        this.direction = "top";
    };

    this.turnBottom = function () {
        this.direction = "bottom";
    };

    this.render = function (game) {
        var bodyColor = this.settings.bodyColor;
        this.body.each(function(cell){
            cell.render(game, bodyColor);
        });
        this.getHead().render(game, this.settings.headColor);
    };

    this.init(settings);
}
