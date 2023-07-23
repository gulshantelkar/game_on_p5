
const windowWidth = 600;
const windowHeight = 400;

const rows = 6;
const cols = 6;


let rightDown = false;
let leftDown = false;
let alive = true;

const brickWidth = Math.round(windowWidth / cols - 4);
const brickHeight = Math.round((windowHeight * 1/3) / rows - 10);


let bricks = [];
let score = 0;
let lives = 2;
let livesRestart = false
 
let paddle = {
  x: windowWidth / 2 - 50,
  y: windowHeight - 15,
  width: 100,
  height: 10
}


let ball = {
  x: paddle.x - 25,
  y: paddle.y - 50,
  speedX: 6,
  speedY: 6,
  diameter: 15,
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  generateBricks();  
}


function generateBricks() {
  for(let i = 0; i < rows; i++) {
    for(let j = 0; j < cols; j++) {
      let brickData = {
        x: j * (brickWidth + 2) + 10,
        y: i * (brickHeight + 2) + 30,
        width: brickWidth,
        height: brickHeight
      }
      bricks.push(brickData);
    }
  }
}


function drawBricks() {
  bricks.forEach(brick => {
    fill('red');
    rect(brick.x, brick.y, brick.width, brick.height);
    noStroke();
  });
}


function keyPressed() {
  if(keyCode === RIGHT_ARROW) {
    rightDown = true;
  }
  if(keyCode === LEFT_ARROW) {
    leftDown = true;
  }
  if(keyCode === 32 && livesRestart) {
    livesRestart = false;
     ball.x = paddle.x - 25;
    ball.y = paddle.y - 50;
  }
 
  if(keyCode === 32 && !alive) {
    alive = true;
    paddle.x = windowWidth / 2 - 50,
    ball.x = paddle.x - 25,
    ball.y = paddle.y - 50,
    ball.speedX = 6;
    ball.speedY = 6;
    bricks.splice(0, bricks.length);    
    score = 0;
     lives = 3;
    generateBricks();
  }
}


function keyReleased() {
  if(keyCode === RIGHT_ARROW) {
    rightDown = false;
  }
  if(keyCode === LEFT_ARROW) {
    leftDown = false;
  }
}

function drawPaddle() {
  fill('green');
  rect(paddle.x, paddle.y, paddle.width, paddle.height);
  if(rightDown && paddle.x + paddle.width < windowWidth) {
    paddle.x += 10;
  }
  if(leftDown && paddle.x > 0) {
    paddle.x -= 10;
  }
}


function drawBall() {
  fill('white');
  circle(ball.x, ball.y, ball.diameter);
  // Collision on top of the screen
  if(ball.y - ball.diameter / 2 <= 0) {
    ball.speedY = -ball.speedY;
  }
  // Collision on the bottom of the screen.
  if(ball.y + ball.diameter / 2 >= windowHeight) {
    lives--;
    livesRestart = true;
    if(lives==0){
       alive = false; 
    }
      
  }
  // Collision on the left and right of the screen.
  if(ball.x - ball.diameter / 2 <= 0  || ball.x + ball.diameter / 2 >= windowWidth) {
    ball.speedX = -ball.speedX;
  }
  // Paddle collision for first half.
  if(ball.y + ball.diameter / 2 >= paddle.y && ball.x >= paddle.x && ball.x < paddle.x + paddle.width / 2) {
    ball.speedY = -ball.speedY;
    if(ball.speedX > 0) {
      ball.speedX = -ball.speedX;
    }    
  }

  if(ball.y + ball.diameter / 2 >= paddle.y && ball.x >= paddle.x + paddle.width / 2 && ball.x < paddle.x + paddle.width) {
    ball.speedY = -ball.speedY;
    if(ball.speedX < 0) {
      ball.speedX = -ball.speedX;
    }    
  }

  // Brick collision.
  bricks.forEach((brick, index) => {
    if(ball.y - ball.diameter / 2 <= brick.y + brick.height && ball.x > brick.x && ball.x <= brick.x + brick.width) {
      ball.speedY = -ball.speedY;
      bricks.splice(index, 1);
      score++;
      if(bricks.length === 0) alive = false;
    }
  }); 

  ball.x += ball.speedX;
  ball.y += ball.speedY;
}

function restartGame() {
  fill('#FFEEEE')
  textAlign(CENTER);
  noStroke()
  textStyle(BOLD);
  textFont('Arial');
  textSize(38)
  text('GAME OVER', 300, 170)
  textFont('Arial');
  textSize(28);
  text('Final score: ' + score, 300, 200);
  textSize(18);
  text('Press SpaceBar to restart game', 300, 225);
}

function lostLifeText() {
  fill('#FFEEEE')
  textAlign(CENTER);
  noStroke()
  textStyle(BOLD);
  textFont('Arial');
  textSize(36)
  text('Life Lost', 300, 170)
  textFont('Arial');
  textSize(24);
  text('You now have ' + lives + ' lives remaining', 300, 200);
  textSize(18);
  text('Press SpaceBar to restart', 300, 225);
}

function livesText() {
  textStyle(BOLD);
  textAlign(CENTER);
  noStroke()
  textFont('Arial');
  textSize(18);
  text('Lives: ' + lives, 40, 20);
}

function displayScore() {
  fill("white");
  textAlign(CENTER);
  textSize(20)
  text(`Score: ${score}`, windowWidth / 2, 22);
   
}


function endScreen(message) {
  fill('white');
  textAlign(CENTER);
  textSize(38);
  text(message, 300, 170);
  // text('Press Spacebar To Restart Game', 300, 225);
  // text(`Score: ${score}`, 300, 280);

}

function draw() {
  background("black");
  // If the player broke all the bricks, they win.
  if(bricks.length === 0) {
    endScreen("You Win!");
  }
  if(!alive && bricks.length != 0) endScreen("GAME OVER");
   if (alive && !livesRestart) drawBall();
   if (livesRestart && alive) lostLifeText();
   if (!alive && livesRestart) restartGame();

  
  
  if(alive) {
    drawBricks();
    livesText();
    drawPaddle();
    
    displayScore();
  }
}