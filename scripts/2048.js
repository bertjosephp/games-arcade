/*
    Made by: gd4Ark
    Source code: https://github.com/gd4Ark/2048
    Live demo of original: 4ark.me/2048/
                                                */

// * * * * * * * * * * * * * * * // Config // * * * * * * * * * * * * * * * //

var config = {
    bonus_point: 4,
    max : 2048,
}


// * * * * * * * * * * * * * * * // Data // * * * * * * * * * * * * * * * //

var data = {
    score: 0,
    best: 0,
    cell: [

    ]
}
var indexs = [
    // left
    [
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11],
        [12, 13, 14, 15],
    ],
    // top
    [
        [0, 4, 8, 12],
        [1, 5, 9, 13],
        [2, 6, 10, 14],
        [3, 7, 11, 15],
    ],
    // right
    [
        [3, 2, 1, 0],
        [7, 6, 5, 4],
        [11, 10, 9, 8],
        [15, 14, 13, 12],
    ],
    // bottom
    [
        [12, 8, 4, 0],
        [13, 9, 5, 1],
        [14, 10, 6, 2],
        [15, 11, 7, 3],
    ]
]


// * * * * * * * * * * * * * * * // Event // * * * * * * * * * * * * * * * //

function event(game) {

    var down = false;

    var gameContainer = $('.game-container')[0];

    on(window, 'keydown', function (e) {
        if (down) return;
        down = true;
        var num = e.keyCode - 37;
        if (num >= 0 && num <= 3) {
            game.move(num);
        }
    });

    on(window, 'keyup', function () {
        down = false;
    });

    touchMoveDir(gameContainer, 15, function (dir) {
        game.move(dir);
    });

    on($('.restart-btn')[0], 'click', function (e) {
        e.preventDefault();
        game.restart();
    });

    on(window, 'resize', function () {
        game.view.resize();
    });

    // 自动测试
    var autoTest = false;

    if (autoTest) {
        (function () {
            var timer = setInterval(function () {
                var moveInfo = game.move(random(0, 3));
                if (!moveInfo) {
                    clearInterval(timer);
                }
            }, 20);
        })();
    }
}

// * * * * * * * * * * * * * * * // Game // * * * * * * * * * * * * * * * //

