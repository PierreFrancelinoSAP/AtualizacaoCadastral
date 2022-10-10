sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("zatualizacaocadastral.controller.Escolaridade", {
            onInit: function () {
                var oModel       = this.getOwnerComponent().getModel("JSONModel");
                this.getView().setModel(oModel); 
            }
        });
    });
