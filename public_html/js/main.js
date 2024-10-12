var data = 'assets/data/data.js'
var mainScene = new Phaser.Scene("mainScene");

mainScene.create = function (data) {
    //初期設定
    this.config();
    this.events.on("wake", this.onWake, this);
    //背景
    this.cameras.main.setBackgroundColor("#FFFFFF");
    //マップ作成
    this.createMap()
    this.createUI();
    if(localStorage.getItem('items') === 'undefined'){
        this.item = {};
        this.item.Bag = [
        ];
        this.item.Hand = [
        ];
        this.item.Armour = [
        ];
    }else{
        this.item = JSON.parse(localStorage.getItem('items'));
    }
    //プレイヤー作成
    this.createPlayer();
    //敵作成
    this.createEnemyGroup();
    //攻撃作成
    this.createPunchGroup();
    //障害物作成
    this.createCarGroup();
    this.createWays();
    //衝突作成
    this.setCollider();
    //
    //key
    this.keys = {};
    this.keys.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keys.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keys.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keys.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keys.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.keys.keyL = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
    this.keys.keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
    this.keys.key1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
};
mainScene.update = function() {
    if(this.player.active == true){
        this.moveplayer();
    }
    this.healPlayerHealthBySecond();
};


mainScene.config = function () {
    this.enemyData = [{
            name:'enemy01',
            hp:3,
        }];
    this.enemyMovement = ['up','down','right','left','turn'];
    this.TILE_WIDTH = 16; // 画像タイルのサイズ
    this.TILE_HEIGTH = 16; // 画像タイルのサイズ
    this.TILE_MARGIN = 0;
    this.TILE_SPACING = 1; // 画像タイル間のすき間
    this.TILE_SCALE = 4;
    this.TILE_COLUMN = 35;
    this.TILE_ROW = 50;
    
    this.PlayerHealth = parseFloat(localStorage.getItem('health')) || 15;
};
mainScene.onWake = function(sys, data){
    if(data.money == undefined || data.item == undefined){
        return;
    }
    console.log(data.item);
    this.item = data.item;
    this.setMoney(data.money, "Set");
}
mainScene.createMap = function() {
    this.map = this.make.tilemap({key:"map01"});
    //タイル？
    this.tiles= this.map.addTilesetImage(
        "tilemap",
        "tilemap",
        this.TILE_WIDTH,
        this.TILE_HEIGTH,
        this.TILE_MARGIN,
        this.TILE_SPACING,
    );
    //大きさ設定
    var layerW = this.TILE_WIDTH * this.TILE_SCALE* this.TILE_COLUMN;
    var layerH = this.TILE_HEIGTH * this.TILE_SCALE* this.TILE_ROW;
    //レイヤー
    this.groundLayer = this.map.createLayer("Ground",this.tiles,0,0);
    this.groundLayer.setDisplaySize(layerW,layerH);
    
    this.environmentleLayer = this.map.createLayer("Environment",this.tiles,0,0,);
    //チェック
    this.environmentleLayer.setDisplaySize(layerW,layerH);
    
    this.borderLayer = this.map.createLayer("Border", this.tiles, 0, 0);
    this.borderLayer.setDisplaySize(layerW,layerH);
    this.borderLayer.setCollisionByExclusion([-1]);
    
    this.worldLayer = this.map.createLayer("World", this.tiles, 0, 0);
    this.worldLayer.setDisplaySize(layerW,layerH);
    this.worldLayer.setCollisionByExclusion([-1]);

    //カメラのバウンド    
    this.physics.world.bounds.width = this.groundLayer.displayWidth;
    this.physics.world.bounds.height = this.groundLayer.displayHeight;
        
    this.cameras.main.setBounds(
        0,
        0,
        this.physics.world.bounds.width,
        this.physics.world.bounds.height,
    );
};