var Game = (function () {

    var cell = data.cell;
    var over = false;
    var move = false;

    var Game = function (view) {

    };
    Game.prototype = {
        init: function (view) {
            var _this = this;
            this.view = view;
            var history = this.getHistory();
            if (history) {
                this.restoreHistory(history);
            } else {
                this.initCell();
                this.start();
            }
            this.setBest();
            setTimeout(function () {
                _this.view.setup();
            });
        },
        start: function () {
            for (var i = 0; i < 2; i++) {
                this.randomAddItem();
            }
        },
        restart: function () {
            var _this = this;
            over = false;
            this.initCell();
            this.view.restart();
            this.start();
            data.score = 0;
            this.save();
            setTimeout(function () {
                _this.view.setup();
            });
        },
        save: function () {
            localStorage.bestScore = data.best;
            localStorage.gameState = JSON.stringify({
                cell: data.cell,
                socre: data.score,
            });
        },
        winning(){
            over = true;
            localStorage.gameState = '';
            this.view.winning();
        },
        checkWinning(){
            var isWinning = cell.find(function(el){
                return el.val === config.max
            });
            if (isWinning){
                this.winning();
            }
        },
        failure: function () {
            over = true;
            localStorage.gameState = '';
            this.view.failure();
        },
        checkfailure: function () {
            var _this = this;
            var same = false;
            var called = function (arr, str) {
                if (same) return;
                same = arr.some(function (el) {
                    return _this.checkSame(el);
                });
            };
            called(this.chunkX(), 'x');
            called(this.chunkY(), 'y');
            setTimeout(function () {
                if (!same) {
                    _this.failure();
                }
            });
        },
        checkSame: function (arr, index) {
            same = arr.some(function (el, index, arr) {
                if (index === arr.length - 1) return;
                return el.val === arr[index + 1].val;
                return true;
            });
            return same;
        },
        setBest: function () {
            var best = getLocalStorage('bestScore');
            data.best = best || 0;
        },
        getHistory: function () {
            var gameState = getLocalStorage('gameState');
            if (gameState && gameState.socre && gameState.cell) {
                return gameState;
            }
        },
        restoreHistory: function (history) {
            data.cell = history.cell;
            data.score = history.socre;
            cell = data.cell;
            this.view.restoreTile();
        },
        initCell: function () {
            for (var i = 0; i < 16; i++) {
                cell[i] = {
                    val: 0,
                    index: i,
                };
            }
        },
        addScore: function (score) {
            data.score += score;
            if (data.best < data.score) {
                data.best = data.score;
                this.view.updateBest();
            }
            this.view.updateScore(score);
        },
        chunkX: function () {
            var new_cell = [];
            for (var i = 0; i < cell.length; i += 4) {
                new_cell.push(cell.slice(i, i + 4));
            }
            return new_cell;
        },
        chunkY: function () {
            var arr = this.chunkX();
            var new_cell = [
                [],
                [],
                [],
                []
            ];
            for (var i = 0; i < arr.length; i++) {
                for (var j = 0; j < arr[i].length; j++) {
                    new_cell[j][i] = arr[i][j];
                }
            }
            return new_cell;
        },
        arrayInnerReverse: function (arr) {
            arr.forEach(function (el, index) {
                arr[index] = el.reverse();
            });
            return arr;
        },
        updatePos: function (old_index, index) {
            cell[index].val = cell[old_index].val;
            cell[old_index].val = 0;
            move = true;
            return old_index;
        },
        updateVal: function (index, val) {
            var _this = this;
            cell[index].val = val;
            setTimeout(function () {
                _this.view.updateVal(index);
            }, 0);
        },
        updateItem: function (old_index, index) {
            if (cell[old_index] === cell[index]) return;
            var old_index = this.updatePos(old_index, index);
            this.view.move(old_index, index);
        },
        removeItem: function (index) {
            cell[index].val = 0;
            this.view.remove(index);
        },
        getSum: function (obj, i, j) {
            return obj[i].val + obj[j].val;
        },
        move: function (dir) {
            if (over) return;
            var _this = this;
            var _score = 0;
            var _move = false;
            var new_cell = [];
            if (dir === 0 || dir === 2) {
                new_cell = this.chunkX();
            } else if (dir === 1 || dir === 3) {
                new_cell = this.chunkY();
            }
            if (dir === 2 || dir === 3) {
                new_cell = this.arrayInnerReverse(new_cell);
            }
            new_cell.forEach(function (arr, index) {
                var moveInfo = _this.moving(arr, indexs[dir][index]);
                _score += moveInfo.score;
            });
            this.addScore(_score);
            if (move) {
                this.randomAddItem();
                _move = true;
                move = false;
            }
            this.save();
            this.checkWinning();
            if (this.isFull()) {
                this.checkfailure();
            }
            return {
                move: _move,
            };
        },
        mergeMove: function (_cell, index, num1, num2, num3) {
            var sum = this.getSum(_cell, num1, num2);
            this.removeItem(_cell[num1].index);
            this.updateItem(_cell[num2].index, index[num3]);
            this.updateVal(index[num3], sum);
        },
        normalMove: function (_cell, index) {
            var _this = this;
            _cell.forEach(function (el, i) {
                _this.updateItem(_cell[i].index, index[i]);
            });
        },
        moving: function (arr, index) {
            var _this = this;
            var _score = 0;
            var _cell = arr.filter(function (el) {
                return el.val !== 0;
            });
            if (_cell.length === 0) {
                return {
                    score: 0,
                }
            };
            var calls = [
                function () {
                    _this.normalMove(_cell, index);
                },
                function () {
                    if (_cell[0].val === _cell[1].val) {
                        _this.mergeMove(_cell, index, 0, 1, 0);
                        _score += config.bonus_point;
                    } else {
                        _this.normalMove(_cell, index);
                    }
                },
                function () {
                    if (_cell[0].val === _cell[1].val) {
                        _this.mergeMove(_cell, index, 0, 1, 0);
                        _this.updateItem(_cell[2].index, index[1]);
                        _score += config.bonus_point;
                    } else if (_cell[1].val === _cell[2].val) {
                        _this.updateItem(_cell[0].index, index[0]);
                        _this.mergeMove(_cell, index, 1, 2, 1);
                        _score += config.bonus_point;
                    } else {
                        _this.normalMove(_cell, index);
                    }
                },
                function () {
                    if (_cell[0].val === _cell[1].val) {
                        _this.mergeMove(_cell, index, 0, 1, 0);
                        _score += config.bonus_point;
                        if (_cell[2].val === _cell[3].val) {
                            _this.mergeMove(_cell, index, 2, 3, 1);
                            _score += config.bonus_point;
                        } else {
                            _this.updateItem(_cell[2].index, index[1]);
                            _this.updateItem(_cell[3].index, index[2]);
                        }
                    } else if (_cell[1].val === _cell[2].val) {
                        _this.mergeMove(_cell, index, 1, 2, 1);
                        _this.updateItem(_cell[3].index, index[2]);
                        _score += config.bonus_point;
                    } else if (_cell[2].val === _cell[3].val) {
                        _this.mergeMove(_cell, index, 2, 3, 2);
                        _score += config.bonus_point;
                    }
                }
            ];
            calls[_cell.length - 1]();
            return {
                score: _score,
            };
        },
        isFull: function () {
            var full = cell.filter(function (el) {
                return el.val === 0;
            });
            return full.length === 0;
        },
        randomAddItem: function () {
            if (this.isFull()) return;
            while (true) {
                var index = random(0, data.cell.length - 1);
                var exist = data.cell[index].val !== 0;
                if (!exist) {
                    this.addItem(index, 2);
                    break;
                }
            }
        },
        addItem: function (index, val) {
            data.cell[index] = {
                val: val,
                index: index
            };
            this.view.appear(index);
        }
    };

    return Game;

})();


