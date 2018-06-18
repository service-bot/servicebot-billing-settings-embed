import checkbox from "./checkbox/widget"
import select from "./select/widget"
import text from "./text/widget"
import secure_string from "./secure-string/widget"
import {getPrice as getTotalPrice, getPriceAdjustments, getBasePrice} from "../widget-inputs/handleInputs";
let getWidgets = function () {
    let widgets = [checkbox, select, text, secure_string];
    return widgets;
}

function getPriceData(currentPrice, properties) {
    if (properties) {
        let handlers = getWidgets().reduce((acc, widget) => {
            acc[widget.type] = widget.handler;
            return acc;

        }, {});
        let newPrice = currentPrice;
        let adjustments = [];
        try {
            newPrice = getTotalPrice(properties, handlers, currentPrice);
            adjustments = getPriceAdjustments(properties, handlers)
        } catch (e) {
            console.error(e);
        }
        return {total: newPrice, adjustments};
    } else {
        return {total: 0, adjustments: []};
    }

}

export {getPriceData}
export default getWidgets