mainScene.createPlayer = function(){
    // プレイヤー作成
    var playerX = 200;
    var playerY = 3000;
    this.player = this.physics.add.sprite(playerX, playerY, 'player',1); //物理エンジンが使用できる関数に書き換えてください
    // 表示サイズ設定
    this.player.setDisplaySize(
        this.TILE_WIDTH * this.TILE_SCALE,
        this.TILE_HEIGTH * this.TILE_SCALE,
    );
    // プレイヤーのアニメーションを作成
    this.createPlayerAnimation();
    //Area
    this.Area = this.physics.add.image(playerX, playerY, 'Area',);
    this.Area.setDisplaySize(
        this.TILE_WIDTH * this.TILE_SCALE * 4,
        this.TILE_HEIGTH * this.TILE_SCALE * 4,
    )
    this.Area.setAlpha(0);
    // カメラがプレイヤーを追跡する
    this.cameras.main.startFollow(this.player);
    this.player.isPunching = false;
    
    //プレイヤーの体力、スタミナ設定
    var datamoney = parseInt(localStorage.getItem('money')) || 0;
    this.setMoney(datamoney, "Set");

}

mainScene.createPlayerAnimation = function(){
    // 最初のフレームを0番にする
    this.player.setFrame(0);
    // 正面を向く
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'player', frame: 0 } ],
        frameRate: 20
    });
    // 左向きのアニメーション
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start: 3, end: 4 }),
        frameRate: 10,
        repeat: -1
    });
    // 右向きのアニメーション
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', { start: 1, end: 2 }),
        frameRate: 10,
        repeat: -1
    });
    // 上向きのアニメーション
    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('player', { start: 5, end: 6 }),
        frameRate: 10,
        repeat: -1
    });
    // 下向きのアニメーション
    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('player', { start: 7, end: 8 }),
        frameRate: 10,
        repeat: -1
    });
    //右向きパンチ
    this.anims.create({
        key: 'punchright',
        frames: this.anims.generateFrameNumbers('player', { start: 10, end: 11 }),
        frameRate: 10,
        repeat: -1
    });
    //左向きパンチ
    this.anims.create({
        key: 'punchleft',
        frames: this.anims.generateFrameNumbers('player', { start: 12, end: 13 }),
        frameRate: 10,
        repeat: -1
    });
    //下向きパンチ
    this.anims.create({
        key: 'punchdown',
        frames: this.anims.generateFrameNumbers('player', { start: 14, end: 15 }),
        frameRate: 10,
        repeat: -1
    });
    //上向きパンチ
    this.anims.create({
        key: 'punchup',
        frames: this.anims.generateFrameNumbers('player', { start: 16, end: 17 }),
        frameRate: 10,
        repeat: -1
    });
    //ゲームオーバー
    this.anims.create({
        key: 'gameover',
        frames: this.anims.generateFrameNumbers('player', { start: 18, end: 19}),
        frameRate: 10,
        repeat: -1
    });
}
mainScene.moveplayer = function(){
    //プレイヤーのスピード
    var power = 300;
    //キー
    var cursors = this.input.keyboard.createCursorKeys();
    //それぞれのキーのアニメーション
    if (this.PlayerX !== this.player.x) {
        if(this.Area.x < this.player.x){
            this.Area.setVelocityX(power)
        }else if(this.Area.x > this.player.x){
            this.Area.setVelocityX(-power)
        };
    }else{
        this.Area.setVelocityX(0);
    }
    if (this.PlayerY !== this.player.y) {
        if(this.Area.y < this.player.y){
            this.Area.setVelocityY(power)
        }else if(this.Area.y > this.player.y){
            this.Area.setVelocityY(-power)
        };
    }else{
        this.Area.setVelocityY(0);
    }
    // 必要な処理
    
    
    this.PlayerX = this.player.x;
    this.PlayerY = this.player.y;
    
    if(this.keys.keyD.isDown || cursors.right.isDown) {
        this.player.direction = 'right'
        // 右に移動
        this.player.setVelocityX(power);
        //this.Area.setVelocityX(power);
        // 右向きのアニメーション
        this.player.anims.play('right',true)
        if (this.sound.get('walking')) {
            this.sound.get('walking').resume();
        } else {
            this.sound.play('walking', {volume: 0.5, loop:true});    
        }        
    } else if(this.keys.keyA.isDown  || cursors.left.isDown) {
        this.player.direction = 'left'
        // 左に移動
        this.player.setVelocityX(-power);
        // 左向きのアニメーション
        this.player.anims.play('left',true)
        if (this.sound.get('walking')) {
            this.sound.get('walking').resume();
        } else {
            this.sound.play('walking', {volume: 0.5, loop:true});    
        }
    } else if(this.keys.keyW.isDown || cursors.up.isDown) {
        this.player.direction = 'up'
        // 上に移動
        this.player.setVelocityY(-power);
        // 上向きのアニメーション
        this.player.anims.play('up',true)
        if (this.sound.get('walking')) {
            this.sound.get('walking').resume();
        } else {
            this.sound.play('walking', {volume: 0.5, loop:true});    
        }
    } else if(this.keys.keyS.isDown || cursors.down.isDown) {
        this.player.direction = 'down'
        // 下に移動
        this.player.setVelocityY(power);
        // 下向きのアニメーション
        this.player.anims.play('down',true)
        if (this.sound.get('walking')) {
            this.sound.get('walking').resume();
        } else {
            this.sound.play('walking', {volume: 0.5, loop:true});    
        }
    }else{
        this.player.setVelocity(0);
        // キーを放すとアニメーション停止
        this.player.anims.stop();
        //キーを放すと正面を向く
        this.player.anims.play('turn', true);
        
        if (this.sound.get('walking')) {
            this.sound.get('walking').pause();
        }

    };
    if(cursors.space.isDown && this.player.direction == 'right' && !this.player.isPunching){
        this.player.anims.play('punchright');
        this.punchBeam(this.player.direction);
        this.player.isPunching = true
        this.sound.play('punch', {volume: 1, loop:false});
    }else if(cursors.space.isDown && this.player.direction == 'left'&& !this.player.isPunching){
        this.player.anims.play('punchleft');
        this.punchBeam(this.player.direction);
        this.player.isPunching = true
        this.sound.play('punch', {volume: 1, loop:false});
    }else if(cursors.space.isDown && this.player.direction == 'down'&& !this.player.isPunching){
        this.player.anims.play('punchdown');
        this.punchBeam(this.player.direction);
        this.player.isPunching = true
        this.sound.play('punch', {volume: 1, loop:false});
    }else if(cursors.space.isDown && this.player.direction == 'up'&& !this.player.isPunching){
        this.player.anims.play('punchup');
        this.punchBeam(this.player.direction);
        this.player.isPunching = true
        this.sound.play('punch', {volume: 1, loop:false});
    };
    
    if(this.keys.keyE.isDown){
        this.scene.pause("mainScene");
        this.scene.wake("Inventory", {
            'item' : this.item,
            'money' : this.PlayerMoney,
        });
    }
    if(this.keys.keyL.isDown){
        this.scene.pause("mainScene");
        this.scene.wake("Shop", {
            'item' : this.item,
            'money' : this.PlayerMoney,
        });
    }
    if(this.keys.keyM.isDown){
        this.scene.pause("mainScene");
        this.scene.wake("Settings", {
            'item' : this.item,
            'money' : this.PlayerMoney,
        });
    }
    
}
mainScene.createUI = function () {
    var hpText = "Health : " + this.PlayerHealth;
    this.PlayerHpText = this.add.text(50, 800, hpText, { color: '#ffffff', fontSize: '60px' ,fontFamily: 'gtaFontNormal'});
    this.PlayerHpText.setScrollFactor(0);
    
    var moneyText = "$ " + this.PlayerMoney;
    this.Player$Text = this.add.text(50, 750, moneyText, { color: '#ffff00', fontSize: '60px' ,fontFamily: 'gtaFontNormal'});
    this.Player$Text.setScrollFactor(0);
};
mainScene.setCollider = function(){
    //プレイヤーはゲーム空間と衝突
    this.player.setCollideWorldBounds(true);
    //プレイヤーはborderレイヤーと衝突
    // overlapからcolliderに修正
    this.physics.add.collider(this.player,this.borderLayer);
    //プレイヤーはworldレイヤーと衝突
    this.physics.add.collider(this.player,this.worldLayer);
    
    this.physics.add.overlap(this.Area,this.enemyGroup,this.TouchedArea,null,this)
};

