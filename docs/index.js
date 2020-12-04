import{Juego} from "./clasesTetrisSVG.js";

var div, startBtn, juego, colorInput, otraVezbtn;
window.onload=function(){
    startBtn=document.getElementById("start");
    otraVezbtn=document.getElementById("playAgain");
    colorInput=document.getElementById("svgColor");
    div=document.getElementById("divTetris")
    startBtn.addEventListener("click", ()=>{ 
        document.getElementById("firstFC").style.display="none";
        div.style.display="initial";
        let colorFondo=colorInput.value;
        juego = new Juego(div, 30, colorFondo);
        loop();
        
    });
    otraVezbtn.addEventListener("click", ()=>{
        document.getElementById("gameOver").style.display="none";
        div.style.display="initial";
        let colorFondo=colorInput.value;
        juego = new Juego(div, 30, colorFondo);
        loop();
        
    });
};

function loop(){
    var intervalo=setInterval(()=>{
        if(juego.loop()){
            div.style.display="none";
            div.innerHTML="";
            document.getElementById("gameOver").style.display="flex";
            document.getElementById("lineasRotas").innerText="Lineas rotas: "+juego.lineasBorradas();
            clearInterval(intervalo);
        }
    },500);
}