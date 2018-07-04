'use strict';

//takes in a request and outputs the updated instance

//todo: move property system into plugins.
function getHandlers(handlerArray) {
    if (!handlerArray) {
        console.error("Handlers not provided..");
    }
    return handlerArray.reduce(function (acc, handler) {
        acc[handler.name] = handler;
        return acc;
    }, {});
};

function toCents(amount) {
    if (typeof amount !== 'string' && typeof amount !== 'number') {
        throw new Error('Amount passed must be of type String or Number.');
    }

    return Math.round(100 * parseFloat(typeof amount === 'string' ? amount.replace(/[$,]/g, '') : amount));
}
function getPriceAdjustments(properties, handlers) {
    if (properties) {
        return properties.reduce(function (acc, prop) {
            if (handlers[prop.type] && handlers[prop.type].priceHandler && prop.config && prop.config.pricing && prop.config.pricing.operation) {
                var adjuster = handlers[prop.type].priceHandler;
                var valToPUsh = {
                    name: prop.name,
                    prop_label: prop.prop_label,
                    type: prop.type,
                    operation: prop.config.pricing.operation,
                    value: adjuster(prop.data, prop.config) || 0
                };
                acc.push(valToPUsh);
            }
            return acc;
        }, []);
    } else {
        return [];
    }
};

module.exports = {
    getBasePrice: function getBasePrice(properties, handlers, currentPrice) {
        var cents = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

        var adjustments = [];
        try {
            adjustments = getPriceAdjustments(properties, handlers);
        } catch (e) {
            console.error("price error", e);
        }

        var additions = 0;
        var multiplication = 1;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = adjustments[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var adjustment = _step.value;

                var operation = adjustment.operation;

                switch (operation) {
                    case "add":
                        additions += cents ? toCents(adjustment.value) : adjustment.value;
                        break;
                    case "subtract":
                        additions -= cents ? toCents(adjustment.value) : adjustment.value;
                        break;
                    case "multiply":
                        multiplication += adjustment.value / 100;
                        break;
                    case "divide":
                        multiplication -= adjustment.value / 100;
                        break;
                    default:
                        throw "Bad operation : " + operation;

                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return (currentPrice - additions) / multiplication;
    },


    getPrice: function getPrice(properties, handlers, basePrice) {
        var cents = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

        var adjustments = [];
        try {
            adjustments = getPriceAdjustments(properties, handlers);
        } catch (e) {
            console.error("price error", e);
        }
        return basePrice + adjustments.reduce(function (acc, adjustment) {
            var operation = adjustment.operation;
            if (adjustment.value === null || adjustment.value === undefined) {
                return acc;
            }
            switch (operation) {
                case "add":
                    acc += cents ? toCents(adjustment.value) : adjustment.value;
                    break;
                case "subtract":
                    acc -= cents ? toCents(adjustment.value) : adjustment.value;
                    break;
                case "multiply":
                    acc += basePrice * (adjustment.value / 100);
                    break;
                case "divide":
                    acc -= basePrice * (adjustment.value / 100);
                    break;
                default:
                    throw "Bad operation : " + operation;

            }
            return acc;
        }, 0);
    },
    validateProperties: function validateProperties(properties, handlers) {
        // let handlers = getHandlers(handlerArray);
        return properties.reduce(function (acc, prop) {
            //todo: reduce duplicate code that exists here and in webpack code.

            if (!handlers[prop.type]) {
                return acc;
            }
            var validator = handlers[prop.type].validator;
            if (validator) {
                var validationResult = validator(prop.data, prop.config);
                if (validationResult != true) {
                    prop.error = validationResult;
                    acc.push(prop);
                }
            }
            return acc;
        }, []);
    },
    getPriceAdjustments: getPriceAdjustments,
    toCents: toCents
};