// * * * * * * * * * * * * * * * // Main // * * * * * * * * * * * * * * * //

document.addEventListener('DOMContentLoaded', () => {
    var view = new View();
    var game = new Game();
    game.init(view);
    event(game);
});


// * * * * * * * * * * * * * * * // Utils // * * * * * * * * * * * * * * * //

var log = console.log.bind(console);
var random = function (start, end) {
    start = start === void 0 ? 0 : start;
    end = end === void 0 ? 1 : end;
    end = end + 1;
    var rand = Math.random() * (end - start) + start;
    return Math.floor(rand);
};
var $ = function (elem) {
    return document.querySelectorAll(elem);
}
var on = function (elem, type, callback) {
    elem.addEventListener(type, function (e) {
        callback(e);
    });
}

var indexToPos = function (index) {
    return {
        x: index % 4,
        y: Math.floor(index / 4),
    }
}

var getLocalStorage = function (key) {
    return localStorage[key] ?
        JSON.parse(localStorage[key]) : null;
}

var touchMoveDir = function (elem, min, callback) {
    var touchPos = {
        beforeX: 0,
        beforeY: 0,
        afterX: 0,
        afterY: 0,
    }
    var move = false;
    var dir;
    on(elem, 'touchstart', function (e) {
        touchPos.beforeX = e.touches[0].clientX;
        touchPos.beforeY = e.touches[0].clientY;
    });
    on(elem, 'touchmove', function (e) {
        move = true;
        touchPos.afterX = e.touches[0].clientX;
        touchPos.afterY = e.touches[0].clientY;
    });
    on(elem, 'touchend', function (e) {
        if (!move) return;
        var x = touchPos.beforeX - touchPos.afterX;
        var y = touchPos.beforeY - touchPos.afterY;
        log(x, y);
        if (Math.abs(x) < min && Math.abs(y) < min) {
            return;
        }
        if (Math.abs(x) > Math.abs(y)) {
            dir = x > 0 ? 0 : 2;
        } else {
            dir = y > 0 ? 1 : 3;
        }
        move = false;
        callback(dir);
    });
};


