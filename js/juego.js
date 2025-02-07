//AÚN FALTA DEPURAR EL CÓDIGO


let juegoIniciado = false;

let DARIUS =false;

let numeroJugadores = 2;
//selectorNumJug simplemente guarda el select en html donde elegimos el numero de jugadores
let selectorNumJug = document.getElementById("selectorJugadores");

let numCartonesJug1 = 1;
let selectorNumCartJug1 = document.getElementById("selectCartonesJugador1");

let numCartonesJug2 = 1;
let selectorNumCartJug2 = document.getElementById("selectCartonesJugador2");

let automarcar = false;
let automarcarElemento = document.getElementById("checkAutomarcar");


//Se crea un array con todos los cartones, solo se crea el array, los cartones no estan iniciados creados aún
let cartones = [
    new carton(1, 1, 0),
    new carton(2, 1, 1),
    new carton(3, 1, 2),
    new carton(4, 1, 3),
    new carton(5, 1, 4),
    new carton(1, 2, 5),
    new carton(2, 2, 6),
    new carton(3, 2, 7),
    new carton(4, 2, 8),
    new carton(5, 2, 9)
];

let victoria = false;

let numero;
let repetido = false;
let numerosQueHanSalido = new Array();

let opcionSeleccionada;


function empezarJuego(){
    
    if(juegoIniciado == false){
        juegoIniciado = true;

        document.getElementById("menuInicial").style.display = "none";

        DARIUS = true;

        document.getElementById("contJuego").style.display = "grid";

        numeroJugadores = selectorNumJug.options[selectorNumJug.selectedIndex].value;

        //Se guardan los valores del número de jugadores
        numCartonesJug1 = parseInt(selectorNumCartJug1.options[selectorNumCartJug1.selectedIndex].value);

        numCartonesJug2 = parseInt(selectorNumCartJug2.options[selectorNumCartJug2.selectedIndex].value);

        (automarcarElemento.checked) ? automarcar = true : automarcar = false;

        //Se inician los cartones del jugador 1
        for(let i=0; i<numCartonesJug1; i++){
            console.log("Se inicia carton jugador 1");
            cartones[i].iniciarCarton();//Se inicia el cartón

            //En caso que automarcar sea true, se activa en los cartones la opción de automarcar
            if(automarcar) cartones[i].automarcar = true;
        }

        if(numeroJugadores != 2){//En caso de elegir el modo 1 jugador, las casillas del segundo jugador se marcarán solas

            numCartonesJug2 = Math.floor(Math.random()*5+1);

            for(let i=5; i<numCartonesJug2+5; i++){
                cartones[i].automarcar = true;
                console.log("Hay: " + numCartonesJug2 + "cartones para el jugador 2. Se inicia carton jugador 2, la i es: " + i);
                cartones[i].iniciarCarton();
            }   
        } else{
            for(let i=5; i<numCartonesJug2+5; i++){
                console.log("Se inicia carton jugador 2");
                cartones[i].iniciarCarton();

                //En caso que automarcar sea true, se activa en los cartones la opción de automarcar
                if(automarcar) cartones[i].automarcar = true;
            } 
        }
    //Se inician los cartones del jugador 2
    }
       
    
}


function siguienteNumero(){

    if(victoria) return;//Si la variable victoria es true sale del método

    //Lógica que se ejecuta cuando pulsamos el botón para que aparezca otro número
    while(true){
        numero = Math.floor(Math.random() * 89 + 1);

        if(numerosQueHanSalido[0] == undefined){//Se ejecuta solo cuando sale el primer número
            numerosQueHanSalido.push(numero);
            
            document.getElementById("numero").innerHTML = numero;//Se muestra en pantalla el número que ha salido
            
            console.log(numerosQueHanSalido);
            console.log("a");
            break;

            
        } else{
            for(i=0; i<numerosQueHanSalido.length; i++){//Recorre un array en el cual se almacenan todos los números que han salidio, en caso de que el numero generado ya exista en el array, se volverá a ejecutar el bucle y se generará otro número

                if(numero == numerosQueHanSalido[i]){

                    repetido = true;

                    //Si el número ha aparecido en alguna posicion se sale del for 
                    //se pone la variable repetido en true y el número se volverá a generar
                    console.log("numero repetido: " + numero);
                    break;
                } else{
                    repetido = false;
                }
            }

            if(!repetido){//En caso que el numero generado no sea repetido:

                numerosQueHanSalido.push(numero);//Se añade el numero a la lista para indicar que ya ha salido

                document.getElementById("numero").innerHTML = numero;// + "<br> No te olvides pulsar las casillas resaltadas en verde para tacharlas.";//Se muestra en pantalla el número que ha salido
                console.log(numerosQueHanSalido);
                break;

            } else if(numerosQueHanSalido.length >= 89){
                alert("ya han salido todos los numeros");
                break;
            }

            
        }
        
    }

    //Una vez el número se ha genereado y se ha mostrado en pantalla, se recorre cada carton individual para comprobar si hay alguno que tenga el número generado, en caso de que lo tenga, se pinta la casilla de verde
    for(let i=0; i<cartones.length; i++){
        //For que recorre el array con los cartones

        for(let j=0; j<3; j++){
            //For que recorre las columnas

            for(let k=0; k<9; k++){
                //For que recorre las filas

                console.log(numero);

                if(cartones[i].casillas[j][k] == numerosQueHanSalido[numerosQueHanSalido.length-1]){
                    //Se compruebo si la casilla actual es equivalente al número que ha salido
                    cartones[i].casillas[j][k] += 100;//Se suma 100 a su valor para indicar que es una casilla que 
                    //no esta marcada pero que corresponde a un número que ya ha salido
                   
                    if(cartones[i].automarcar){//Se comprueba si la opción de automarcar está habilitada
                        //En caso de estarlo, se vuelve a sumar 100 a la casilla y se le añade la clase que indica que esta marcada
                        cartones[i].casillas[j][k] += 100;
                        document.getElementById(`casilla${cartones[i].jugador}${cartones[i].id}${j*9+k}`).classList.add('casillaTachada');
                    } else{
                        document.getElementById(`casilla${cartones[i].jugador}${cartones[i].id}${j*9+k}`).classList.add('casillaSePuedeTachar');
                    }

                }
            }
        }
    }

    //Se muestran en la parte inferior de la pantalla el número que ha aparecido
    //document.getElementById("numerosAparecidos").innerHTML += numero + ", ";

    let number = document.createElement("h1");

    number.innerHTML = numero;

    document.getElementById("contNumeros").appendChild(number);

    //Se comprueba la victoria de los cartones
    for(let i=0; i<10; i++){
        cartones[i].comprobarVictoria();
    }

}

setInterval(() => {
    numeroJugadores = selectorNumJug.options[selectorNumJug.selectedIndex].value;

    if(numeroJugadores == 1){
        document.getElementById("contSelectCartJug2").style.display = "none";
    } else{
        document.getElementById("contSelectCartJug2").style.display = "inherit";
    }

}, 500);