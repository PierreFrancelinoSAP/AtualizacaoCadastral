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
     function(Controller, Button, Dialog, Fragment, coreLibrary, mobileLibrary, Text, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("zatualizacaocadastral.controller.ViewMain", {
            onInit: function () {
                var oMessageManager;
                var that = this;

                // set message model
                oMessageManager = sap.ui.getCore().getMessageManager();
                this.getView().setModel(oMessageManager.getMessageModel(), "message");

                // activate automatic message generation for complete view
			    oMessageManager.registerObject(this.getView(), true);
                
                that.executeODataRead();
            },

            executeODataRead : function(){
                var oModel     = this.getView().getModel(); 
                var busyDialog = (sap.ui.getCore().byId("busy")) ? sap.ui.getCore().byId("busy") : new sap.m.BusyDialog('busy',{text:'Carregando', title: 'Carregando'});
    
                oModel.attachRequestSent(function(){busyDialog.open();})
                    oModel.read("/headerSet('99999999')", {
                        urlParameters: {
                            "$expand": "documentoSet,dependenteSet",
                        },
                        success: jQuery.proxy(function(oData, response) {
                             // response header
                             var hdrMessage = response.headers["sap-message"];
                             var hdrMessageObject = JSON.parse(hdrMessage);
               
                             // log the header message
                             console.log(hdrMessageObject);
                             console.log(hdrMessageObject.message);
                             
                             this.bindData(response);   
                         }, this),
                         error: function(oError) {
                             alert("Failure - OData Service could not be called. Please check the Network Tab at Debug.");
                         }
                     });
                     oModel.attachRequestCompleted(function(){busyDialog.close();});
            },

            bindData : function(response){ 
                this.bindHeader(response);
            },

            bindHeader : function(response){
                this.getView().byId("inputNome").setValue(response.data.NomeColaborador);
                this.getView().byId("inputTelefoneCelular").setValue(response.data.TelefoneCelular);
                this.getView().byId("inputTelefoneContato").setValue(response.data.TelefoneContato);
                this.getView().byId("inputCelularCorporativo").setValue(response.data.CelularCorporativo);
                this.getView().byId("inputEmailParticular").setValue(response.data.EmailParticular);
                this.getView().byId("inputEmailCorporativo").setValue(response.data.EmailCorporativo);
                // this.getView().byId("inputLogradouro").setValue(response.data.Logradouro);
                this.getView().byId("inputRua").setValue(response.data.Rua);
                this.getView().byId("inputNumero").setValue(response.data.Numero);
                this.getView().byId("inputBairro").setValue(response.data.Bairro);
                this.getView().byId("inputComplemento").setValue(response.data.Complemento);
                this.getView().byId("inputCidade").setValue(response.data.Cidade);
                this.getView().byId("inputCep").setValue(response.data.Cep);
                this.getView().byId("inputEstado").setValue(response.data.Estado);
                this.getView().byId("inputPais").setValue(response.data.Pais);
            },


            onActionSave: function() {

                var that = this;
                var oModel = this.getView().getModel(); 
                var headerData = {};
                
                var documentoData = [];
                var dependenteData = [];
                var escolaridadeData = [];
                
                headerData                 = that.getHeaderDataFromScreen(); 
                headerData.documentoSet    = documentoData;
                headerData.dependenteSet   = dependenteData;
                headerData.escolaridadeSet = escolaridadeData;
                                
                that.executeOdataCreate(headerData);
            }, 

            executeOdataCreate: function(header) {
                var oModel     = this.getView().getModel(); 
                var busyDialog = (sap.ui.getCore().byId("busy")) ? sap.ui.getCore().byId("busy") : new sap.m.BusyDialog('busy',{text:'Carregando', title: 'Carregando'});

                oModel.attachRequestSent(function(){busyDialog.open();})
                oModel.create("/headerSet", header, {
                   success: jQuery.proxy(function(oData, response) {
                        // response header
                        var hdrMessage = response.headers["sap-message"];
                        var hdrMessageObject = JSON.parse(hdrMessage);
          
                        // log the header message
                        console.log(hdrMessageObject);
                        console.log(hdrMessageObject.message);
                        
                        this.bindData(response); 
                    }, this),
                    error: function(oError) {
                        alert("Failure - OData Service could not be called. Please check the Network Tab at Debug.");
                    }
                });
                    oModel.attachRequestCompleted(function(){busyDialog.close();});
                },

            getHeaderDataFromScreen : function() {
                var headerData = {};

                headerData.NomeColaborador    = this.getView().byId("inputNome").getValue();
                headerData.TelefoneCelular    = this.getView().byId("inputTelefoneCelular").getValue();
                headerData.TelefoneContato    = this.getView().byId("inputTelefoneContato").getValue();
                headerData.CelularCorporativo = this.getView().byId("inputCelularCorporativo").getValue();
                headerData.EmailParticular    = this.getView().byId("inputEmailParticular").getValue(); 
                headerData.EmailCorporativo   = this.getView().byId("inputEmailCorporativo").getValue();
                // headerData.Logradouro         = this.getView().byId("inputLogradouro").getValue();
                headerData.Rua                = this.getView().byId("inputRua").getValue();
                headerData.Numero             = this.getView().byId("inputNumero").getValue();
                headerData.Bairro             = this.getView().byId("inputBairro").getValue();
                headerData.Complemento        = this.getView().byId("inputComplemento").getValue();
                headerData.Cidade             = this.getView().byId("inputCidade").getValue();
                headerData.Cep                = this.getView().byId("inputCep").getValue();
                headerData.Estado             = this.getView().byId("inputEstado").getValue();
                headerData.Pais               = this.getView().byId("inputPais").getProperty("selectedKey");

                return headerData;
            },

            onMessagePopoverPress : function (oEvent) {
                var oSourceControl = oEvent.getSource();
                this._getMessagePopover().then(function(oMessagePopover){
                    oMessagePopover.openBy(oSourceControl);
                });
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
    
        onClearPress : function(){
                sap.ui.getCore().getMessageManager().removeAllMessages();
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
					oView.addDependent(oDialog);
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

        onValueHelpDialogSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("DescricaoPais", FilterOperator.Contains, sValue);

			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

        onValueHelpDialogClose: function (oEvent) {
			var sDescription,
				oSelectedItem = oEvent.getParameter("selectedItem");
			oEvent.getSource().getBinding("items").filter([]);

			if (!oSelectedItem) {
				return;
			}

			sDescription = oSelectedItem.getDescription();

			this.byId("inputPais").setSelectedKey(sDescription);
			this.byId("selectedKeyIndicator").setText(sDescription);

		},

        onSuggestionItemSelected: function (oEvent) {
			var oItem = oEvent.getParameter("selectedItem");
			var oText = oItem ? oItem.getKey() : "";
			this.byId("selectedKeyIndicator").setText(oText);
		}
       
        
        
    
        });
    });
