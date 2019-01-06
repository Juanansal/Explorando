/*Le da prioridad a una de las opciones del index (Login o Registro)*/


    function loco(opcion){
       
         console.log("entraaaa login 1");
        
        if(opcion == 1){ /*Si se esta mostrando el login*/
            
            document.getElementById("loginTAB").classList.remove('formularioIndex2');
            document.getElementById("loginTAB").classList.add('formularioIndex1');
            
            document.getElementById("registroTAB").classList.remove('formularioIndex1');
            document.getElementById("registroTAB").classList.add('formularioIndex2');
            
            

        }
        else{ /*Si se esta mostrando el registro*/
            document.getElementById("loginTAB").classList.remove('formularioIndex1');
            document.getElementById("loginTAB").classList.add('formularioIndex2');
            
            document.getElementById("registroTAB").classList.remove('formularioIndex2');
            document.getElementById("registroTAB").classList.add('formularioIndex1');
            
            

        }
    }    

$('.carousel').carousel({
        pause: "false", //No se para al tener el raton encima
        interval: 3000 //Velocidad de transicion
        
    })