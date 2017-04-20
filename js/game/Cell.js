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
