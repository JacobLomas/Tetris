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
        const color=this.color;
        let size=this.rectSize;
        let offset=this.offset;
        let rectS=this.rectS;
        this.matriz.forEach(function(row, y){
            row.forEach(function(value, x){
                if(value!=0){
                    let rect=document.createElementNS("http://www.w3.org/2000/svg", "rect");
                    rect.setAttribute("height", size);
                    rect.setAttribute("width", size);
                    rect.setAttribute("x", x*size+offset.x*size);
                    rect.setAttribute("y", y*size+offset.y*size);
                    rect.setAttribute("fill", color);
                    svg.appendChild(rect);
                    rectS.push(rect);
                }
            });
        });
    }
    rotate(){
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
            this.rectS.forEach(function(rect){
                let y=parseInt(rect.getAttribute("y"));
                rect.setAttribute("y",y+size);
            })
        }
    }
    moveLeft(tetris){
        let size=this.rectSize;
        this.offset.x--;
        if(this.colision(tetris)){
            this.offset.x++;
        }else{
            this.rectS.forEach(function(rect){
                let x=parseInt(rect.getAttribute("x"));
                rect.setAttribute("x",x-size);
            })
        }
    }
    moveRight(tetris){
        let size=this.rectSize;
        this.offset.x++;
        if(this.colision(tetris)){
            this.offset.x--;
        }else{
            this.rectS.forEach(function(rect){
                let x=parseInt(rect.getAttribute("x"));
                rect.setAttribute("x",x+size);
            })
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
        this.rectS=new Array(20).fill(new Array(10));
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
    adherirPieza(matriz, posicion, rectS){
        try{
        matriz.forEach((fila, y)=>{
            fila.forEach((valor, x)=>{
                if(valor!==0){
                    this.grid[y+posicion.y][x+posicion.x]=valor;
                }
            })
        });
        }catch(error){}
        this.rectS=rectS;
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
                }
            }
        }
    }
    //Este metodo aplica el borrado de linea en la vista si es svg
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
    loop(){
        console.log(this.pieza);
        this.pieza.moveDown(this.tetris);
    }
    controles(){
        document.addEventListener("keydown", (e)=>{
            if(e.key=="ArrowDown"){
                this.pieza.moveDown(this.tetris);
                if(this.tetris.isGameOver())
                    location.reload();
            }
            if(e.code=="Space"){
                this.pieza.rotate(this.tetris)
            }
            if(e.key=="ArrowLeft"){
                this.pieza.moveLeft(this.tetris);
            }
            if(e.key=="ArrowRight"){
                this.pieza.moveRight(this.tetris);
            }
        })
    }

}


var juego;
window.onload=function(){
    svg=document.getElementsByTagNameNS("http://www.w3.org/2000/svg","svg")[0];
    juego= new Juego(svg, 20);
};

/* 
var svg, pieza, tetris;
window.onload=function(){
    svg=document.getElementsByTagNameNS("http://www.w3.org/2000/svg","svg")[0];
    pieza=new Pieza(svg, 25);
    tetris=new Tetris(svg, 25);
    document.addEventListener("keydown", function(e){
        if(e.key=="ArrowDown"){
            pieza.moveDown(tetris);
            if(tetris.isGameOver())
                location.reload();
        }
        if(e.code=="Space"){
            pieza.rotate(tetris)
        }
        if(e.key=="ArrowLeft"){
            pieza.moveLeft( tetris);
        }
        if(e.key=="ArrowRight"){
            pieza.moveRight( tetris);
        }
    })
}; */