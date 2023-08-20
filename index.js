//refract the entire code into different files for classes and utils ||
// make the sprites after jump non glitchy for that use a separate change sprite function||
// correct the position of attack boxes ||
// make the animation of attacks seamless and non glithcy instead of playing the complete animation all over again||
// make the recieve hit animation||
// make the death animation ||
// improve the design for health bar and timer||
// upload on github||
// host on a free domain||

// add sound effects/vibration||
//make character selection possible
//do something about the players movine out of the canvas width
// make enemy AI
// playable on mobile devices
// include jest tests try to achieve max coverage
// add personalised comments
// understand the various CSS used here
// make it so that the characters turn towards each other when they cross one another
// refactor all files into different files

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 928
canvas.height = 751

c.fillRect(0, 0, canvas.width, canvas.height)


var sfx = {
  run: new Howl({
     src: [
        './sfx/Run_player.wav'
     ],
     rate: 1.9
  }),
  attack2: new Howl({
    src: [
      './sfx/Attack2.wav'
    ]
  }),
  attack1: new Howl({
    src:[
      './sfx/Attack-1.wav'
    ]
  }),
  jump: new Howl({
    src:[
      './sfx/jump.wav'
    ]
  }),
}


function runSfx()
{
  if(!sfx.run.playing())
  {
    sfx.run.play();
  }
}


const gravity = 0.7

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './img/background.png',
  music : {
    overworld: new Howl({
       src: [
          "./sfx/Background.mp3"
       ],
       volume: 0.2
    })
  }
})

const tower = new Sprite({
  position: {
    x: 600,
    y: 395
  },
  imageSrc: './img/RedMoonTower_free_idle_animation..png',
  scale: 2.3,
  framesMax: 11
})

const player = new Fighter({
  position: {
    x: 0,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
  },
  imageSrc: './img/Fantasy Warrior/Idle.png',
  framesMax: 8,
  scale: 3,
  offset: {
    x: 150,
    y: 150
  },
  sprites: {
    idle: {
      imageSrc: './img/Fantasy Warrior/Idle.png',
      framesMax: 10
    },
    run: {
      imageSrc: './img/Fantasy Warrior/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/Fantasy Warrior/jump.png',
      framesMax: 3
    },
    fall: {
      imageSrc: './img/Fantasy Warrior/Fall.png',
      framesMax: 3
    },
    attack1: {
      imageSrc: './img/Fantasy Warrior/Attack1.png',
      framesMax: 7
    },
    takeHit: {
      imageSrc: './img/Fantasy Warrior/Take hit.png',
      framesMax: 3
    },
    death: {
      imageSrc: './img/Fantasy Warrior/Death.png',
      framesMax: 7
    }  },
    
  attackBox: {
    offset: {
      x: 100 ,
      y: 50
    },
    width: 110,
    height: 40
  }
})

const enemy = new Fighter({
  position: {
    x: 400,
    y: 100
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'blue',
  offset: {
    x: -50,
    y: 0
  },
  scale: 2.5,
  offset: {
    x: 215,
    y: 264
  },
  sprites: {
    idle: {
      imageSrc: './img/EVil Wizard 2/Idle.png',
      framesMax: 8
    },
    run: {
      imageSrc: './img/EVil Wizard 2/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/EVil Wizard 2/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/EVil Wizard 2/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './img/EVil Wizard 2/Attack1.png',
      framesMax: 8
    },
    takeHit: {
      imageSrc: './img/EVil Wizard 2/Take hit.png',
      framesMax: 3
    },
    death: {
      imageSrc: './img/EVil Wizard 2/Death.png',
      framesMax: 7
    }
  },
  attackBox: {
    offset: {
      x: -200,
      y: 50
    },
    width: 200,
    height: 40
  }
})


const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  }
}

decreaseTimer()

function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  background.update()
  tower.update()
  c.fillStyle = 'rgba(255, 255, 255, 0.12)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  enemy.update()

  player.velocity.x = 0
  enemy.velocity.x = 0

  // player movement

  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -5
    player.switchSprite('run')
    runSfx();
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 5
    player.switchSprite('run')
    runSfx();
  } else {
    player.switchSprite('idle')
  }

  // jumping
  if (player.velocity.y < 0) {
    player.switchSprite('jump')
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall')
  }

  // Enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -5
    enemy.switchSprite('run')
    runSfx();
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 5
    enemy.switchSprite('run')
    runSfx();
  } else {
    enemy.switchSprite('idle')
  }

  // jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump')
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall')
  }

  // detect for collision & enemy gets hit
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takeHit()
    player.isAttacking = false

    gsap.to('#enemyHealth', {
      width: enemy.health + '%'
    })
  }

  // if player misses
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false
  }

  // this is where our player gets hit
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    player.takeHit()
    enemy.isAttacking = false

    gsap.to('#playerHealth', {
      width: player.health + '%'
    })
  }

  // if player misses
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false
  }

  // end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId })
  }
}

animate()

window.addEventListener('keydown', (event) => {
  if (!player.dead) {
    switch (event.key) {
      case 'd':
        keys.d.pressed = true
        player.lastKey = 'd'
        break
      case 'a':
        keys.a.pressed = true
        player.lastKey = 'a'
        break
      case 'w':
        player.velocity.y = -20
          sfx.jump.play();
        break
      case ' ':
        player.attack()
        break
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        enemy.lastKey = 'ArrowRight'
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        enemy.lastKey = 'ArrowLeft'
        break
      case 'ArrowUp':
        enemy.velocity.y = -20
          sfx.jump.play();
        break
      case 'ArrowDown':
        enemy.attack()

        break
    }
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
  }

  // enemy keys
  switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
  }
})

document.addEventListener("keydown",()=>{
  if(!background.music.overworld.playing())
  {
    background.music.overworld.play();
  }
})


document.addEventListener("w",()=>{
  if(!sfx.jump.playing())
  {
    sfx.jump.play();
  }
})

document.querySelector(".stop-music").addEventListener("click", () => {
   background.music.overworld.pause();
})