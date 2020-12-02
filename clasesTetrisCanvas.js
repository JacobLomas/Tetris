class Pieza{
    constructor(tetris){
        this.generarPieza(tetris);
    }
    generarPieza(tetris){
        this.color;
        this.posicion={
            y:0,
            x:4
        };
        let n=Math.floor(Math.random() * 7);
        switch(n){
            case 0:
                this.matriz=[
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
        
    }
    dibujarPieza(tetris){
        this.matriz.forEach((fila, indiceY) => {
            fila.forEach((valor, indiceX)=>{
                if(valor!=0){
                    tetris.canvas.fillStyle=this.color;
                    tetris.canvas.fillRect(indiceX+this.posicion.x, indiceY+this.posicion.y, 1,1);
                }
            })
        });
    }
    rotar(tetris){
        const pos=this.posicion.x;
        var compensador=1;
        for(var y=0; y<this.matriz.length; y++){
            for(var x=0; x<y; x++){
                [this.matriz[x][y], this.matriz[y][x]]= [this.matriz[y][x], this.matriz[x][y]];
            };
        }
        this.matriz.forEach(fila=> fila.reverse());
        while(this.colision(tetris)){
            this.posicion.x+=compensador;
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
    }

    down(tetris){
        this.posicion.y++;
        if(this.colision(tetris)){
            this.posicion.y--;
            tetris.adherirPieza(this.matriz, this.posicion);
            this.generarPieza();
        }
        
    }
    right(tetris){
        this.posicion.x++;
        if(this.colision(tetris))
            this.posicion.x--;
    }
    left(tetris){
        this.posicion.x--;
        if(this.colision(tetris))
            this.posicion.x++;
    }
    colision(tetris){
        try{
        for(var y=0; y<this.matriz.length; y++){
            for(var x=0; x<this.matriz[y].length; x++){
                if(this.matriz[y][x]!==0 && (tetris.grid[y+this.posicion.y]===undefined  || (tetris.grid[y+this.posicion.y][x+this.posicion.x]!==0 || tetris.grid[y+this.posicion.y][x+this.posicion.x]===undefined) ))
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
    constructor(){
        this.colores=[
            null,
            "cyan",
            "purple",
            "green",
            "red",
            "yellow",
            "orange",
            "blue"
        ];
        this.grid=this.crearTetrisMatriz();
        this.canvas=document.getElementById("tetris");
        this.canvas=this.canvas.getContext("2d");
        this.canvas.scale(40,40);
    };
    crearTetrisMatriz(){
        let matriz=[];
        var height=20;
        var width=10;
        for(let i=0; i<20; i++){
            matriz.push(new Array(width).fill(0))
        }        
        return matriz;
    }
    dibujarCanvas(){
        this.canvas.fillStyle="#000";
        this.canvas.fillRect(0,0, 400, 800);
        this.grid.forEach((fila, indiceY) => {
            fila.forEach((valor, indiceX)=>{
                if(valor!==0){
                    this.canvas.fillStyle=this.colores[valor];
                    this.canvas.fillRect(indiceX, indiceY, 1,1);
                }
            })
        });
    }
    adherirPieza(matriz, posicion){
        try{
        matriz.forEach((fila, y)=>{
            fila.forEach((valor, x)=>{
                if(valor!==0)
                this.grid[y+posicion.y][x+posicion.x]=valor;
            })
        });
        }catch(error){}
        this.borrarLinea();
    }
    borrarLinea(){
        for(var y=0; y<this.grid.length; y++){
            let nCeros=0;
            for(let i of this.grid[y]){
                if(i!=0)
                    nCeros++;
                if(nCeros==this.grid[y].length){
                    this.grid.splice(y,1);
                    this.grid.unshift(new Array(10).fill(0));
                }
            }
        }
    }
    isGameOver(){
        for(let pieza of this.grid[0])
            if(pieza!=0)
                return true;
        return false;
    }
}




var tetris, pieza;
window.onload=function(){
    tetris=new Tetris();
    pieza=new Pieza(tetris);
    setInterval(loop,300);
    document.addEventListener("keydown", function(k){
        if(k.key=="ArrowDown"){
            pieza.down(tetris);
        };
        if(k.key=="ArrowRight"){
            pieza.right(tetris);
        }
        if(k.key=="ArrowLeft"){
            pieza.left(tetris);
        }
        if(k.code=="Space"){
            pieza.rotar(tetris);
        }
    })
}

function loop(){
    tetris.dibujarCanvas();
    pieza.dibujarPieza(tetris);
    pieza.down(tetris);
    if(tetris.isGameOver())
        document.location.reload();
}