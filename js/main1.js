//creation des variables
var scene_origine;
let cursors;
var button_p;
var button_o;
let posx=25;
let posy=230;
let plus_bombe=false;
var plateforme_mobile;
var plateforme_mouvement;
var nuage_plateforme;
var nuage_mouvement;
let mario;
let bombe;
let mario_mort=false;
let fin=false;
let pause=false;
let image_game_over;
let image_game_paused;
let score=0;
let text;
let text2;
let pieces;
var levier;
var porte;
let les_sols;
let les_sols2;
var les_murs;
let sound_fin;
let sound_saut;
let sound_piece;
var sound_porte;
let piecesenplus=false;
var decompte=0;

//scene principale A
class SceneDepart extends Phaser.Scene{
    constructor (){
        super({ key: 'SceneDepart' });
	}

	preload(){
	//chargement des images en mémoire
	this.load.image('image_plateforme_mobile','assets/platform2.png');
	this.load.image('image_nuage_plateforme','assets/nuage_plateforme.png');
	this.load.image('image_sol', 'assets/platform2.png');
	this.load.image('image_mario_droite','assets/mario_droite.png');
	this.load.image('image_mario_gauche','assets/mario_gauche.png');
	this.load.image('image_bombe_droite','assets/bombe_droite.png');
	this.load.image('image_bombe_gauche','assets/bombe_gauche.png');
    this.load.image('piece', 'assets/piece.png');
	this.load.image("image_levier","assets/levier.png");
	this.load.image('image_porte','assets/porte.png');
	this.load.image('image_game_over','assets/game_over.png');
	this.load.image('image_paused','assets/paused.png');
	//chargement des sons en mémoire
	this.load.audio('bruit_game_over','assets/game-over.wav');
	this.load.audio('bruit_saut','assets/saut.wav');
	this.load.audio('bruit_piece','assets/coin.mp3');
	this.load.audio('bruit_tuyau','assets/tuyau.wav');
	this.load.audio('bruit_porte','assets/door.mp3');
	}
		
