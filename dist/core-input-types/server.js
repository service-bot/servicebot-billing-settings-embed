"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var consume = require("pluginbot/effects/consume");
var CORE_INPUTS = require("./core-inputs");
module.exports = {
    run: /*#__PURE__*/_regenerator2.default.mark(function run(config, provide, services) {
        var handlers;
        return _regenerator2.default.wrap(function run$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        handlers = CORE_INPUTS.map(function (input) {
                            try {
                                var handler = require("./" + input + "/widgetHandler");

                                if (handler && (handler.priceHandler || handler.validator)) {
                                    return { handler: handler, name: input };
                                }
                            } catch (e) {
                                return { name: input };
                            }
                        });
                        _context.next = 3;
                        return provide({ inputHandler: handlers });

                    case 3:
                    case "end":
                        return _context.stop();
                }
            }
        }, run, this);
    })

};