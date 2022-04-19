const FLOOR_HEIGHT = 48
const JUMP_FORCE = 800
const SPEED = 480
const MOVE_SPEED = 480

// 
canSecondJump = false



// initialize context
kaboom({
	background: [ 116, 185, 255 ],
})

// load assets
loadSprite("ferdi", "https://raw.githubusercontent.com/Barchid/les-aventures-de-casque-dor/master/sprites/ferdi.png")
loadSprite('felix', 'https://raw.githubusercontent.com/Barchid/les-aventures-de-casque-dor/master/sprites/felix.jpg')
// loadSprite('felix', 'https://raw.githubusercontent.com/Barchid/les-aventures-de-casque-dor/master/sprites/rami.png')

scene("intro0", () => {
	add([
		text("Les Aventures de Casque d'Or"),
		pos(width() / 2, height() / 2),
		origin("center"),
	])

    add([
		text("(Espace pour continuer, fdp)"),
		pos(width() / 2, height() / 1.2),
		origin("center"),
	])

    onKeyPress("space", () => go("intro1"))
})

scene("intro1", () => {
	add([
		text("Chapitre 1: de retour de l'ecole"),
		pos(width() / 2, height() / 2),
		origin("center"),
	])

    onKeyPress("space", () => go("intro2"))
})

scene("intro2", () => {
	add([
		text("En rentrant chez lui, MC Casque d'Or\n(FDP, en abrege) ne se doutait pas\nqu'il devra faire face aux membres du\nSouverain Gang\n\n(en vrai il y en a un seul parce que\nj'avais la flemme de tous vous coder)."),
		pos(0 + width() / 20, 0 + height()/3),
		origin("left"),
	])

    onKeyPress("space", () => go("intro3"))
})

scene("intro3", () => {
	add([
		text("Dans son periple, FDP rencontra d'abord\nVliegen qui echangeait des snaps\n\n-'Que fais-tu, mon ami ?', dit FDP\n\nVliegen lui expliqua qu'il etait en\npleine etude de marche pour trouver\nla pute la moins chere de Bx.\n\nAyant finalement trouve la legendaire\npute Lidl, Vliegen a maintenant besoin\nde 50 balles."),
		pos(0 + width() / 20, 0 + height()/2),
		origin("left"),
	])

    onKeyPress("space", () => go("intro4"))
})

scene("intro4", () => {
	add([
		text("Vous avez vraiment envie d'aider !\n\nRamassez un max de billets de 10 euros\npour aider Vliegen a completer sa\nlevee de fonds."),
		pos(0 + width() / 20, 0 + height()/2),
		origin("left"),
	])

    onKeyPress("space", () => go("intro5"))
})

scene("intro5", () => {
	add([
		text("Appuyez sur Espace pour sauter\n(double saut possible)\n\n GO ?! Espace et commencer"),
		pos(0 + width() / 20, 0 + height()/2),
		origin("left"),
	])

    onKeyPress("space", () => go("game"))
})

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
		color(107, 62, 46),
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
			color(46, 204, 113),
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
		addKaboom(player.pos)
	})

	// keep track of score
	let score = 0

	const scoreLabel = add([
		text(score),
		pos(24, 24),
	])

    function spawnCoins() {

		// add coin obj
		add([
			sprite('felix'),
			area(),
			outline(4),
            scale(2),
			pos(width(), height() - FLOOR_HEIGHT - 150 - randi(0, 50)),
			origin("botleft"),
			move(LEFT, SPEED),
			cleanup(),
			"felix",
		])

		// wait a random amount of time to spawn next tree
		wait(rand(0.5, 4), spawnCoins)

	}

    spawnCoins()

    player.onCollide("felix", (c) => {
		destroy(c)
        score += 1
        scoreLabel.text = score
	})

	// increment score every frame
	onUpdate(() => {
		scoreLabel.text = score
	})

})

scene("lose", (score) => {

	add([
		sprite("ferdi"),
		pos(width() / 2, height() / 2 - 160),
		scale(2),
		origin("center"),
	])

	// display score
	add([
		text(score + ' billets recuperes soit\n' + score/5 + ' putes Lidl baisees.\n\nEspace pour recommencer.'),
		pos(width() / 2, height() / 2 + 80),
		origin("center"),
	])

	// go back to game with space is pressed
	onKeyPress("space", () => go("game"))
	onClick(() => go("game"))

})

go("intro0")
