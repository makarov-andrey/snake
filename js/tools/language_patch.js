Object.prototype.each = function (callback) {
    for (var key in this) {
        if (!this.hasOwnProperty(key)) continue;
        callback(this[key], key, this);
    }
};

Object.prototype.some = function (callback) {
    for (var key in this) {
        if (!this.hasOwnProperty(key)) continue;
        if (callback(this[key], key, this)) {
            return true;
        }
    }
    return false;
};

Object.prototype.every = function (callback) {
    return !this.some(function(){
        return !callback();
    });
};

Object.prototype.reduce = function (callback, result) {
    this.each(function(item, key, obj){
        result = callback(result, item, key, obj);
    });
    return result;
};

Object.prototype.extend = function () {
    var base = this.clone();
    arguments.each(function(arg){
        if (typeof arg != "object") {
            throw Error("All of arguments must be objects");
        }
        base = arg.reduce(function (result, item, key) {
            if (typeof item == "object") {
                if (typeof result[key] == "object") {
                    result[key] = result[key].extend(item);
                    return result;
                }
                result[key] = item.clone();
                return result;
            }
            result[key] = item;
            return result;
        }, base);
    });
    return base;
};

Object.prototype.clone = function () {
    var base = {};
    this.each(function(item, key){
        base[key] = typeof item == "object" ? item.clone() : item;
    });
    return base;
};