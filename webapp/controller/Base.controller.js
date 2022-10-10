sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/Button",
    "sap/m/Dialog",
    "sap/ui/core/Fragment",
    "sap/ui/core/library",
    "sap/m/library",
    "sap/m/Text",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Button, Dialog, Fragment, coreLibrary, mobileLibrary, Text, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("zatualizacaocadastral.controller.Base", {
            onInit: function () {
                var oMessageManager;
                var that = this;

                // set message model
                oMessageManager = sap.ui.getCore().getMessageManager();
                this.getView().setModel(oMessageManager.getMessageModel(), "message");

                // activate automatic message generation for complete view
			    oMessageManager.registerObject(this.getView(), true);
                
            },

            onItemSelect : function(oEvent) {
                var userSelected = oEvent.getParameter("item").getKey();
                this.getOwnerComponent().getRouter().navTo(userSelected);
            },

            onSideNavButtonPress: function () {
                var oToolPage = this.byId("app");
                var bSideExpanded = oToolPage.getSideExpanded();
    
                this._setToggleButtonTooltip(bSideExpanded);
    
                oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
            },

            _setToggleButtonTooltip: function (bLarge) {
                var oToggleButton = this.byId('sideNavigationToggleButton');
                if (bLarge) {
                    oToggleButton.setTooltip('Large Size Navigation');
                } else {
                    oToggleButton.setTooltip('Small Size Navigation');
                }
            }
        });
    });
