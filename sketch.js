var pontos2 = 0
var contador = 0
var contador1 = 0;
var ponto
var morte,pulo,check
var gameover,restart
var gpNuv,gpCac,gpPas
var pass,passImg,passColl
var demo
var cac1,cac2,cac3,cac4,cac5,cac6
var nuvem,nuvemImg
var solo,soloImagem,soloInv;
let hora;
var troca = "dia"
var modo = "play";
var trex ,trex_running,trex_collided,trexnight,trexnight_running,trexnight_ducking,trexnight_collided;
function preload(){

  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_ducking = loadAnimation("trex5.png","trex6.png");
  trex_collided = loadAnimation("trex_collided.png")
  trexnight_running = loadAnimation("trexnight.png","trexnight4.png","trexnight5.png");
  trexnight_ducking = loadAnimation("trexnight2.png","trexnight3.png");
  trexnight_collided = loadAnimation("trexnight6.png");

  soloImagem = loadImage ("ground2.png");
  nuvemImg = loadImage ("cloud.png");
  
  cac1 = loadImage ("obstacle1.png");
  cac2 = loadImage ("obstacle2.png");
  cac3 = loadImage ("obstacle3.png");
  cac4 = loadImage ("obstacle4.png");
  cac5 = loadImage ("obstacle5.png");
  cac6 = loadImage ("obstacle6.png");
  
  passImg = loadAnimation ("passaro.png","passaro2.png","passaro.png");
  passColl = loadAnimation("passaro.png");

  gameover = loadImage("gameOver.png");
  restart = loadImage("restart.png");

  morte = loadSound("die.mp3");
  pulo = loadSound("jump.mp3");
  check = loadSound("checkPoint.mp3");

  
}

