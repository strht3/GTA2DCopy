// 画像読込のシーン
var loadScene = new Phaser.Scene("loadScene");

loadScene.preload = function() {
    // スタート画像
    this.load.image('gamestart', 'assets/images/StartButton.png');
    this.load.image('background', 'assets/images/StartBackground.jpg');
    // ゲームオーバー画像
    this.load.image('gameover', 'assets/images/gameover.png');
    this.load.image('tilemap','assets/images/tilemap.png');
    this.load.image('inventory','assets/images/Inventory.png')
    this.load.image('GunShop','assets/images/GunShop.jpg')
    this.load.image('Menu','assets/images/R.png')
    this.load.tilemapTiledJSON('map01','assets/data/WorldMap1.json');
    
    //Sprite Load
    this.load.spritesheet("player", "assets/images/PlayerAnimation.png", {
        frameWidth: 51,
        frameHeight: 64,
    });
    this.load.spritesheet("enemy01", "assets/images/Enemy01.png", {
        frameWidth: 51,
        frameHeight: 64,
    });
    this.load.spritesheet("Car01", "assets/images/CarOrange.png", {
        frameWidth:1935,
        frameHeight:1935,
    });
    this.load.spritesheet("Explosion", "assets/images/Explosion.png", {
        frameWidth:480,
        frameHeight:384,
    });
    this.load.spritesheet("KnifeSlash", "assets/images/knifeslash.png", {
        frameWidth:1080,
        frameHeight:1080,
    });
    this.load.spritesheet("KatanaSlash", "assets/images/katanaSlash.png", {
        frameWidth:200,
        frameHeight:159,
    });
    this.load.spritesheet("machinegun", "assets/images/Bullets.png", {
        frameWidth:1800,
        frameHeight:3900,
    });
    
    //Attacks Load
    this.load.image('fireball', "assets/images/波動拳.png");
    this.load.image('bullet', "assets/images/bulllet.png");
    
    //Items Load
    this.load.image('Bat', "assets/images/Bat.png");
    this.load.image('Knife', "assets/images/Knife.png");
    this.load.image('CheapSword', "assets/images/CheapSword.png");
    this.load.image('Glock17', "assets/images/Glock.png");
    this.load.image('MAC11', "assets/images/MAC.png");
    this.load.image('G36K', "assets/images/Rifle.png");
    
    //Buttons and Images Load
    this.load.image('Area', "assets/images/Area.png");
    this.load.image('Enter', "assets/images/iu-1.png");
    
    
    //Audio Load
    this.load.audio('Start',"assets/Audios/Start.mp3");
    this.load.audio('walking',"assets/Audios/アスファルトの上を歩く1.mp3");
    this.load.audio('inventory',"assets/Audios/ファスナー.mp3");
    this.load.audio('Shop',"assets/Audios/入店チャイム.mp3");
    this.load.audio('punch',"assets/Audios/小パンチ.mp3");
    this.load.audio('enemypunch',"assets/Audios/小パンチ.mp3");
    this.load.audio("Car","assets/Audios/バイク通過3.mp3");
    this.load.audio("Buy","assets/Audios/購入.mp3");
    this.load.audio("Earn","assets/Audios/小銭.mp3");
    this.load.audio("Cancel","assets/Audios/ビープ音1.mp3");
    this.load.audio("Cancel","assets/Audios/サブマシンガン発射2.mp3");
    this.load.audio("Cancel","assets/Audios/ナイフを投げる.mp3");
    this.load.audio("Cancel","assets/Audios/剣で斬る5.mp3");
    this.load.audio("Cancel","assets/Audios/岩が真っ二つに割れる.mp3");
    this.load.audio("Cancel","assets/Audios/重機関銃を乱射1.mp3");
};

loadScene.create = function() {
    // 読み込み完了後にstartSceneを起動
    this.scene.start("startScene");
};
