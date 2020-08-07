const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

let hit = new Audio();
let wall = new Audio();
let userScore = new Audio();
let aiScore = new Audio();

hit.src = "sounds/hit.mp3";
wall.src = "sounds/wall.mp3";
aiScore.src = "sounds/comScore.mp3";
userScore.src = "sounds/userScore.mp3";

const ball = {
  x:canvas.width/2,
  y:canvas.height/2,
  radius:15,
  xVelocity:5,
  yVelocity:5,
  color:"#ffc7c7",
  speed:7
}

const user = {
  x:0,
  y:200,
  height:100,
  width:20,
  score:0,
  color:"#ffc7c7"
}

const ai = {
  x:780,
  y:200,
  height:100,
  width:20,
  score:0,
  color:"#ffc7c7"
}

const net = {
  x:(canvas.width-2)/2,
  y:0,
  height:10,
  width:2,
  color:"#00adb5"
}

function drawRect(x,y,w,h,color){
  ctx.fillStyle=color;
  ctx.fillRect(x,y,w,h);
}

function drawBall(x,y,r,color){
  ctx.fillStyle=color;
  ctx.beginPath();
  ctx.arc(x,y,r,0,Math.PI*2,true);
  ctx.closePath();
  ctx.fill();
}

function drawNet(){
  for(let i=0;i<canvas.height;i+=15){
    drawRect(net.x,net.y+i,2,10,"#00adb5");
  }
}

function drawText(text,x,y){
  ctx.fillStyle="#ffc7c7";
  ctx.font = "80px Arial";
  ctx.fillText(text, x, y);
}

canvas.addEventListener("mousemove",getMousePos);

function getMousePos(evt){
  let rect = canvas.getBoundingClientRect();
  user.y = evt.clientY - rect.top - user.height/2;
}

function resetBall(){
  ball.x=canvas.width/2;
  ball.y=canvas.height/2;
  ball.xVelocity = -ball.xVelocity;
  ball.speed=7;
}

function collision(b,p){
  b.top = b.y - b.radius;
  b.right = b.x + b.radius;
  b.bottom = b.y + b.radius;
  b.left = b.x - b.radius;

  p.top = p.y;
  p.right = p.x + p.width;
  p.bottom = p.y + p.height;
  p.left = p.x;

  return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

function update(){
  if(ball.x-ball.radius < 0){
    aiScore.play();
    ai.score++;
    resetBall();
  }
  else if(ball.x+ball.radius > canvas.width){
    userScore.play();
    user.score++;
    resetBall();
  }

  ball.x += ball.xVelocity;
  ball.y += ball.yVelocity;

  ai.y += ((ball.y - (ai.y + ai.height/2)))*0.1;

  if(ball.y+ball.radius > canvas.height || ball.y-ball.radius < 0){
    wall.play();
    ball.yVelocity = -ball.yVelocity;
  }
    let player = (ball.x + ball.radius < canvas.width/2) ? user : ai;

  if(collision(ball,player)){

    hit.play();
    let collidpoint = (ball.y - (player.y + player.height/2));

    collidpoint = (collidpoint/(player.height/2));

    let angelRad = (Math.PI/4)*collidpoint;

    let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;

    ball.xVelocity = direction * ball.speed * Math.cos(angelRad);
    ball.yVelocity = ball.speed * Math.sin(angelRad);

    ball.speed += 0.1;
  }
}


function render(){

  drawRect(0,0,canvas.width,canvas.height,"#222831");

  drawNet();

  drawRect(user.x,user.y,user.width,user.height,"#ffc7c7");

  drawRect(ai.x,ai.y,ai.width,ai.height,"#ffc7c7");

  drawText(user.score,canvas.width/4,canvas.height/4);

  drawText(ai.score,3*canvas.width/4,canvas.height/4);

  drawBall(ball.x,ball.y,ball.radius,"#ffc7c7");
}

function game(){
  update();
  render();
}

let framePersec = 50;

let loop = setInterval(game,1000/framePersec);