	create(){
		decompte=70;
		this.events.on('pause', () =>{console.log('Scene Depart paused');});
		this.events.on('resume', () =>{console.log('Scene Depart resumed');});
		//creation des décors
		les_sols = this.physics.add.staticGroup();
		les_sols.create(140, 600, 'image_sol').setScale(2).refreshBody();
		les_sols.create(400, 600, 'image_sol').setScale(2).refreshBody();
		les_sols.create(660, 600, 'image_sol').setScale(2).refreshBody();
		les_sols.create(920, 600, 'image_sol').setScale(2).refreshBody();
		les_sols.create(560, 440, 'image_sol').setScale(1.5).refreshBody();
		les_sols.create(750, 280, 'image_sol').setScale(1.5).refreshBody();
		plateforme_mobile=this.physics.add.sprite(200,350,"image_plateforme_mobile").setScale(1.5);
		plateforme_mobile.body.allowGravity = false;
		plateforme_mobile.body.immovable = true;
		plateforme_mouvement = this.tweens.add({
			targets: [plateforme_mobile],  // on applique le tween sur platefprme_mobile
			paused: true, // de base le tween est en pause
			ease: "Linear",  // concerne la vitesse de mouvement : linéaire ici 
			duration: 2000,  // durée de l'animation pour monter 
			yoyo: true,   // mode yoyo : une fois terminé on "rembobine" le déplacement 
			y: "-=200",   // on va déplacer la plateforme de 300 pixel vers le haut par rapport a sa position
			delay: 0,     // délai avant le début du tween une fois ce dernier activé
			hold: 1000,   // délai avant le yoyo : temps qeu al plate-forme reste en haut
			repeatDelay: 1000, // deléi avant la répétition : temps que la plate-forme reste en bas
			repeat: -1 // répétition infinie 
			});
  		nuage_plateforme=this.physics.add.sprite(350,80,"image_nuage_plateforme").setScale(1.5);
		nuage_plateforme.body.allowGravity = false;
		nuage_plateforme.body.immovable = true;
		nuage_mouvement = this.tweens.add({
			targets: [nuage_plateforme],  // on applique le tween sur platefprme_mobile
			paused: false, // de base le tween est en pause
			ease: "Linear",  // concerne la vitesse de mouvement : linéaire ici 
			duration: 5000,  // durée de l'animation pour monter 
			yoyo: true,   // mode yoyo : une fois terminé on "rembobine" le déplacement 
			x: "+=650",   // on va déplacer la plateforme de 300 pixel vers le haut par rapport a sa position
			delay: 0,     // délai avant le début du tween une fois ce dernier activé
			hold: 1000,   // délai avant le yoyo : temps qeu al plate-forme reste en haut
			repeatDelay: 2000, // deléi avant la répétition : temps que la plate-forme reste en bas
			repeat: -1 // répétition infinie 
		});
		levier = this.physics.add.staticSprite(560, 370, "image_levier").setScale(1.5).refreshBody();
		levier.active = false;
		porte = this.physics.add.staticSprite(975, 520, "image_porte").setScale(2.5).refreshBody();
		image_game_over=this.add.image(500, 310, 'image_game_over');
		image_game_over.setScale(4)
		image_game_over.visible=false;
		// création des sprites
		mario = this.physics.add.sprite(25, 450, 'image_mario_droite').setScale(2); //cree le sprite mario
		mario.setCollideWorldBounds(true); //mario percoit les bords
		mario.setOrigin (0.5,0.5); //on le gere par son nombril et pas par son oreille gauche
		this.physics.add.collider(mario, les_sols);
		this.physics.add.collider(mario, plateforme_mobile);
		bombe = this.physics.add.sprite(850, 200, 'image_bombe_gauche').setScale(2.5); // cree une bombe
		bombe.setCollideWorldBounds(true); //bombe percoit les bords
		this.physics.add.collider(bombe, les_sols);
		this.physics.add.collider(mario, bombe, this.explosion); //si collision entre mario et bombe appelle collision
		//création des pieces
		pieces = this.physics.add.staticGroup({
			key: 'piece',
			repeat: 2,
			setXY: { x: 150, y: 400, stepX: 50 }
		});
		pieces.create(750, 150, 'piece');
		pieces.create(800, 150, 'piece');
		this.physics.add.overlap(mario, pieces, this.collectPiece, null, this);
		//création des sons
		sound_fin = this.sound.add('bruit_game_over');
		sound_saut = this.sound.add('bruit_saut');
		sound_piece = this.sound.add('bruit_piece');
		sound_porte = this.sound.add('bruit_porte');
		//création des touches
		cursors = this.input.keyboard.createCursorKeys();
		button_p = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
		//affichage du score
		text = this.add.text(32, 20, 'score: '+ score, { fontFamily: 'Arial, Georgia, "Goudy Bookletter 1911", Times, serif', fontSize: '32px', fill: '#fff' });
	}

	update(){
		//quand mario est mort
		if (mario_mort) {
			mario.angle=mario.angle+1;
			if (button_p.isDown){ //si on appuie sur a touche P
				plus_bombe=false;
				mario_mort=false;
				piecesenplus=false;
				fin=false;
				score=0;
				this.scene.restart(); //recharge la scene
			}
			if (mario.angle>-3 && mario.angle<0){
				mario.destroy();
				fin=true;
			}
		}
		else{// quand mario est vivant
			if (button_p.isDown){ //si on appuie sur a touche P
				this.scene.pause();
				scene_origine='SceneDepart';
				this.scene.launch('ScenePause');
			}
			else {
				//vérifier si le joueur appuie sur des touches
				if (cursors.up.isDown && mario.body.touching.down){ // body.touching necessaire sinon peut monter meme si deja en l'air
					sound_saut.volume=0.3;
					sound_saut.play();
					mario.setVelocityY(-330);
					//parrondi2=mario.y;
					//this.text.setText("y:"+arrondi2.toFixed(2));
				}
				if (cursors.left.isDown){
					mario.setVelocityX(-160);
					mario.setTexture('image_mario_gauche');
				}
				else if (cursors.right.isDown){
					mario.setVelocityX(160);
					mario.setTexture('image_mario_droite');
				}
				else {
					mario.setVelocityX(0);
				}
				//orienter la bombe
				if (!plus_bombe){
					if (bombe.x>mario.x){
						bombe.setVelocityX(-50);
						bombe.setTexture('image_bombe_gauche');		
					}
					else if (bombe.x<mario.x){
						bombe.setVelocityX(50);
						bombe.setTexture('image_bombe_droite');
					}
				}
				// activation du levier : on est dessus et on appuie sur espace
				if (Phaser.Input.Keyboard.JustDown(cursors.space) && this.physics.overlap(mario,levier)) {
					if (levier.active == true) {// si le levier etait activé, on le désactive et stoppe la plateforme
						levier.active = false; // on désactive le levier
						levier.flipX = false; // permet d'inverser l'image
						plateforme_mouvement.pause();  // on stoppe le tween
					}
					// sinon :  on l'active et stoppe la plateforme
					else {// sinon :  on l'active et stoppe la plateforme
						levier.active = true; // on active le levier 
						levier.flipX = true; // on tourne l'image du levier
						plateforme_mouvement.resume();  // on relance le tween
						if (!piecesenplus){
							pieces.create(180, 80, 'piece');
							pieces.create(230, 80, 'piece');
							piecesenplus=true;
						}
					}
				}
				//si pousse porte
				if (this.physics.overlap(mario,porte) && cursors.right.isDown) {
					decompte=decompte-1;
					if (decompte<0) {
						sound_porte.volume=0.3;
						sound_porte.play();
					this.scene.start("SceneGlace");
					}
				}
				//console.log(mario.x);
			}
		}
	}