function setup(){
  createCanvas(900,200)
  gpCac = new Group()
  gpNuv = new Group()
  gpPas = new Group()
  //crie um sprite de trex
  trex = createSprite(50,100,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("ducking",trex_ducking);
  trex.addAnimation("collided",trex_collided);
  trex.addAnimation("night_running",trexnight_running);
  trex.addAnimation("night_ducking",trexnight_ducking);
  trex.addAnimation("night_collided",trexnight_collided);
  //trex.scale = 0.6;
  trex.setCollider("circle",0,0,40);
  trex.debug = false

  
  solo = createSprite(300,150);
  solo.addImage("solo",soloImagem);
  soloInv = createSprite(300,160,600,15);
  soloInv.visible = false;

  overgame = createSprite(500,50)
  overgame.addImage("acabou",gameover);
  overgame.visible = false
  
  startre = createSprite(500,100)
  startre.addImage("recomeco",restart)
  startre.scale = 0.6
  startre.visible = false

  ponto = 0
  tempo = World.seconds
  
  pass = createSprite(1000,50)
  pass.addAnimation("passaro",passImg);
  pass.addAnimation("colidido",passColl)

  
  
}

function draw(){
  hora = hour();

  trex.velocityY += 0.3;
  trex.collide(soloInv);
  
  background("white"); 
  drawSprites();



//modo = play
  if (modo=="play"){

 //reiniciar solo
  if (solo.x<0){
    solo.x=solo.width/2;
  }  

  if(contador==0){
    cacto = createSprite(1000,130,50,50);
    cacto.velocityX = -4
    cacto.addImage(cac1);
    gpCac.add(cacto)
    contador=1;
  }

 //contagem pontos
  if (frameCount%60==0){
    ponto = ponto + 50 
  } 

//som checkpoint
      if (ponto%1000==0){
        if (ponto>0){
          check.play()
          ponto=ponto+50
      }
    }

    // texto da pontuação
  strokeWeight(1);
  stroke(rgb(46,46,46));
  fill(rgb(51,51,51));
  textSize (20)
  text ("SCORE: "+ponto,760,20) ;

  //velocidade solo
  solo.velocityX = cacto.velocityX;
  
  // criar grupos
  criarNuvem ()
  criarCacto ()
  criarPassaro()
  
  // trex noite ou dia
  if (hora>6 && hora <20){
     trex.changeAnimation("running")  
     troca = "dia"

  if (keyDown("down")){
    trex.changeAnimation("ducking")
    trex.scale = 0.4
    trex.y = trex.y + 5
  }
    else{
    trex.changeAnimation("running")  
    trex.scale = 0.6
  }
       
    }


    else{

trex.changeAnimation("night_running");  

troca = "noite";

    
if (keyDown("down")){
  trex.changeAnimation("night_ducking")
  trex.scale = 0.4
  trex.y = trex.y + 5
}
  else{
  trex.changeAnimation("night_running")  
  trex.scale = 0.6
}

    }

    

  // morte

  if (trex.isTouching(gpCac) || trex.isTouching(gpPas)){
  modo = "gameover"  
  morte.play()

}
  
//trex pula 

  if (keyDown("SPACE")){ 
  
    if (trex.y>=124){ 
    pulo.play()
    trex.velocityY = -8;
     }   
  }

} // fim modo = play


// modo = gameover
  if (modo=="gameover"){
  trex.velocityY = 0
  solo.velocityX = 0
  gpCac.setVelocityXEach(0);
  gpNuv.setVelocityXEach(0);
  gpPas.setVelocityXEach(0);

  if(troca=="noite"){
    trex.changeAnimation("night_collided");
  }
  else{
    trex.changeAnimation("collided");
  }
  
  trex.scale = 0.6
  if(pass){
    pass.changeAnimation("colidido");
  }
  
  gpCac.setLifetimeEach(-1)
  gpNuv.setLifetimeEach(-1)
  gpPas.setLifetimeEach(-1)
  
  overgame.visible = true
  startre.visible = true
 
  if (mousePressedOver(startre)){
  modo="play"
  gpCac.setVelocityXEach(0);
  gpCac.destroyEach();
  gpNuv.destroyEach();
  gpPas.destroyEach();  
  startre.visible=false
  overgame.visible=false
  ponto=0

  
  contador=0;

} 
}
}

function criarNuvem()
{

if (frameCount%80==0){ 
  nuvem = createSprite(-70,50,50,50);
  nuvem.addImage("nuvem",nuvemImg)
  nuvem.velocityX = 3
  nuvem.y = Math.round(random(40,60));   
  nuvem.depth = 1 

  trex.depth = 3 

  nuvem.lifetime = 250
  gpNuv.add (nuvem)
  }
  }
  function criarCacto(){
  if (cacto.x<=450){  
  
  cacto = createSprite(1000,130,50,50);

  if (contador1==0){
  cacto.velocityX = -4
  contador1=1
}
  else{
  cacto.velocityX = -4 + (ponto/500)
}


  demo = Math.round(random(1,6));
  switch (demo){
  case 1:cacto.addImage (cac1); 
  break
  case 2:cacto.addImage (cac2);
  cacto.scale = 0.7
  break
  case 3:cacto.addImage (cac3);
  cacto.scale = 0.6
  break
  case 4:cacto.addImage (cac4);
  cacto.scale = 0.6
  break
  case 5:cacto.addImage (cac5);
  cacto.scale = 0.6
  break
  case 6:cacto.addImage (cac6);
  cacto.scale = 0.55
  break
  default:break
}  
  
cacto.debug = false
cacto.lifetime = 500
gpCac.add (cacto)
}
}
function criarPassaro(){
  
  if (frameCount%400==0){ 
  
  pass = createSprite(1000,50)
  pass.addAnimation("passaro",passImg);
  pass.scale = 0.85
  pass.velocityX = -0
  pass.setCollider("rectangle",0,0,60,40)
  pass.debug = false
  pass.lifetime = 250
  gpPas.add (pass)
  pass.addAnimation("colidido",passColl)
  pass.depth = 2
}
}
var modo = "play"
