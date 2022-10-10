sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("zatualizacaocadastral.controller.Dependentes", {
            onInit: function () {
                var oModel       = this.getOwnerComponent().getModel("JSONModel");
                this.getView().setModel(oModel); 

                // var oModel = new sap.ui.model.json.JSONModel();
                // oModel.setData({
                //     dependentes : [
                //         { 
                //             "PrimeiroNome":"Dependente 1 Título",
                //             "SegundoNome":"Dependente 1 conteúdo"
                //         },
                //         {   
                //             "PrimeiroNome":"Dependente 2 Título",
                //             "SegundoNome":"Dependente 2 conteúdo"
                //         },
                //         {   
                //             "PrimeiroNome":"Dependente 3 Título",
                //             "SegundoNome":"Dependente 3 conteúdo"
                //         },
                //         ]
                // });
        
                // this.getView().setModel(oModel);
          },

          doAdd : function(oEvent) {
            this._handleAddDelete(oEvent, true);
          },
    
          doDelete : function(oEvent) {
            this._handleAddDelete(oEvent, false);
          },
          
          _handleAddDelete: function(oEvent, bAdd) {
            // the model
            var oModel   = this.getView().getModel(); 
            // array with all rows in the model
            var aRows    = oModel.getProperty("/dependentes/results");
            // the current object
            var oThisObj = oEvent.getSource().getBindingContext().getObject(); 

            var oNewRow = {};
    
            // get the index of the selected item in your array
            var index = $.map(aRows, function(obj, i) {
                if(obj === oThisObj) {
                    return i;
                }
            });
    
            if (index && index.length > 0) {
                if (bAdd) {
                    oNewRow = {
                        // title   : "New Title",
                        // content : "New Content"
                        PrimeiroNome : "Novo nome",
                        SegundoNome  : "Novo sobrenome"
                    };
    
                    // add the object at index
                    aRows.splice(index[0] + 1, 0, oNewRow);
                }
                else {
                    // remove the object at index
                    aRows.splice(index[0], 1);
                }
                // store the updated array back to the model
                oModel.setProperty("/dependentes/results", aRows);
            }
        },

        onValueHelpRequest: function (oEvent) {
            var sInputValue = oEvent.getSource().getValue(),
                oView = this.getView();

            if (!this._pValueHelpDialog) {
                this._pValueHelpDialog = Fragment.load({
                    id: oView.getId(),
                    name: "zatualizacaocadastral.fragment.ValueHelpDialogGrauParentesco",
                    controller: this
                }).then(function (oDialog) {
                    // oView.addDependent(oDialog);
                    oDialog.setModel(oView.getModel());
                    return oDialog;
                });
            }
            this._pValueHelpDialog.then(function (oDialog) {
                // Create a filter for the binding
                oDialog.getBinding("items").filter([new Filter("DescricaoGrauParentesco", FilterOperator.Contains, sInputValue)]);
                // Open ValueHelpDialog filtered by the input's value
                oDialog.open(sInputValue);
            });
        },

        onValueHelpDialogSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("DescricaoGrauParentesco", FilterOperator.Contains, sValue);

            oEvent.getSource().getBinding("items").filter([oFilter]);
        },

        onValueHelpDialogClose: function (oEvent) {
            var sDescription,
                sKey,
                oSelectedItem; 

            oSelectedItem = oEvent.getParameter("selectedItem");
                
            if (!oSelectedItem) {
                return;
            }

            sKey         = oSelectedItem.getDescription();
            sDescription = oSelectedItem.getTitle();
            this.byId("inputGrauParentesco").setValue(sDescription);

        }



        });
    });
