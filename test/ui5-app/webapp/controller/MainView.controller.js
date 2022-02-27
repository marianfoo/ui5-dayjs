sap.ui.define(
    ["./BaseController",
    "sap/ui/model/json/JSONModel"],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel 
 */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("de.marianzeis.datelibsample.controller.MainView", {
            _data: {
                "date": "2014/12/30",
                "inputFormat": "YYYY/MM/DD",
                "outputFormat": "dd.MM.YYYY"
            },

            onInit: function (evt) {
                var oModel = new JSONModel(this._data);
                this.getView().setModel(oModel);
            },
            onPress: function (evt) {
                console.log("")
            }
        });
    }
);