// * * * * * * * * * * * * * * * // View // * * * * * * * * * * * * * * * //

var View = (function () {

    var tileContainer = $('.tile-container')[0];
    var scoreContainer = $('.score-container')[0];
    var scoreDom = $('.score-container .score')[0];
    var scoreAddition = $('.score-addition')[0];
    var bestDom = $('.best-container .score')[0];
    var failureContainer = $('.failure-container')[0];
    var winningContainer = $('.winning-container')[0];

    var View = function () {

    };

    View.prototype = {
        setup: function () {
            failureContainer.classList.remove('action');
            winningContainer.classList.remove('action');
            this.updateScore(data.score);
            this.updateBest();
        },
        restart: function () {
            tileContainer.innerHTML = "";
        },
        resize: function () {
            var _this = this;
            data.cell.forEach(function (el, index) {
                var tile = _this.getTile(index);
                if (!tile) return;
                var pos = _this.getPos(indexToPos(index));
                _this.setPos(tile, pos);
            });
        },
        failure: function () {
            failureContainer.classList.add('action');
        },
        winning: function () {
            winningContainer.classList.add('action');
        },
        restoreTile: function () {
            var _this = this;
            data.cell.forEach(function (el, index) {
                if (el.val !== 0) {
                    _this.appear(index);
                }
            });
        },
        addScoreAnimation: function (score) {
            if (!score) return;
            scoreAddition.innerHTML = '+' + score;
            scoreAddition.classList.add('action');
            setTimeout(function () {
                scoreAddition.classList.remove('action');
            }, 500);
        },
        updateScore: function (score) {
            scoreDom.innerHTML = data.score;
            this.addScoreAnimation(score);
        },
        updateBest: function () {
            bestDom.innerHTML = data.best;
        },
        setInfo: function (elem, pos, index) {
            elem.style.left = pos.left + 'px';
            elem.style.top = pos.top + 'px';
            elem.setAttribute('data-index', index);
        },
        getTile: function (index) {
            return $(`.tile[data-index='${index}']`)[0];
        },
        getPos: function (pos) {
            var gridCell = $(`.grid-row:nth-child(${pos.y+1}) .grid-cell:nth-child(${pos.x+1})`)[0];
            return {
                left: gridCell.offsetLeft,
                top: gridCell.offsetTop,
            }
        },
        setPos: function (elem, pos) {
            elem.style.left = pos.left + 'px';
            elem.style.top = pos.top + 'px';
        },
        createTileHTML: function (obj) {
            var tile = document.createElement('div');
            tile.className = obj.classNames;
            tile.innerHTML = obj.val;
            tile.setAttribute('data-index', obj.index);
            tile.setAttribute('data-val', obj.val);
            this.setPos(tile, obj.pos);
            return tile;
        },
        appear: function (index) {
            var last = data.cell[index];
            var pos = this.getPos(indexToPos(index));
            var newTile = this.createTileHTML({
                val: last.val,
                pos: pos,
                index: index,
                classNames: " tile new-tile",
            });
            tileContainer.appendChild(newTile);
        },
        remove: function (index) {
            var tile = this.getTile(index);
            tile.parentElement.removeChild(tile);
        },
        move: function (old_index, index) {
            var tile = this.getTile(old_index);
            var pos = this.getPos(indexToPos(index));
            this.setInfo(tile, pos, index);
        },
        updateVal: function (index) {
            var tile = this.getTile(index);
            var val = data.cell[index].val;
            tile.setAttribute('data-val', val);
            tile.innerHTML = val;
            tile.classList.add('addition');
            setTimeout(function () {
                tile.classList.remove('addition');
                tile.classList.remove('new-tile');
            }, 300);
        },
    }

    return View;

})();