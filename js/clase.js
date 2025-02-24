//Se crea una clase llamado carton, aqui se gestionará toda la lógica de cada cartón individual
class Carton {

    constructor(id, jugador, varID){
        this.id = id;
        this.jugador = jugador;
        this.varID = varID;
        this.automarcar = false;
        this.ordenarNum = new Array();

        //Array donde se indicará el estado de cada casilla
        this.casillas = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]];
        //Guia:
        //100 = hueco
        //1-89 número correspondiente
        //101-189 número correspondiente pero que está tachado
    }

    //Función encargada de crear el array con los numeros y huecos y de crear los elementos en el DOM correspondientes
    iniciarCarton(){
        //Al crear el cartón existirán 6 columnas con 2 numeros y 1 hueco, y 3 columnas con 
        // 1 número y 2 huecos. El array columnas indica cuales serán las columnas con solo un número
        let columnas = new Array(9).fill(0);
        let posicionesAsignadas = 0;

        //Indica que columnas tendrán 2 números
        while(posicionesAsignadas<6){
            //Elije una posicion aleatorio del array (genera un número entre el 0 y 8);
            let indiceAlAzar = Math.floor(Math.random() * 9);

            //Se comprueba que la posición que se quiere sobreescribir no se ha sobreescrito anteriormente
            if(columnas[indiceAlAzar] == 0){
                columnas[indiceAlAzar] = 1;
                posicionesAsignadas++;
            }
        }

        //Bucle encargado de marcar las casillas vacias
        for(let i=0; i<9; i++){
            
            let numero = Math.floor(Math.random() * 3);

            //Si la columna vale 0 significa que hay 2 huecos, por lo que la posicion del numero aleatorio se dejará vacia
            //para posteriormente mostrar un número aleatorio
            if(columnas[i] == 0){
                for(let j=0; j<3; j++){
                    if(j != numero){
                        this.casillas[j][i] = 100;
                    }
                }
            }

            //Si la columna vale 1 significa que hay 1 hueco por lo que el numero aleatorio se indicará para marcar la posición
            //del hueco
            if(columnas[i] == 1){
                this.casillas[numero][i] = 100;
            }

            let j = 0;

            //Crea los numeros aleatorios
            while(j<3){
                if(this.casillas[j][i] != 100){
                    //Se recorren las casillas y en caso que no tengan un valor de 100(hueco) se 
                    //rellenan con un número aleatorio
                    let numero = Math.floor(Math.random() * 10 + 10 * i);

                    if(numero != 0){
                        //Se comprueba que no hayan números repetidos y que el numero generado no sea 0
                        if(j==0 || j==1 && this.casillas[j-1][i] != numero || j==2 && this.casillas[j-1][i] != numero && this.casillas[j-2][i] != numero){
                            this.casillas[j][i] = numero;
                        } else{
                            //Si el numero era 0, se resta 1 a j para que el bucle se repita una vez mas y se genere otro número
                            j--;
                        }
                    } else{
                        //Si el numero era 0, se resta 1 a j para que el bucle se repita una vez mas y se genere otro número
                        j--;
                    }
                                  
                }

                j++;
            }   
        }

        this.ordenarCarton();


        // --------------- LOGICA PARA LA CREACIÓN DE LOS CORRESPONDIENTES ELEMENTOS EN EL DOM --------------------
        let contCasillas = document.createElement("div");

        contCasillas.classList = 'contCasillas';
        contCasillas.id = `contCasillasJugador${this.jugador}`;

        document.getElementById(`cartonesJugador${this.jugador}`).appendChild(contCasillas);

        //Bucle que se repite 27 veces y crea las 27 casillas
        for(let i=0; i< 27; i++){

            let fila = Math.floor(i/9);
            let columna = i % 9;

            //Crea una variable la cual es un div
            let casilla = document.createElement("div");
            let casillaNum = document.createElement("p");

            //Se asigna una clase (para facil acceso mediante css)
            casilla.classList = 'casilla';
            //Se asigna el identificador único
            casilla.id = `casilla${this.jugador}${this.id}${i}`;

            //casilla.setAttribute('onclick', `cartones[${this.varID}].clic(${fila}, ${columna})`);
            casilla.setAttribute('onclick', `cartones[${this.varID}].clic(${fila},${columna})`);

            //Se añade la casilla al contenedor correspondiente de los cartones
            contCasillas.appendChild(casilla);
            //Se añade el p con el numero que va dentro de cada casilla
            casilla.appendChild(casillaNum);

            //Lógica si la casilla actual es un hueco
            if(this.casillas[fila][columna] == 100){
                casilla.style.backgroundColor = "black";
            } else{ //Lógica si la casilla no es un hueco y es un número
                casilla.firstChild.innerHTML = this.casillas[fila][columna];
            }

            

        }


        //console.log("columnas: " + columnas);
        //console.table(this.casillas);
    }

    ordenarCarton(){
        for(let i=0; i<9; i++){
            for(let k=0; k<3; k++){
                if (this.casillas[k][i] != 100){
                    this.ordenarNum.push(this.casillas[k][i]);
                } 
            }
        }

        this.ordenarNum.sort((a, b) => a - b);

        let j = 0;

        for(let i=0; i<9; i++){
            for(let k=0; k<3; k++){
                if (this.casillas[k][i] != 100){
                    this.casillas[k][i] = this.ordenarNum[j];
                    j++;
                } 
            }
        }

        console.table(this.ordenarNum);
    }

    //Método que se activa al clicar una casilla
    clic(fila, columna){

        if(victoria) return;//Si la variable victoria es true sale del método

        console.log(fila + " " + columna);

        let casilla = document.getElementById(`casilla${this.jugador}${this.id}${fila*9+columna}`);

        if(this.casillas[fila][columna] > 100 && this.casillas[fila][columna] < 200){
            //Si el valor de la casilla es 101 o mas y menor a 200 significa que la casilla puede ser marcada
            this.casillas[fila][columna] += 100;
            //se suma 100 a la casilla para asi indicar que esta tachada

            //Se añaden y quitan las clases correspondientes para el estilo
            casilla.classList.remove('casillaSePuedeTachar');
            casilla.classList.add('casillaTachada');
            //classList.add() es una función usada para añadir una clase a un elemento del DOM y así 
            //cambiar su estilo usando los estilos de una clase creada en el archivo css
        }

        this.comprobarVictoria();
    }

    comprobarVictoria(){

        let casillasMarcadas = 0;
        
        //console.table(this.casillas);

        for(let i=0; i<27; i++){
            if(this.casillas[Math.floor(i/9)][i%9] > 200){
                casillasMarcadas++;
            }
        }

        if(casillasMarcadas==15){
            setTimeout(() => {
                alert("¡Ha ganado el jugador " + this.jugador + "!" + ` Carton : ${this.id}`);
                victoria = true;//La variable victoria se pone en true para no permitir seguir jugando

                let contVolverJugar = document.createElement("div");
                let textoVolverJugar = document.createElement("a");

                contVolverJugar.id = "contVolverJugar";

                textoVolverJugar.innerHTML = "Volver a jugar otra partida";
                textoVolverJugar.href = "inicio.html";

                document.getElementById("win").appendChild(contVolverJugar);
                contVolverJugar.appendChild(textoVolverJugar);

                document.getElementById("contJuego").style.display = 'none';
            }, 10);   
        }        
    }
}