sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"    
],
function (MessageToast,Controller,JSONModel,Fragment) {
    "use strict";

    return Controller.extend("tdlns.project2.controller.ToDoList", {
        onInit: function () {
            let oModelTareas = new JSONModel(
                {
                    Tareas:
                    [
                        /* {
                            Descripcion: null,
                            Activa: null,
                        }, */
                    ]
                }
            );
            this.getView().setModel(oModelTareas, "Tarea");

            // const aTareas = oModel.getProperty("/Tareas"); 
            
            this.aCabeceras =["Descripcion","Activa"];
            
                     
            
            //Array Control Status Tareas
/*             this.aControlInputs =[
                {Boton:1, Status:false}, //false=vacío , true=rellenado
                {Boton:2, Status:false},
                {Boton:3, Status:false}

            ]; */

        },

        //Boton para agregar tareas
        onAgregarFragment: function (oEvent2) {
            var oDialog = this.byId('addTaskDialog'); //Devuelve la fuente que disparó el evento. No necesaria.
            const oInput2 = this.getView().byId("IngresaTarea2");
            let sTareaAgregar = this.getView().byId("IngresaTarea2").getValue().trim();  //COMENTAR CON VICTOR .TRIM
            let oBundle = this.getView().getModel("i18n").getResourceBundle(); //Modelo de Traducciones 
            const oModel = this.getView().getModel("Tarea");
            const aTareas = oModel.getProperty("/Tareas");

            if (!sTareaAgregar) {
			oDialog.attachEventOnce("updateFinished", oInput2.focus, oInput2);
                        
                return;
            } // Evitar que se puedan agregar tareas vacías.


        /*    this.oModelTareas.Tareas[0].Descripcion = sTareaAgregar;

             */

            aTareas.push({
                Descripcion: sTareaAgregar,
                Activa: true
            });
            
            oModel.setProperty("/Tareas",aTareas);

            this.getView().byId("IngresaTarea2").setValue("");
            this.byId('addTaskDialog').close();

            MessageToast.show(oEvent2.getSource().getId() + " Pressed");
        },
        
        //Boton para borrar tareas
        onDeleteTask: function(oEvent) {
			var oList = oEvent.getSource(); //Devuelve la fuente que disparó el evento. No necesaria.
			var oItem = oEvent.getParameter("listItem"); //Toma en oItem el parametro listItem
            const oContext = oItem.getBindingContext("Tarea"); //Le doy contexto dentro de mi modelo
            const oModel = this.getView().getModel("Tarea"); //Declaro el modelo en la funcion            
            const aTasks = oModel.getProperty("/Tareas"); //Genero un array de tareas de mi modelo
            const oInput = this.getView().byId("Agregar");
            
            
            var sPath = oContext.getPath(); //Tomo la ruta que quiero actualizar
            const iIndex = Number(sPath.split("/").pop()); //deconstruyo la ruta en un item integer

                console.log("Source:", oList);
                console.log("Item:", oItem);
                console.log("Context:", oContext);
                console.log("Path:", oContext.getPath());
                console.log("Objeto:", oContext.getObject());

            aTasks.splice(iIndex, 1); //splice(posicion sobre la que actuo, cantidad de posiciones a borrar)

            oModel.setProperty("/Tareas", aTasks); //seteo las tareas del array actualizado al modelo

			// after deletion put the focus back to the list
			oList.attachEventOnce("updateFinished", oInput.focus, oInput);

			// send a delete request to the odata service
			//oModel.remove(sPath);             PARA CUANDO TRABAJE DIRECTAMENTE SOBRE oData
		},

            /*
            let sTareaAgregar = this.getView().byId("IngresaTarea").getValue();
            let sBundle = this.getView().getModel("i18n").getResourceBundle(); //Modelo de Traducciones
          
            for (let i=0; i<=this.aControlInputs.length-1; i++)
            {
                let j= i+1;
                if (this.aControlInputs[i].Status === false) {
                    let sIdTarea = "Input" + j;

                    this.getView().byId(sIdTarea).setLabel(sTareaAgregar);
                    this.getView().byId(sIdTarea).setProperty("visible",true);
                    this.aControlInputs[i].Status = true;

                break;
                }
                else if(i==this.aControlInputs.length-1)
                { 
                this.getView().byId("IngresaTarea").setValue("");
                this.getView().byId("IngresaTarea").setProperty("placeholder",sBundle.getText("NoMasTareas"));
                }
            }
                //resultado += `5 x ${i} = ${5*i}\n`         
            },                                              ANTIGUA FUNCIÓN ONAGREGAR*/ 


            //this.getView().byId("Input2").setLabel(sTareaAgregar);

        //this.getView().byId("Input2").setText(sBundle.getText("TareaTest"));
        


        onOpenDialog: function (oEvent)
        {
            /* this.dialog = this.getOwnerComponent().loadFragment({
                name: "tdlns.project2.view.fragment.AddTask"
            });

            this.dialog.open(); */

            let oBundle = this.getView().getModel("i18n") // .getResourceBundle(); //Modelo de Traducciones 
            var oView = this.getView();

            //const sText = oBundle.getText("IngresaTarea2");
            MessageToast.show(oEvent.getSource().getId() + " Pressed");

            if(!this.byId('addTaskDialog')){
                
                Fragment.load({
                    id: oView.getId(),
                    name: "tdlns.project2.view.fragment.AddTask",
                    controller: this
                }).then((oDialog) => {
                    oView.addDependent(oDialog);
                    oDialog.open();                
                }).bind(this); //Bindear This para reconocerlo en las funciones encapsuladas en otras funciones
        
            //this.getView().addDependent(oDialog);
            }else{
                this.byId('addTaskDialog').open();
                } 

        },

        onCancelarFragment: function () {
            this.byId('addTaskDialog').close();
        }

    });
});
