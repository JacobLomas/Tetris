import{Pieza, Tetris, Juego} from "./clasesTetrisSVG.js";

var spoty,svg, startBtn, juego, colorInput, otraVezbtn;
window.onload=function(){
    spoty=document.getElementById("spoty");
    startBtn=document.getElementById("start");
    otraVezbtn=document.getElementById("playAgain");
    colorInput=document.getElementById("svgColor");
    svg=document.getElementsByTagNameNS("http://www.w3.org/2000/svg","svg")[0];
    startBtn.addEventListener("click", ()=>{ 
        document.getElementById("firstFC").style.display="none";
        spoty.style.display="initial";
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
            document.getElementById("lineasRotas").innerText="Lineas rotas: "+juego.lineasBorradas();
            clearInterval(intervalo);
        }
    },500);
}