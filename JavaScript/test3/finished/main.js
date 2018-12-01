const BALLS_COUNT = 25;
const BALL_SIZE_MIN = 10;
const BALL_SIZE_MAX = 20;
const BALL_SPEED_MAX = 7;

// 设定画布

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

var para = document.querySelector('p');
var number = 0;

// 生成随机数的函数

function random(min,max) {
  return Math.floor(Math.random()*(max-min)) + min;
}

// 生成随机颜色的函数

function randomColor() {
    return 'rgb(' +
           random(0, 255) + ', ' +
           random(0, 255) + ', ' +
           random(0, 255) + ')';
}

// 定义 Ball 构造器

function Shape(x, y, velX, velY, exists) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = exists;
}

function Ball(x, y, velX, velY, exists, color, size) {
    Shape.call(this, x, y, velX, velY, exists);

    this.color = color;
    this.size = size;
}
Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

function EvilCircle(x, y, velX, velY, exists) {
    Shape.call(this, x, y, 20, 20, exists);
    this.color = 'white';
    this.size = 10;
}
EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;

EvilCircle.prototype.draw = function() {
  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
}

EvilCircle.prototype.checkBounds = function() {
  if((this.x + this.size) >= width) {
    this.x -= 30;
  }

  if((this.x - this.size) <= 0) {
    this.x += 30;
  }

  if((this.y + this.size) >= height) {
    this.y -= 30;
  }

  if((this.y - this.size) <= 0) {
    this.y += 30;
  }
};

EvilCircle.prototype.setControls = function () {
    window.onkeydown = e => {
        if (e.key === 'a') {
          this.x -= this.velX;
        } else if (e.key === 'd') {
          this.x += this.velX;
        } else if (e.key === 'w') {
          this.y -= this.velY;
        } else if (e.key === 's') {
          this.y += this.velY;
        }
      };
}

EvilCircle.prototype.collisionDetect = function() {
  for(var j = 0; j < balls.length; j++) {
    if( balls[j].exists ) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].exists = false;
        number -= 1;
        para.textContent = '还剩' + number + '多少个球';
      }
    }
  }
};
// 定义绘制球的函数

Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};

// 定义更新球的函数

Ball.prototype.update = function() {
  if((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
};

// 定义碰撞检测函数

Ball.prototype.collisionDetect = function() {
  for(var j = 0; j < balls.length; j++) {
    if( ! (this === balls[j]) ) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color = randomColor();        
      }
    }
  }
};

// 定义一个数组来保存所有的球

var balls = [];

// 定义一个循环来不停地播放

var evilOne = new EvilCircle(100, 100, 20, 20, true);
evilOne.setControls();

function loop() {
  ctx.fillStyle = 'rgb(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);

  while(balls.length < BALLS_COUNT) {
    var size = random(BALL_SIZE_MIN, BALL_SIZE_MAX);
    var ball = new Ball(
      // 为避免绘制错误，球至少离画布边缘球本身一倍宽度的距离
      random(0 + size, width - size),
      random(0 + size, height - size),
      random(-BALL_SPEED_MAX, BALL_SPEED_MAX),
      random(-BALL_SPEED_MAX, BALL_SPEED_MAX),
      true,
      randomColor(),
      size
    );
    balls.push(ball);
    number += 1;
    para.textContent = '还剩' + number + '多少个球';
  }


  for(var i = 0; i < balls.length; i++) {
    if (balls[i].exists) {
        balls[i].draw();
        balls[i].update();
        balls[i].collisionDetect();
    }
  }

  evilOne.draw();
  evilOne.checkBounds();
  evilOne.collisionDetect();

  requestAnimationFrame(loop);
}

loop();