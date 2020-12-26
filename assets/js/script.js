const canvas = document.getElementById('pingpong');
const context = canvas.getContext("2d");

document.body.style.display="flex";
document.body.style.justifyContent="center";

let keysPress={};
var scoreEnemy=0;
var scorePlayer=0;
let gameSpeed;
let paddlePlayer
let ball;
let paddleEnemy;
var gameOver=0;

//to control key event
document.addEventListener('keydown',function(event){
    keysPress[event.code] = true;

});
document.addEventListener('keyup',function(event){
    keysPress[event.code]=false;
});

// to draw background
function drawBackground(color){    
    context.beginPath();
    context.fillStyle=color;
    context.fillRect(0,0,canvas.width,canvas.height);
    context.closePath();
}
// to draw ball, move the ball and check condition when ball collision 
function drawBall(x,y,radius,color){
    return {
        x:x,
        y:y,
        r:radius,
        c:color,
        dy:-gameSpeed,
        dx:gameSpeed,
        update:function(){
            this.draw();
           
            if(this.x + this.dx > canvas.width-this.r || this.x + this.dx < this.r) {
        
                this.dx = -this.dx;
                this.x = canvas.width/2
                if(this.dx==-3){
                    scorePlayer++;
                }
                else if (this.dx==3){
                    scoreEnemy++;
                }              
            }
            if(this.y + this.dy > canvas.height-this.r || this.y + this.dy < this.r) {
                this.dy = -this.dy;
            }
            
            this.x += this.dx;
            this.y += this.dy;

        },
        // to change the ball position when is collision
        updateRightUp:function(){
            this.draw();
            this.x+=this.dx;
            this.y+=this.dy;
        },
        updateRightDown:function(){
            this.draw();
            this.x+=this.dx;
            this.y-=this.dy;
        },
        updateLeftUp:function(){
            this.draw();
            this.x-=this.dx;
            this.y+=this.dy;
            
        },
        updateLeftDown:function(){
            this.draw();
            this.x-=this.dx;
            this.y-=this.dy;
           
        },
        draw:function(){
            context.beginPath();
            context.arc(this.x, this.y, this.r,0,Math.PI*2);
            context.fillStyle=this.c;
            context.fill();
            context.closePath();
        }
    }
}
// to display score
function drawScore(score,x,y) {
    context.font = "16px Arial";
    context.fillStyle = "white";
    context.fillText("Score: "+score, x, y);
}
//to assign font 
function assignFont(){
    context.font='16px sans-serif';
    context.fillStyle='white';
    context.textAlign='center';
    context.fillText("Welcome to our game", 350,50);
    context.fillText("Press ' Space Key ' to Start the Game", 350,100);
    context.fillText("Press more space to increase ball speed ", 350,130);
    context.fillText("Increase speed to make lose rate higher if not touch more space u will always win", 350,160);
}

//condition when ball touch paddle
function isCollisionPaddlePlayer(){
    return (ball.x+ball.r>paddlePlayer.x&&
    paddlePlayer.x+paddlePlayer.w>ball.x&&
    ball.y+ball.r>paddlePlayer.y&&
    paddlePlayer.y+paddlePlayer.h>ball.y);
}
function isCollisionPaddleEnemy(){
    return (ball.x+ball.r>paddleEnemy.x&&
        paddleEnemy.x+paddleEnemy.w>ball.x&&
        ball.y+ball.r>paddleEnemy.y&&
        paddleEnemy.y+paddleEnemy.h>ball.y);
}
//draw paddle of player
function drawPlayer(x,y,width,height,color){
    return{
        x:x,
        y:y,
        w:width,
        h:height,
        c:color,
        s:3,
        ground:false,
        //check update movement player
        update:function(){
            if(keysPress['ArrowUp']||keysPress['KeyW']){
                this.y -=this.s+Math.floor(Math.random()*10);
            }
            if(keysPress['ArrowDown']||keysPress['KeyS']){
                this.y+=this.s+Math.floor(Math.random()*10);
            }
            if(this.y<0){
                this.y=0;
            }
            else if(this.y+this.h>canvas.height){
                this.y = canvas.height-this.h;
            }
            this.draw();
        },
        draw:function(){
            context.beginPath();
            context.fillStyle=this.c;
            context.fillRect(this.x,this.y,this.w,this.h);
            context.closePath();
        }
    }
}
//draw paddle of enemy
function drawEnemy(x,y,width,height,color){
    return{
        x:x,
        y:y,
        w:width,
        h:height,
        s:15,
        groud:false,
        update:function(){
            this.draw();
            if(!this.ground){
                this.y+=this.s;
                this.hitBottom();
            }else{
                this.y-=this.s;
                this.hitTop();
            }
        },
        hitBottom:function(){
            let borderBottom = canvas.height-this.h;
            if(this.y>borderBottom){
                this.ground=true;
                this.y+=this.s;
                this.s=5;
            }
        },
        hitTop:function(){
            if(this.y<0){
                this.ground=false;
                this.y=0;
                this.s=5;
            }
        },
        draw:function(){
            context.beginPath();
            context.fillStyle=color;
            context.fillRect(this.x,this.y,this.w,this.h);
            context.closePath();
        }
    }
}

function updateGame(){
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground("black");
    ball.update();
    if(isCollisionPaddlePlayer()){
        ball.x=30;
        ball.dx=-ball.dx;
    }
    if(isCollisionPaddleEnemy()){
            ball.x = canvas.width-30;
            ball.dx=-ball.dx
    }
    paddlePlayer.update();
    paddleEnemy.update();
    //to check win and lose and to restart game again
    if(scoreEnemy==3){
        gameOver=1;
        alert("You lose!");
        gameOver=0;
        scoreEnemy=0;
        scorePlayer=0;
       
    }
    if(scorePlayer==3){
        gameOver=1;
        alert("You win!");
        gameOver=0
        scoreEnemy=0;
        scorePlayer=0;
        
    }
    if(gameOver==0){
        requestAnimationFrame(updateGame);
    }
    drawScore(scoreEnemy,620,20);
    drawScore(scorePlayer,80,20);

}
// to render the game or to start the game
function render(){
    canvas.width=700;
    canvas.height =400;
    gameSpeed=3;
    ball =drawBall(canvas.width/2,canvas.height/2,10,"#FFFFFF");
    paddlePlayer = drawPlayer(0,0,15,100,"#F70D1A");
    paddleEnemy = drawEnemy(canvas.width-15,0,15,100,"#CC6600");
    requestAnimationFrame(updateGame);

}
//to display font or description
window.addEventListener("load",function(){
    canvas.width=700;
    canvas.height=400;
    drawBackground("black");
    assignFont();
})
//to check allow play click space key befare game start
document.addEventListener('keyup', event => {
    if (event.code === 'Space') {
        render();
    }
})