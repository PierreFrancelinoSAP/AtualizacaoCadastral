sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","zatualizacaocadastral/model/models","./controller/ErrorHandler"],function(e,r,t,o){"use strict";return e.extend("zatualizacaocadastral.Component",{metadata:{manifest:"json",config:{fullWidth:true}},init:function(){this.executeODataRead();e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(t.createDeviceModel(),"device");this._oErrorHandler=new o(this)},destroy:function(){this._oErrorHandler.destroy();e.prototype.destroy.apply(this,arguments)},executeODataRead:function(){var e=this.getModel("ODataModel");var r=this.getModel("JSONModel");this.setModel(r,"JSONModel");r.setProperty("/isBusy",true);e.read("/headerSet('99999999')",{urlParameters:{$expand:"documentoSet,dependenteSet"},success:jQuery.proxy(function(e,t){r.setProperty("/Bairro",e.Bairro);r.setProperty("/CelularCorporativo",e.CelularCorporativo);r.setProperty("/Cep",e.Cep);r.setProperty("/Cidade",e.Cidade);r.setProperty("/Complemento",e.Complemento);r.setProperty("/EmailCorporativo",e.EmailCorporativo);r.setProperty("/EmailParticular",e.EmailParticular);r.setProperty("/EmployeePhoto",e.EmployeePhoto);r.setProperty("/Estado",e.Estado);r.setProperty("/NomeColaborador",e.NomeColaborador);r.setProperty("/Numero",e.Numero);r.setProperty("/Pais",e.Pais);r.setProperty("/Pernr",e.Pernr);r.setProperty("/Rua",e.Rua);r.setProperty("/TelefoneCelular",e.TelefoneCelular);r.setProperty("/TelefoneContato",e.TelefoneContato);r.setProperty("/GrupoEmpregado",e.GrupoEmpregado);r.setProperty("/GrupoEmpregadoTexto",e.GrupoEmpregadoTexto);r.setProperty("/SubgrupoEmpregado",e.SubgrupoEmpregado);r.setProperty("/SubgrupoEmpregadoTexto",e.SubgrupoEmpregadoTexto);r.setProperty("/AreaRh",e.AreaRh);r.setProperty("/AreaRhTexto",e.AreaRhTexto);r.setProperty("/dependenteSet",e.dependenteSet);r.setProperty("/documentoSet",e.documentoSet);var o=t.headers["sap-message"];var a=JSON.parse(o);console.log(a);console.log(a.message);r.setProperty("/isBusy",false)},this),error:function(e){r.setProperty("/isBusy",false);alert("Failure - OData Service could not be called. Please check the Network Tab at Debug.")}});e.read("/paisSet",{success:jQuery.proxy(function(e,t){var o=[];var a=[];var s;var p;a=t.data;var i=a.results.length;for(let e=0;e<i;e++){s=a.results[e].CodigoPais;p=a.results[e].DescricaoPais;o.push({CodigoPais:s,DescricaoPais:p})}r.setProperty("/paisSet",o);r.setProperty("/isBusy",false)},this),error:function(e){r.setProperty("/isBusy",false);alert("Failure - OData Service could not be called. Please check the Network Tab at Debug.")}})}})});