	//fonction à éxécuter si mario touche la bombe
	explosion(){
		bombe.setScale(2);
		image_game_over.visible=true;
		plus_bombe=true;
		mario_mort=true;
		mario.body.velocity.y=0;
		mario.body.velocity.x=0;
		sound_fin.volume=0.3;
		sound_fin.play();
		bombe.destroy();  // supprime la bombe
	}
	//fonction à executer si mario touche les pieces
	collectPiece (sprite, piece){
		sound_fin.volume=0.3;
		sound_piece.play();
		piece.disableBody(true, true);
		score += 1;
		text.setText('score: ' + score);
		// si on veut remettre les pieces une fois les 3 attrappées ...
		/*if (pieces.countActive(true) === 0) {
			//  A new batch of coins to collect
			pieces.children.iterate(function (child) {
			child.enableBody(true, child.x, 50, true, true);
			});
		}*/
	}
}

//scene niveau SceneGlace
class SceneGlace extends Phaser.Scene{
    constructor (){
        super({ key: 'SceneGlace' });
	}

	preload(){
	//chargement des images en mémoire
	this.load.image('image_sol2', 'assets/ice-platform.png');
	//chargement des sons en mémoire
	this.load.audio('bruit_saut','assets/saut.wav');
	this.load.audio('bruit_porte','assets/door.mp3');
	}
		
