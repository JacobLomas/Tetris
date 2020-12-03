class Pieza{
    constructor(svg, tamanoCuadrado){
        this.rectSize=parseInt(tamanoCuadrado);
        this.generarPieza(svg);
    }
    generarPieza(svg){
        this.svg=svg;
        let n=Math.floor(Math.random() * 7);
        switch(n){
            case 0:
                this.matriz=[
                    [0,1,0,0],
                    [0,1,0,0],
                    [0,1,0,0],
                    [0,1,0,0]
                ];
                this.color="cyan";
                break;
            case 1:
                this.matriz=[
                    [0,0,0],
                    [2,2,2],
                    [0,2,0]
                ];
                this.color="purple";
                break;
            case 2:
                this.matriz=[
                    [0,3,3],
                    [3,3,0],
                    [0,0,0]
                ];
                this.color="green";
                break;
            case 3:
                this.matriz=[
                    [4,4,0],
                    [0,4,4],
                    [0,0,0]
                ];
                this.color="red";
                break;
            case 4:
                this.matriz=[
                    [5,5],
                    [5,5],
                ];
                this.color="yellow";
                break;
            case 5:
                this.matriz= [
                    [0,6,0],
                    [0,6,0],
                    [0,6,6]
                ];
                this.color="orange";
                break;
            case 6:
                this.matriz=[
                    [0,7,0],
                    [0,7,0],
                    [7,7,0]
                ];
                this.color="blue";
                break;
        }
        this.rectS=[];
        this.offset={
            x:3,
            y:0
        };
        this.drawPiece();
    }
    drawPiece(){
        this.matriz.forEach((row, y)=>{
            row.forEach((value, x)=>{
                if(value!=0){
                    let rect=document.createElementNS("http://www.w3.org/2000/svg", "rect");
                    rect.setAttribute("height", this.rectSize);
                    rect.setAttribute("width", this.rectSize);
                    rect.setAttribute("x", x*this.rectSize+this.offset.x*this.rectSize);
                    rect.setAttribute("y", y*this.rectSize+this.offset.y*this.rectSize);
                    rect.setAttribute("fill", this.color);
                    svg.appendChild(rect);
                    this.rectS.push(rect);
                }
            });
        });
    }
    rotate(tetris){
        const pos=this.offset.x;
        var compensador=1;
        for(var y=0; y<this.matriz.length; y++){
            for(var x=0; x<y; x++){
                [this.matriz[x][y], this.matriz[y][x]]= [this.matriz[y][x], this.matriz[x][y]];
            };
        }
        this.matriz.forEach(fila=> fila.reverse());
        while(this.colision(tetris)){
            this.offset.x+=compensador;
            if(compensador*=-1 > 0)//Tope en la Izquierda
                compensador=1;
            else //Tope en la Derecha
                compensador=-1;


            if(compensador>this.matriz[0].length){ //Si, aun así colisiona
                for(var y=0; y<this.matriz.length; y++){//Vuelve a rotar la pieza
                    for(var x=0; x<y; x++){
                        [this.matriz[x][y], this.matriz[y][x]]= [this.matriz[y][x], this.matriz[x][y]];
                    }
                }
                this.posicion.x=pos;
                break;
            }
        }
        this.eliminarNodosRect();
        this.drawPiece();
    }

    eliminarNodosRect(){
        let svg=this.svg;
        this.rectS.forEach(function(rect){
            svg.removeChild(rect);
        })
        this.rectS=[];
    }

    moveDown(tetris){
        let size=this.rectSize;
        if(this.colision(tetris)){
            this.offset.y--;
            size*=-1;
            tetris.adherirPieza(this.matriz, this.offset, this.rectS);
            this.generarPieza(this.svg);
        }else{
            this.offset.y++;
            this.eliminarNodosRect();
            this.drawPiece();
        }
    }
    moveLeft(tetris){
        let size=this.rectSize;
        this.offset.x--;
        if(this.colision(tetris)){
            this.offset.x++;
        }else{
            this.eliminarNodosRect();
            this.drawPiece();
        }
    }
    moveRight(tetris){
        let size=this.rectSize;
        this.offset.x++;
        if(this.colision(tetris)){
            this.offset.x--;
        }else{
            this.eliminarNodosRect()
            this.drawPiece();
        }
    }
    colision(tetris){
        try{
        for(var y=0; y<this.matriz.length; y++){
            for(var x=0; x<this.matriz[y].length; x++){
                if(this.matriz[y][x]!=0 && (tetris.grid[y+this.offset.y]===undefined  || (tetris.grid[y+this.offset.y][x+this.offset.x]!==0 || tetris.grid[y+this.offset.y][x+this.offset.x]===undefined) ))
                    return true;
            }
        }
        }catch(error){
            return true;
        }
        return false;
    }
}

