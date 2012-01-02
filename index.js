var EventEmitter = require('events').EventEmitter;
var util = require('util');

module.exports = OrderedEmitter;

function OrderedEmitter () {
    EventEmitter.call(this);
    
    this._eventQueue = {};
    this._next = {};
}
OrderedEmitter.prototype = new EventEmitter;

OrderedEmitter.prototype.emit = function (name, obj) {
    var emit = function (args) {
        EventEmitter.prototype.emit.apply(this, args);
    }.bind(this, arguments);
    
    var queue = this._eventQueue;
    var next = this._next;
    
    if (typeof obj === 'object' && obj !== null
    && typeof obj.order === 'number') {
        if (!next[name]) next[name] = 0;
        
        if (obj.order === next[name]) {
            next[name] ++;
            emit();
            
            while (queue[name] && queue[name][next[name]]) {
                queue[name][next[name]]();
                delete queue[name][next[name]];
                next[name] ++;
            }
        }
        else {
            if (!queue[name]) queue[name] = {};
            queue[name][obj.order] = emit;
        }
    }
    else emit()
};