mainScene.TouchedArea = function(area, enemy){
    enemy.foundPlayer = true;
};


mainScene.createEnemyGroup = function(){
    this.enemyGroup = this.physics.add.group();
    this.createEnemy();
    var enemyHP = 3;
    var enemydirection = 'down';
    this.physics.add.collider(this.enemyGroup,this.borderLayer,this.hitWall,null,this);
    this.physics.add.collider(this.enemyGroup,this.worldLayer,this.hitWall,null,this);
    this.physics.add.collider(this.enemyGroup,this.enemyGroup);
    this.enemyNumber = 1;
    this.enemySpawn = this.time.addEvent({
        delay:1000,
        callback:this.createEnemy,
        loop:true,
        callbackScope:this
    });
}
mainScene.createEnemy = function(){
    var maxEnemy = 10;
    this.eNumber = this.enemyNumber;
    if(this.eNumber >= maxEnemy){
        return;
    }
    this.enemyNumber+= 1;
    var enemyposition = [[9,12],[30,45],[31,6],[25,25]];
    var position = Phaser.Math.RND.pick(enemyposition);
    var x = position[0];
    var y = position[1];
    // 敵作成
    var enemy = this.enemyGroup.create(x*16*4, y*16*4,'enemy01');
    // 敵のサイズ変更
    //enemy.body.setSize(350,350);
    enemy.setDisplaySize(this.TILE_WIDTH * this.TILE_SCALE,this.TILE_HEIGTH * this.TILE_SCALE,);
    enemy.setCollideWorldBounds(true);
    this.createEnemyAnimation(enemy);
    // 敵の移動速度をランダムに設定する
    //var speed = Phaser.Math.RND.pick(this.enemySpeed);
    //enemy.setVelocityX(speed);
    enemy.foundPlayer = false;
    enemy.isDamage = false;
    this.enemyTime = [100,150,200]
    var TimeMoveEnemy = Phaser.Math.RND.pick(this.enemyTime);
    this.MoveEnemyTimer = this.time.addEvent({
        delay:TimeMoveEnemy,
        callback:this.MoveEnemy,
        args: [enemy],
        loop:true,
        callbackScope:this,
    });
}
mainScene.hitWall = function(enemy,layer){
    enemy.foundPlayer = false;
    enemy.direction = enemydirection;
    this.enemySpeed = [100,150,200,];
    var enemypowerinhitwall = Phaser.Math.RND.pick(this.enemySpeed);
    var movementinhitwall

    if(enemy.direction == 'right'){
        movementinhitwall = 'left'
    } else if(enemy.direction == 'left'){
        ;
        movementinhitwall = 'right'
    }else if(enemy.direction == 'up'){
        ;
        movementinhitwall = 'down'
    } else if(enemy.direction == 'down'){
        ;
        movementinhitwall = 'up'
    }
    if(movementinhitwall == 'right') {
        // 右に移動
        //this.player.x += speed;
        enemy.direction == 'right';
        enemy.setVelocityX(enemypowerinhitwall);
        // 右向きのアニメーション
        enemy.anims.play('enemyright',true)
    } else if(movementinhitwall == 'left') {
        // 左に移動
        //this.player.x -= speed;
        enemy.direction == 'left';
        enemy.setVelocityX(-enemypowerinhitwall);
        // 左向きのアニメーション
        enemy.anims.play('enemyleft',true)
    } else if(movementinhitwall == 'up') {
        // 上に移動
        //this.player.y -= speed;
        enemy.direction == 'up';
        enemy.setVelocityY(-enemypowerinhitwall);
        // 上向きのアニメーション
        enemy.anims.play('enemyup',true)
    } else if(movementinhitwall== 'down') {
        // 下に移動
        //this.player.y += speed;
        enemy.direction == 'down';
        enemy.setVelocityY(enemypowerinhitwall);
        // 下向きのアニメーション
        enemy.anims.play('enemydown',true)
    }else if(movementinhitwall == 'turn'){
        enemy.setVelocity(0);
        // キーを放すとアニメーション停止
        enemy.anims.stop();
        //キーを放すと正面を向く
        enemy.anims.play('enemyturn', true);
    }
}
mainScene.MoveEnemy = function(enemy){
    if(enemy.active == true){
        //this.physics.add.overlap(enemy,this.borderLayer,this.hitwall,enemy,this);
        this.enemySpeed = [100,150,200,];
        var enemypower = Phaser.Math.RND.pick(this.enemySpeed);
        if(enemy.foundPlayer == false){
            var movement = Phaser.Math.RND.pick(this.enemyMovement);
            //code for movement
            if(movement == 'right') {
                // 右に移動
                //this.player.x += speed;
                enemy.setVelocityY(0);
                enemy.setVelocityX(enemypower);
                // 右向きのアニメーション
                enemy.anims.play('enemyright',true)
                enemydirection = 'right';
            } else if(movement == 'left') {
                // 左に移動
                //this.player.x -= speed;
                enemy.setVelocityY(0);
                enemy.setVelocityX(-enemypower);
                // 左向きのアニメーション
                enemy.anims.play('enemyleft',true)
                enemydirection = 'left';
            } else if(movement == 'up') {
                // 上に移動
                //this.player.y -= speed;
                enemy.setVelocityX(0);
                enemy.setVelocityY(-enemypower);
                // 上向きのアニメーション
                enemy.anims.play('enemyup',true)
                enemydirection = 'up';
            } else if(movement == 'down') {
                // 下に移動
                //this.player.y += speed;
                enemy.setVelocityX(0);
                enemy.setVelocityY(enemypower);
                // 下向きのアニメーション
                enemy.anims.play('enemydown',true)
                enemydirection = 'down';
            }else if(movement == 'turn'){
                enemy.setVelocity(0);
                // キーを放すとアニメーション停止
                enemy.anims.stop();
                //キーを放すと正面を向く
                enemy.anims.play('enemyturn', true);
            }
        }else if(enemy.foundPlayer == true){
            
            var speed = 250;
            var degree = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
            var angle = Phaser.Math.RadToDeg(degree);
            let distance = Math.sqrt(Math.pow(this.player.x - enemy.x, 2) + Math.pow(this.player.y - enemy.y, 2));
            
            if(distance > 100){
                this.enemyPunching = true;
                enemy.anims.play('EnemyPunchRight',false);
                enemy.anims.play('EnemyPunchLeft',false);
                enemy.anims.play('EnemyPunchUp',false);
                enemy.anims.play('EnemyPunchDown',false);
                
                if(angle>-55 && angle<0 || angle > 0 && angle < 45){
                    enemy.anims.play('enemyright',true);
                }else if(angle>135 && angle<180 || angle < -180 && angle > -145){
                    enemy.anims.play('enemyleft',true);
                }else if(angle > -145 && angle < -55){
                    enemy.anims.play('enemyup',true);
                }else if(angle>45 && angle<135){
                    enemy.anims.play('enemydown',true);
                };
    
                enemy.setVelocityX(speed * Math.cos(degree));
                enemy.setVelocityY(speed * Math.sin(degree));
            }else if(distance < 100){
                //リセット
                enemy.setVelocityX(0);
                enemy.setVelocityY(0);
                //攻撃
                if(angle>-55 && angle<0 || angle > 0 && angle < 45 && !this.enemyPunching){
                    enemy.direction = "right";
                    enemy.anims.play('EnemyPunchRight',true);
                    this.enemyPunching = true;
                    
                }else if(angle>135 && angle<180 || angle < -180 && angle > -145  && !this.enemyPunching){
                    enemy.direction = "left";
                    enemy.anims.play('EnemyPunchLeft',true);
                    this.enemyPunching = true
                    
                }else if(angle > -145 && angle < -55 && !this.enemyPunching){
                    enemy.direction = "up";
                    enemy.anims.play('EnemyPunchUp',true);
                    this.enemyPunching = true;
                    
                }else if(angle>45 && angle<135 && !this.enemyPunching){
                    enemy.direction = "down";
                    enemy.anims.play('EnemyPunchDown',true);
                    this.enemyPunching = true;
                
                };
                let distance = Math.sqrt(Math.pow(this.player.x - enemy.x, 2) + Math.pow(this.player.y - enemy.y, 2));
                this.PlayerDamage(enemy, distance);
                this.enemySetPunchFalse();
            };
        };
    }else{
        return;
    }
};
mainScene.enemySetPunchFalse = function(enemy){
    this.enemyPunching = false;
};
mainScene.createEnemyAnimation = function(enemy){
    // 最初のフレームを0番にする
    enemy.setFrame(0);
    // 正面を向く
    this.anims.create({
        key: 'enemyturn',
        frames: [ { key: 'enemy01', frame: 0 } ],
        frameRate: 20
    });
    // 左向きのアニメーション
    this.anims.create({
        key: 'enemyleft',
        frames: this.anims.generateFrameNumbers('enemy01', { start: 3, end: 4 }),
        frameRate: 10,
        repeat: -1
    });
    // 右向きのアニメーション
    this.anims.create({
        key: 'enemyright',
        frames: this.anims.generateFrameNumbers('enemy01', { start: 1, end: 2 }),
        frameRate: 10,
        repeat: -1
    });
    // 上向きのアニメーション
    this.anims.create({
        key: 'enemyup',
        frames: this.anims.generateFrameNumbers('enemy01', { start: 5, end: 6 }),
        frameRate: 10,
        repeat: -1
    });
    // 下向きのアニメーション
    this.anims.create({
        key: 'enemydown',
        frames: this.anims.generateFrameNumbers('enemy01', { start: 7, end: 8 }),
        frameRate: 10,
        repeat: -1
    });
    //右向きパンチ
    this.anims.create({
        key: 'EnemyPunchRight',
        frames: this.anims.generateFrameNumbers('enemy01', { start: 9, end: 10 }),
        frameRate: 2,
        repeat: 0
    });
    //左向きパンチ
    this.anims.create({
        key: 'EnemyPunchLeft',
        frames: this.anims.generateFrameNumbers('enemy01', { start: 11, end: 12 }),
        frameRate: 2,
        repeat: 0
    });
    //下向きパンチ
    this.anims.create({
        key: 'EnemyPunchDown',
        frames: this.anims.generateFrameNumbers('enemy01', { start: 13, end: 14 }),
        frameRate: 2,
        repeat: 0
    });
    //上向きパンチ
    this.anims.create({
        key: 'EnemyPunchUp',
        frames: this.anims.generateFrameNumbers('enemy01', { start: 15, end: 16 }),
        frameRate: 2,
        repeat: 0
    });
}
mainScene.createPunchGroup = function(){
    this.PunchGroup = this.physics.add.group();
    this.physics.add.overlap(this.enemyGroup,this.PunchGroup,this.PlayerAttack,null,this);
    this.physics.add.collider(this.PunchGroup,this.worldLayer,this.punchHitWall,null,this);
    this.physics.add.collider(this.PunchGroup,this.borderLayer,this.punchHitWall,null,this);
}
mainScene.punchBeam = function(direction){
    
    var posX = this.player.x;
    var posY = this.player.y;
    var punch = this.PunchGroup.create(posX,posY,'fireball');
    if(direction == 'right'){
        punch.setAngle(90);
        punch.setVelocityX(300);
    }else if(direction == 'left'){
        punch.setAngle(270);
        punch.setVelocityX(-300);
    }else if(direction == 'down'){
        punch.setAngle(180);
        punch.setVelocityY(300)
    }else if(direction == 'up'){
        punch.setAngle(0);
        punch.setVelocityY(-300);
    }
    this.punchcooldown = this.time.addEvent({
        delay:500,
        callback:this.punchFalse,
        loop:false,
        callbackScope:this
    })
}
mainScene.createCarGroup = function(){
    this.CarGroup = this.physics.add.group();
    var carHP = 15;
    var cardirection = 'down';
    this.physics.add.overlap(this.player,this.CarGroup,this.Damage,null,this);
    this.physics.add.overlap(this.CarGroup, this.enemyGroup, this.DestroyEnemyOnCollide, null,this);
    //this.physics.add.collider(this.CarGroup, this.CarGroup);
    this.physics.add.collider(this.CarGroup, this.borderLayer, this.carCrush, null,this);
    this.createCar();
    this.carNumber = 1;
    this.CarSpawn = this.time.addEvent({
        delay:9000,
        callback:this.createCar,
        loop:true,
        callbackScope:this
    });
}
mainScene.createCar = function(){
    var carposition = [[31,32,-300],[5,30,300]];
    var position = Phaser.Math.RND.pick(carposition);
    var x = position[0]; 
    var y = position[1];
    // 敵作成
    var car = this.CarGroup.create(x*16*4, y*16*4,'Car01');
    car.objectType = "Car"
    // 敵のサイズ変更
    car.setDisplaySize(this.TILE_WIDTH * this.TILE_SCALE * 3,this.TILE_HEIGTH * this.TILE_SCALE * 1.9);
    car.setCollideWorldBounds(true);
    this.createCarAnimation(car);
    //this.sound.play("Car", {volume: 0.3, loop:false});
    this.MoveCar(car,position);
}
mainScene.MoveCar = function(car,position){
    car.setVelocityX(position[2]);
    if(position[2] == 300)
    {
        car.anims.play('Carright',true);
        car.direction = "right";
    }else if(position[2] == -300){
        car.anims.play('Carleft',true);
        car.direction = "left";
    }
    car.setVelocityX(position[2]);
    var turn = ["Yes", "No"]
    car.turnornot = Phaser.Math.RND.pick(turn);
}
mainScene.createCarAnimation = function(car){
    // 最初のフレームを0番にする
    car.setFrame(3);
    // 正面を向く
    this.anims.create({
        key: 'Carturn',
        frames: [ { key: 'Car01', frame: 3 } ],
        frameRate: 20
    });
    // 左向きのアニメーション
    this.anims.create({
        key: 'Carleft',
        frames: this.anims.generateFrameNumbers('Car01', { start: 0, end: 0 }),
        frameRate: 10,
        repeat: -1
    });
    // 右向きのアニメーション
    this.anims.create({
        key: 'Carright',
        frames: this.anims.generateFrameNumbers('Car01', { start: 1, end: 1 }),
        frameRate: 10,
        repeat: -1
    });
    // 上向きのアニメーション
    this.anims.create({
        key: 'Carup',
        frames: this.anims.generateFrameNumbers('Car01', { start: 2, end: 2 }),
        frameRate: 10,
        repeat: -1
    });
    // 下向きのアニメーション
    this.anims.create({
        key: 'Cardown',
        frames: this.anims.generateFrameNumbers('Car01', { start: 3, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
}
mainScene.createWays = function()
{
    this.TurnPoint = this.physics.add.image(17*16*4,31*16*4, 'Area',);
    this.TurnPoint.setDisplaySize(
        this.TILE_WIDTH * this.TILE_SCALE * 4,
        this.TILE_HEIGTH * this.TILE_SCALE * 4,
    )
    this.physics.add.overlap(this.TurnPoint, this.CarGroup, this.turn, null, this);
    this.TurnPoint.setAlpha(0);
}
mainScene.turn = function(Point, Car){
    if(Car.turnornot == "Yes"){
        //turning scripts
        var X = Car.x / 4 / 16
        var Y = Car.x / 4 / 16
        if(Car.direction == "right"){
            if(17 > X && X > 15.8){
                //turn animation & movement
                Car.anims.play('Carup',true);
                Car.setVelocityX(-10)
                Car.setVelocityX(0);
                Car.setVelocityY(-300);
            }
        }else if(Car.direction == "left"){
            if(17 < X && X < 18.2){
                //turn animation & movement
                Car.anims.play('Carup',true);
                Car.setVelocityX(-10)
                Car.setVelocityX(0);
                Car.setVelocityY(-300);
            }
        }
    }
}
mainScene.carCrush = function(car, layer){
    car.destroy();
}
mainScene.PlayerAttack = function(enemy, attack){
    attack.destroy();
    enemy.destroy();
    this.enemyNumber -= 1;
    this.setMoney(5, "Add");
    this.sound.play('Earn', {volume: 1, loop:false});
}
mainScene.punchFalse = function(){
    this.player.isPunching = false;
}
mainScene.punchHitWall = function(punch, map){
    punch.destroy();
}
mainScene.Damage = function(player, opponent){
    let distance = Math.sqrt(Math.pow(player.x - opponent.x, 2) + Math.pow(player.y - opponent.y, 2));
    this.PlayerDamage(opponent, null);
}
mainScene.PlayerDamage = function(opponent, distance){
    if(opponent.isDamage == false && distance < 160)
    {
        opponent.isDamage = true;
        this.WaitForPunchSound1 = this.time.addEvent({
            delay:500,
            callback:this.PunchAudio,
            args:[opponent],
            loop:false,
            callbackScope:this,
        });
    };
}
mainScene.PunchAudio = function(enemy){
    this.sound.play('enemypunch', {volume: 1, loop:false});
    this.PlayerHealth -= 0.5;
    localStorage.setItem('health',this.PlayerHealth);
    this.player.setTint(0xff0000);
    var hpText = "Health : " + this.PlayerHealth;
    this.PlayerHpText.text = hpText;
    if(this.PlayerHealth <=0){
        this.Die();
    }
    this.changeColor = this.time.addEvent({
        delay:500,
        callback:this.fixColor,
        args:[enemy],
        loop:false,
        callbackScope:this
    })
}
mainScene.fixColor = function(enemy){
    this.player.setTint(0xffffff);
    enemy.isDamage = false;
}
mainScene.healPlayerHealthBySecond = function(){
    this.healplayer = this.time.addEvent({
        delay:500,
        callback:this.heal,
        loop:true,
        callbackScope:this
    })
}
mainScene.Die = function(){
    //Die, and Respawn in few seconds at homepoint/hospital
    this.player.setVisible(false);
    setTimeout(function(){
        mainScene.player.x = 200;
        mainScene.player.y = 3000;
        mainScene.Area.x = 200;
        mainScene.Area.y = 3000;
        mainScene.PlayerHealth = 15;
        var hpText = "Health : " + mainScene.PlayerHealth;
        mainScene.PlayerHpText.text = hpText;
        mainScene.player.setVisible(true);
    }, 2000);
}
mainScene.DestroyEnemyOnCollide = function(hitObject, enemy){
    if(hitObject.objectType = "Car"){
        enemy.destroy();
    }
}
mainScene.setMoney = function(amount, addOrSet){
    if(addOrSet == "Set"){
        this.PlayerMoney = amount;
        var moneyText2 = "$ " + this.PlayerMoney;
        this.Player$Text.text = moneyText2;
    }else if(addOrSet == "Add"){
        this.PlayerMoney += amount;
        var moneyText2 = "$ " + this.PlayerMoney;
        this.Player$Text.text = moneyText2;
    }
    localStorage.setItem('money',this.PlayerMoney);
    //localStorage.setItem('items',this.item);
    localStorage.setItem('items',JSON.stringify(this.item));
    localStorage.setItem('health',this.PlayerHealth);

}