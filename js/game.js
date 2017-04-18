function Cell (x, y) {
    this.x = x;
    this.y = y;

    this.equals = function (targetCell) {
        return this.x == targetCell.x && this.y == targetCell.y;
    };

    this.render = function (game, color) {
        game.ctx.fillStyle = color;
        var cellSize = game.settings.cellSize;
        game.ctx.fillRect(this.x * cellSize, this.y * cellSize, cellSize, cellSize);
    };
}

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

function Apple (cell, settings) {
    this.settings = {
        color: "#090"
    };

    this.init = function (cell, settings) {
        this.cell = cell;
        this.settings.extend(settings || {});
    };

    this.render = function (game) {
        this.cell.render(game, this.settings.color);
    };

    this.getCell = function () {
        return this.cell;
    };

    this.init(cell, settings);
}

function Game (canvasId, settings) {
    this.settings = {
        fieldWidth : 30,
        fieldHeight : 30,
        cellSize : 20,
        fieldColor : "#eee",
        applesAmount: 4,
        controls: {
            left: 37,
            top: 38,
            right: 39,
            bottom: 40
        }
    };

    this.snake = new Snake();
    this.apples = [];

    this.init = function (canvasId, settings) {
        var game = this;
        this.field = document.getElementById(canvasId);
        this.ctx = this.field.getContext("2d");
        this.settings.extend(settings || {});
        this.field.width = this.settings.fieldWidth * this.settings.cellSize;
        this.field.height = this.settings.fieldHeight * this.settings.cellSize;
        this.addApples();
        this.snake = new Snake(this.settings.snake);
        this.snake.go();
        this.snake.on("move", function(){
            game.onSnakeMove();
        });
        this.bindControls();
    };

    this.bindControls = function () {
        var game = this;
        document.onkeydown = function(event){
            game.onKeyPressed(event);
        }
    };

    this.onKeyPressed = function (event) {
        switch (event.keyCode) {
            case this.settings.controls.left:
                this.snake.turnLeft();
                break;
            case this.settings.controls.top:
                this.snake.turnTop();
                break;
            case this.settings.controls.right:
                this.snake.turnRight();
                break;
            case this.settings.controls.bottom:
                this.snake.turnBottom();
                break;
        }
    };

    this.onSnakeMove = function () {
        this.checkSnakeAndAppleConvergence();
        this.checkFieldEdges();
        this.checkCrashing();
        this.render();
    };

    this.checkSnakeAndAppleConvergence = function () {
        var head = this.snake.getHead(),
            apple = this.isAppleOnCell(head);
        if (apple) {
            this.snake.increase();
            this.deleteApple(apple);
            this.addApples();
        }
    };

    this.checkFieldEdges = function () {
        var head = this.snake.getHead();
        if (head.x < 0) {
            head.x = this.settings.fieldWidth - 1;
        }
        if (head.x > this.settings.fieldWidth - 1) {
            head.x = 0;
        }
        if (head.y < 0) {
            head.y = this.settings.fieldHeight - 1;
        }
        if (head.y > this.settings.fieldHeight - 1) {
            head.y = 0;
        }
    };

    this.checkCrashing = function () {
        if (this.snake.isCrashed()) {
            this.gameOver();
        }
    };

    this.gameOver = function () {
        this.snake.stop();
        alert("Game over!");
    };

    this.deleteApple  = function (targetApple) {
        var game = this;
        this.apples.some(function (apple, key) {
            if (targetApple == apple) {
                game.apples.splice(key, 1);
                return true;
            }
        });
    };

    this.addApples = function () {
        while (this.apples.length < this.settings.applesAmount) {
            do {
                var x = rand(this.settings.fieldWidth),
                    y = rand(this.settings.fieldHeight),
                    appleCell = new Cell(x, y);
            } while(this.isCellNotEmpty(appleCell));
            this.apples.push(new Apple(appleCell, this.settings.apple));
        }
    };

    this.isAppleOnCell = function (targetCell) {
        var neededApple;
        this.apples.some(function (apple) {
            if (apple.getCell().equals(targetCell)) {
                neededApple = apple;
                return true;
            }
            return false;
        });
        return neededApple;
    };

    this.isCellNotEmpty = function (targetCell) {
        return this.isAppleOnCell(targetCell) || this.snake.isOccupied(targetCell);
    };

    this.render = function () {
        var game = this;
        this.ctx.fillStyle = this.settings.fieldColor;
        this.ctx.fillRect(0, 0, this.settings.fieldWidth * this.settings.cellSize, this.settings.fieldHeight * this.settings.cellSize)
        this.snake.render(game);
        this.apples.each(function (apple) {
            apple.render(game);
        });
    };

    this.init(canvasId, settings);
}