class Tetris{
    constructor(svg, tamanoCuadrado){
        this.nivel=0;
        this.lineasBorradas=0;
        this.rectSize=tamanoCuadrado;
        this.svg=svg;
        svg.setAttribute("width", tamanoCuadrado*10);
        svg.setAttribute("height", tamanoCuadrado*21);
        this.grid=this.crearTetrisMatriz();
    };
    crearTetrisMatriz(){
        let matriz=[];
        for(let i=0; i<20; i++){
            matriz.push(new Array(10).fill(0))
        }
        return matriz;
    }
    adherirPieza(matriz, posicion){
        try{
        matriz.forEach((fila, y)=>{
            fila.forEach((valor, x)=>{
                if(valor!==0){
                    this.grid[y+posicion.y][x+posicion.x]=valor;
                }
            })
        });
        }catch(error){}
        this.borrarLinea(posicion); 
    }
    //Este metodo comprueba si hay que borrar alguna, en caso de que sí, la elimina de la matrid "grid"
    borrarLinea(){
        for(var y=0; y<this.grid.length; y++){
            let nCeros=0;
            for(let i of this.grid[y]){
                if(i!=0)
                    nCeros++;
                if(nCeros==this.grid[y].length){
                    this.borrarLineaVista(y);
                    this.grid.splice(y,1);
                    this.grid.unshift(new Array(10).fill(0));
                    this.lineasBorradas++;
                }
            }
        }
    }
    //Este metodo aplica el borrado de linea en la vista SVG
    borrarLineaVista(nLinea){
        let cuadrados=this.svg.getElementsByTagNameNS("http://www.w3.org/2000/svg","rect");
        //Usando HTMLCollection no funciona bien, por eso lo convierto a Array
        cuadrados= Array.from(cuadrados);
        for(let i=0; i<cuadrados.length; i++){
            //Borrar rect que están tienen como posicion y nLinea*this.Size
        if(parseInt(cuadrados[i].getAttribute("y"))/this.rectSize==nLinea+1)
            this.svg.removeChild(cuadrados[i]);
            //Bajar rect que tienen como posicion y un numero menor que nLinea*this.Size
        if(parseInt(cuadrados[i].getAttribute("y"))/this.rectSize<nLinea+1)
            cuadrados[i].setAttribute("y",parseInt(cuadrados[i].getAttribute("y"))+this.rectSize);
        }
    }
    isGameOver(){
        for(let pieza of this.grid[0])
            if(pieza!=0)
                return true;
        return false;
    }
}

class Juego{
    constructor(svg, tamanoCuadrado){
        this.tetris=new Tetris(svg, tamanoCuadrado);
        this.pieza=new Pieza(svg, tamanoCuadrado);
        this.controles();
    }
    lineasBorradas(){
        return this.tetris.lineasBorradas;
    }
    loop(){
        if(this.tetris.isGameOver())
            return true
        this.pieza.moveDown(this.tetris);
        if(this.tetris.isGameOver())
            return true
    }
    controles(){
        document.addEventListener("keydown", (e)=>{
            if(e.key=="ArrowDown")
                this.loop();
            if(e.code=="Space")
                this.pieza.rotate(this.tetris)
            if(e.key=="ArrowLeft")
                this.pieza.moveLeft(this.tetris);
            if(e.key=="ArrowRight")
                this.pieza.moveRight(this.tetris);
        })
    }

}


var startBtn, juego, colorInput, otraVezbtn;
window.onload=function(){
    startBtn=document.getElementById("start");
    otraVezbtn=document.getElementById("playAgain");
    colorInput=document.getElementById("svgColor");
    svg=document.getElementsByTagNameNS("http://www.w3.org/2000/svg","svg")[0];
    startBtn.addEventListener("click", ()=>{
        document.getElementById("firstFC").style.display="none";
        svg.style.display="initial";
        svg.style.backgroundColor=colorInput.value;
        juego = new Juego(svg, 30);
        loop();
        
    });
    otraVezbtn.addEventListener("click", ()=>{
        document.getElementById("gameOver").style.display="none";
        svg.style.display="initial";
        svg.style.backgroundColor=colorInput.value;
        juego = new Juego(svg, 30);
        loop();
        
    });
};
function loop(){
    var intervalo=setInterval(()=>{
        if(juego.loop()){
            svg.style.display="none";
            svg.innerHTML="";
            document.getElementById("gameOver").style.display="flex";
            document.getElementById("lineasRotas").innerText+=" "+juego.lineasBorradas();
            clearInterval(intervalo);
        }
    },500);
    
}