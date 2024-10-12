// スタート画面のシーン
var startScene = new Phaser.Scene("startScene");
startScene.create = function () {
    //this.sound.play('Start', {volume: 0.1,loop:true});
    var centerX = this.game.config.width / 2;
    var centerY = this.game.config.height / 2;
    this.background = this.add.image(centerX,centerY,'background');
    this.background.setDisplaySize(window.innerWidth * 0.98, window.innerHeight * 0.98)
    
    this.gamestart = this.add.image(centerX * 0.75, centerY * 1.7, 'gamestart');
    this.gamestart.setDisplaySize(1100,300);
    
    var Text ="Grand\n   Theft\nAuto"
    this.playerText = this.add.text(800, 25, Text, { color: '#ffffff', fontSize: '170px' ,fontFamily: 'gtaFontNormal'});
    this.playerText.setScrollFactor(0);
    
    // キーをクリックするとゲームスタート
    this.input.keyboard.on('keydown', function(event) {
        if(!this.scene.isSleeping("Inventory")) {
            // インベントリシーンを起動
            this.scene.start("Inventory");
            // インベントリシーンを待機状態にする
            this.scene.sleep("Inventory");
        }
        if(!this.scene.isSleeping("Shop")) {
            this.scene.run("Shop");
            
        }
        if(!this.scene.isSleeping("Settings")) {
            this.scene.run("Settings")
            
        }
        //this.sound.get('Start').pause;
        this.scene.start("mainScene");
    }, this);
};
