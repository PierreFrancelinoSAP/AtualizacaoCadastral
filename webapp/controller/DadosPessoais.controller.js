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

        return Controller.extend("zatualizacaocadastral.controller.DadosPessoais", {
            onInit: function () {
                var oModel       = this.getOwnerComponent().getModel("JSONModel");
                this.getView().setModel(oModel); 
                
                // var oOdataModel = this.getOwnerComponent().getModel("ODataModel");
                // this.getView().setModel(oOdataModel);
            },

            onAfterRendering: function () {
                this.applyMasks();
            },

            applyMasks: function() {
                var oModel     = this.getOwnerComponent().getModel("JSONModel");    
                var oModelData = oModel.getData();     
                
                if( oModelData.isBusy == false ) {
                    this.byId("inputTelefoneCelular")._applyMask();
                    this.byId("inputTelefoneContato")._applyMask();
                    this.byId("inputCelularCorporativo")._applyMask();
                    this.byId("inputCep")._applyMask();
                }
            },
 
            onActionSave: function() {
                var header = {};
                var modelData = this.getView().getModel().getData();

                var documentoData = [];
                var dependenteData = [];
                var escolaridadeData = [];
                
                header.Pernr                  = modelData.Pernr;
                header.NomeColaborador        = modelData.NomeColaborador;
                header.TelefoneCelular        = modelData.TelefoneCelular;
                header.TelefoneContato        = modelData.TelefoneContato; 
                header.CelularCorporativo     = modelData.CelularCorporativo;
                header.EmailParticular        = modelData.EmailParticular;
                header.EmailCorporativo       = modelData.EmailCorporativo;
                header.Rua                    = modelData.Rua;
                header.Numero                 = modelData.Numero;
                header.Bairro                 = modelData.Bairro;
                header.Complemento            = modelData.Complemento; 
                header.Cidade                 = modelData.Cidade; 
                header.Cep                    = modelData.Cep;
                header.Estado                 = modelData.Estado;
                header.Pais                   = modelData.Pais; 
                header.GrupoEmpregado         = modelData.GrupoEmpregado;
                header.GrupoEmpregadoTexto    = modelData.GrupoEmpregadoTexto;
                header.SubgrupoEmpregado      = modelData.SubgrupoEmpregado;
                header.SubgrupoEmpregadoTexto = modelData.SubgrupoEmpregadoTexto; 
                header.AreaRh                 = modelData.AreaRh;
                header.AreaRhTexto            = modelData.AreaRhTexto;
                header.dependenteSet          = dependenteData;  
                header.documentoSet           = documentoData;
                
                this.executeOdataCreate(header);
            }, 

            onValueHelpRequest: function (oEvent) {
                var sInputValue = oEvent.getSource().getValue(),
                    oView = this.getView();
    
                if (!this._pValueHelpDialog) {
                    this._pValueHelpDialog = Fragment.load({
                        id: oView.getId(),
                        name: "zatualizacaocadastral.fragment.ValueHelpDialog",
                        controller: this
                    }).then(function (oDialog) {
                        // oView.addDependent(oDialog);
                        oDialog.setModel(oView.getModel());
                        return oDialog;
                    });
                }
                this._pValueHelpDialog.then(function (oDialog) {
                    // Create a filter for the binding
                    oDialog.getBinding("items").filter([new Filter("DescricaoPais", FilterOperator.Contains, sInputValue)]);
                    // Open ValueHelpDialog filtered by the input's value
                    oDialog.open(sInputValue);
                });
            },

            onSuggestionItemSelected: function (oEvent) {
                var oItem = oEvent.getParameter("selectedItem");
                var oText = oItem ? oItem.getKey() : "";
                this.byId("selectedKeyIndicator").setText(oText);
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
                // sDescription = oSelectedItem.getTitle();
                this.byId("inputPais").setValue(sKey);
            },

            onClearPress : function(){
                sap.ui.getCore().getMessageManager().removeAllMessages();
            },

            onValueHelpDialogSearch: function (oEvent) {
			    var sValue = oEvent.getParameter("value");
			    var oFilter = new Filter("DescricaoPais", FilterOperator.Contains, sValue);

			    oEvent.getSource().getBinding("items").filter([oFilter]);
		    },

            _getMessagePopover : function () {
                var oView = this.getView();
    
                // create popover lazily (singleton)
                if (!this._pMessagePopover) {
                    this._pMessagePopover = Fragment.load({
                        id: oView.getId(),
                        name: "zatualizacaocadastral.fragment.MessagePopover"
                    }).then(function (oMessagePopover) {
                        oView.addDependent(oMessagePopover);
                        return oMessagePopover;
                    });
                }
                return this._pMessagePopover;
            },

            onMessagePopoverPress : function (oEvent) {
                var oSourceControl = oEvent.getSource();
                this._getMessagePopover().then(function(oMessagePopover){
                    oMessagePopover.openBy(oSourceControl);
                });
            },

            executeOdataCreate: function(header) {
                var oOdataModel  = this.getOwnerComponent().getModel("ODataModel"); 
                var oModel       = this.getView().getModel();
            
                oModel.setProperty('/isBusy', true);

                oOdataModel.create("/headerSet", header, {
                   success: jQuery.proxy(function(oData, response) {
                        // response header
                        var hdrMessage = response.headers["sap-message"];
                        var hdrMessageObject = JSON.parse(hdrMessage);
          
                        // log the header message
                        console.log(hdrMessageObject);
                        console.log(hdrMessageObject.message);
                        
                        oModel.setProperty('/isBusy', false); 
                    }, this),
                    error: function(oError) {
                        oModel.setProperty('/isBusy', false);
                        alert("Failure - OData Service could not be called. Please check the Network Tab at Debug.");
                    }
                });
                }
        });
    });
