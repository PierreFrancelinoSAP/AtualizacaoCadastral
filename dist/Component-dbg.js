sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "zatualizacaocadastral/model/models",
        "./controller/ErrorHandler"
    ],
    function (UIComponent, Device, models, ErrorHandler) {
        "use strict";

        return UIComponent.extend("zatualizacaocadastral.Component", {
            metadata: {
                manifest: "json",
                config: { fullWidth: true }  
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {

                this.executeODataRead();



                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");

                 // initialize the error handler with the component
                 this._oErrorHandler = new ErrorHandler(this);
            },

            destroy : function () {
                this._oErrorHandler.destroy();
                // call the base component's destroy function
                UIComponent.prototype.destroy.apply(this, arguments);
            },

            executeODataRead : function(){
                var oModel     = this.getModel("ODataModel"); 
                var oJSONModel = this.getModel("JSONModel");

                this.setModel (oJSONModel, "JSONModel");
                oJSONModel.setProperty('/isBusy', true);
                
                oModel.read("/headerSet('99999999')", {
                        
                  urlParameters: {
                    "$expand": "documentoSet,dependenteSet",
                  },
                  success: jQuery.proxy(function(oData, response) {
 
                  oJSONModel.setProperty('/Bairro', oData.Bairro);
                  oJSONModel.setProperty('/CelularCorporativo', oData.CelularCorporativo);
                  oJSONModel.setProperty('/Cep', oData.Cep);
                  oJSONModel.setProperty('/Cidade', oData.Cidade);
                  oJSONModel.setProperty('/Complemento', oData.Complemento);
                  oJSONModel.setProperty('/EmailCorporativo', oData.EmailCorporativo);
                  oJSONModel.setProperty('/EmailParticular', oData.EmailParticular);
                  oJSONModel.setProperty('/EmployeePhoto', oData.EmployeePhoto);
                  oJSONModel.setProperty('/Estado', oData.Estado);
                  oJSONModel.setProperty('/NomeColaborador', oData.NomeColaborador);
                  oJSONModel.setProperty('/Numero', oData.Numero);
                  oJSONModel.setProperty('/Pais', oData.Pais);
                  oJSONModel.setProperty('/Pernr', oData.Pernr);
                  oJSONModel.setProperty('/Rua', oData.Rua);
                  oJSONModel.setProperty('/TelefoneCelular', oData.TelefoneCelular);
                  oJSONModel.setProperty('/TelefoneContato', oData.TelefoneContato);
                  oJSONModel.setProperty('/GrupoEmpregado', oData.GrupoEmpregado);
                  oJSONModel.setProperty('/GrupoEmpregadoTexto', oData.GrupoEmpregadoTexto);
                  oJSONModel.setProperty('/SubgrupoEmpregado', oData.SubgrupoEmpregado);
                  oJSONModel.setProperty('/SubgrupoEmpregadoTexto', oData.SubgrupoEmpregadoTexto);
                  oJSONModel.setProperty('/AreaRh', oData.AreaRh);
                  oJSONModel.setProperty('/AreaRhTexto', oData.AreaRhTexto);
                  oJSONModel.setProperty('/dependenteSet', oData.dependenteSet);
                  oJSONModel.setProperty('/documentoSet', oData.documentoSet);
                             
                 // response header
                 var hdrMessage = response.headers["sap-message"];
                 var hdrMessageObject = JSON.parse(hdrMessage);
           
                 // // log the header message
                 console.log(hdrMessageObject);
                 console.log(hdrMessageObject.message);
                    
                 oJSONModel.setProperty('/isBusy', false); 
                 }, this),
                     error: function(oError) {
                        oJSONModel.setProperty('/isBusy', false); 
                        alert("Failure - OData Service could not be called. Please check the Network Tab at Debug.");
                    }
                });    
                
                oModel.read("/paisSet", {
                    success: jQuery.proxy(function(oData, response) {

                    var paisSet = [];
                    var entitySet = [];
                    var CodigoPais;
                    var DescricaoPais;    

                    entitySet = response.data; 

                    var arrayLength = entitySet.results.length;
                   
                    for (let x = 0; x < arrayLength; x++) {
                        CodigoPais    = entitySet.results[x].CodigoPais;
                        DescricaoPais = entitySet.results[x].DescricaoPais;

                        paisSet.push({
                            CodigoPais    : CodigoPais,
                            DescricaoPais : DescricaoPais
                        });
                    }
                        
                    oJSONModel.setProperty('/paisSet', paisSet);
                      
                   oJSONModel.setProperty('/isBusy', false); 
                   }, this),
                       error: function(oError) {
                          oJSONModel.setProperty('/isBusy', false); 
                          alert("Failure - OData Service could not be called. Please check the Network Tab at Debug.");
                      }
                  });   



















            }








            









        });
    }
);