function rand (min, max) {
    if (typeof min != "number") {
        min = 0;
        max = 1;
    } else if (typeof max != "number") {
        max = min;
        min = 0;
    }
    return Math.floor(Math.random() * (max - min) + min);
}