const FLOOR_HEIGHT = 48
const JUMP_FORCE = 800
const SPEED = 480

// 
canSecondJump = false

// initialize context
kaboom()

// load assets
loadSprite("ferdi", "https://raw.githubusercontent.com/replit/kaboom/master/assets/sprites/bean.png")
loadSprite('felix', 'https://raw.githubusercontent.com/replit/kaboom/master/assets/sprites/coin.png')

scene("game", () => {

	// define gravity
	gravity(2400)

	// add a game object to screen
	const player = add([
		// list of components
		sprite("ferdi"),
		pos(80, 40),
		area(),
		body(),
	])

	// floor
	add([
		rect(width(), FLOOR_HEIGHT),
		outline(4),
		pos(0, height()),
		origin("botleft"),
		area(),
		solid(),
		color(127, 200, 255),
	])

	function jump() {
		if (player.isGrounded()) {
			player.jump(JUMP_FORCE)
            canSecondJump = true
		}
        else if (canSecondJump){
            player.jump(JUMP_FORCE * 0.75)
            canSecondJump = false
        }
	}

    player.onGround(() => {
        canSecondJump = false
    })

	// jump when user press space
	onKeyPress("space", jump)
	onClick(jump)

	function spawnTree() {

		// add tree obj
		add([
			rect(48, rand(32, 96)),
			area(),
			outline(4),
			pos(width(), height() - FLOOR_HEIGHT),
			origin("botleft"),
			color(255, 180, 255),
			move(LEFT, SPEED),
			cleanup(),
			"tree",
		])

		// wait a random amount of time to spawn next tree
		wait(rand(0.5, 1.5), spawnTree)

	}

	// start spawning trees
	spawnTree()

	// lose if player collides with any game obj with tag "tree"
	player.onCollide("tree", () => {
		// go to "lose" scene and pass the score
		go("lose", score)
		burp()
		addKaboom(player.pos)
	})

	// keep track of score
	let score = 0

	const scoreLabel = add([
		text(score),
		pos(24, 24),
	])

	// increment score every frame
	onUpdate(() => {
		score++
		scoreLabel.text = score
	})

})

scene("lose", (score) => {

	add([
		sprite("ferdi"),
		pos(width() / 2, height() / 2 - 80),
		scale(2),
		origin("center"),
	])

	// display score
	add([
		text(score),
		pos(width() / 2, height() / 2 + 80),
		scale(2),
		origin("center"),
	])

	// go back to game with space is pressed
	onKeyPress("space", () => go("game"))
	onClick(() => go("game"))

})

go("game")