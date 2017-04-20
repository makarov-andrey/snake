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
