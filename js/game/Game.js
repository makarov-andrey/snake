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
        this.checkEating();
        this.checkFieldEdges();
        if (!this.checkCrashing()) {
            this.render();
        }
    };

    this.checkEating = function () {
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
            return true;
        }
        return false;
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