	create(){
		decompte=70;
		this.events.on('pause', () =>{console.log('Scene Glace paused');});
		this.events.on('resume', () =>{console.log('Scene Glace resumed');});
		//creation des décors
		les_sols = this.physics.add.staticGroup();
		les_sols.create(140, 605, 'image_sol2').setScale(2).refreshBody();
		les_sols.create(400, 605, 'image_sol2').setScale(2).refreshBody();
		les_sols.create(660, 605, 'image_sol2').setScale(2).refreshBody();
		les_sols.create(920, 605, 'image_sol2').setScale(2).refreshBody();
		les_sols.create(560, 440, 'image_sol2').setScale(1.5).refreshBody();
		les_sols.create(750, 280, 'image_sol2').setScale(1.5).refreshBody();
		nuage_plateforme=this.physics.add.sprite(150,80,"image_nuage_plateforme").setScale(1.5);
		nuage_plateforme.body.allowGravity = false;
		nuage_plateforme.body.immovable = true;
		nuage_mouvement = this.tweens.add({
			targets: [nuage_plateforme],  // on applique le tween sur platefprme_mobile
			paused: false, // de base le tween est en pause
			ease: "Linear",  // concerne la vitesse de mouvement : linéaire ici 
			duration: 5000,  // durée de l'animation pour monter 
			yoyo: true,   // mode yoyo : une fois terminé on "rembobine" le déplacement 
			x: "+=650",   // on va déplacer la plateforme de 300 pixel vers le haut par rapport a sa position
			delay: 0,     // délai avant le début du tween une fois ce dernier activé
			hold: 1000,   // délai avant le yoyo : temps qeu al plate-forme reste en haut
			repeatDelay: 2000, // deléi avant la répétition : temps que la plate-forme reste en bas
			repeat: -1 // répétition infinie 
		});
		porte = this.physics.add.staticSprite(975, 520, "image_porte").setScale(2.5).refreshBody();
		//les sprite
		mario = this.physics.add.sprite(25, 450, 'image_mario_droite').setScale(2); //cree le sprite mario
		mario.setCollideWorldBounds(true); //mario percoit les bords
		mario.setOrigin (0.5,0.5); //on le gere par son nombril et pas par son oreille gauche
		this.physics.add.collider(mario, les_sols);
		//création des touches
		cursors = this.input.keyboard.createCursorKeys();
		button_p = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
		//création des pieces
		pieces = this.physics.add.staticGroup({
			key: 'piece',
			repeat: 1,
			setXY: { x: 750, y: 150, stepX: 50 }
		});
		this.physics.add.overlap(mario, pieces, this.collectPiece, null, this);
		//création des sons
		sound_saut = this.sound.add('bruit_saut');
		sound_porte = this.sound.add('bruit_porte');
		//affichage du score
		text2 = this.add.text(32, 20, 'score: '+ score, { fontFamily: 'Arial, Georgia, "Goudy Bookletter 1911", Times, serif', fontSize: '32px', fill: '#fff' });
	}

	update(){
		if (button_p.isDown){ //si on appuie sur a touche P
			this.scene.pause();
			scene_origine='SceneGlace';
			this.scene.launch('ScenePause');
		}
		if (cursors.up.isDown && mario.body.touching.down){ // body.touching necessaire sinon peut monter meme si deja en l'air
			sound_saut.volume=0.3;
			sound_saut.play();
			mario.setVelocityY(-330);
		}
		if (cursors.left.isDown){
			mario.setVelocityX(-160);
			mario.setTexture('image_mario_gauche');
		}
		else if (cursors.right.isDown){
			mario.setVelocityX(160);
			mario.setTexture('image_mario_droite');
		}
		else {
			mario.setVelocityX(0);
		}
		//si pousse porte
		if (this.physics.overlap(mario,porte) && cursors.right.isDown) {
			decompte=decompte-1;
			if (decompte<0) {
				sound_porte.volume=0.3;
				sound_porte.play();
					this.scene.start("SceneDepart");
			}
		} 
	}
	//fonction à executer si mario touche les pieces
	collectPiece (sprite, piece){
		sound_fin.volume=0.3;
		sound_piece.play();
		piece.disableBody(true, true);
		score += 1;
		text2.setText('score: ' + score);
	}
}

//scene secondaire B pour gérer la pause
class ScenePause extends Phaser.Scene{
    constructor (){
        super({ key: 'ScenePause' });
    }

    preload (){
		this.load.image('image_paused','assets/paused.png');
    }

    create (){
		image_game_paused=this.add.image(500, 310, 'image_paused').setScale(3);
		button_p = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
		button_o = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);
		//this.input.once('pointerdown', function (){image_game_paused.visible=false;this.scene.resume('sceneA');}, this);
    }
	
	update(){
		if (button_p.isDown || button_o.isDown){
			image_game_paused.visible=false;
			this.scene.pause();
			if (scene_origine=="SceneDepart"){
				this.scene.resume('SceneDepart');
			}
			else if (scene_origine=="SceneGlace"){
				this.scene.resume('SceneGlace');
			}
			else {
				this.scene.resume('SceneDepart');
			}
		}
	}
}

const config = {
	type: Phaser.AUTO, // Définit le moteur graphique à utilisé CANVAS, WEBGL ou AUTO.
    width: 1000, // largeur de l'écran de jeu.
    height: 600, // hauteur de l'écran de jeu.
            physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 300 },
                debug: false
            }
        }, // définit la physique utilisée par phaser.
	backgroundColor: '#77B5FE',
    scene: [ SceneDepart, SceneGlace, ScenePause ]
};

const game = new Phaser.Game(config);