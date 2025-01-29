// スタート画面のシーン
var startScene = new Phaser.Scene("startScene");
startScene.create = function () {
    this.openingBGM = this.sound.add("Opening", {volume: 1, loop:true});
    this.openingBGM.play();
    var centerX = this.game.config.width / 2;
    var centerY = this.game.config.height / 2;
    this.background = this.add.image(centerX,centerY,'background');
    this.background.setDisplaySize(window.innerWidth * 0.98, window.innerHeight * 0.98)
    
    this.gamestart = this.add.image(centerX * 0.75, centerY * 1.7, 'gamestart');
    this.gamestart.setDisplaySize(1100,300);
    
    var Text ="Grand\n   Theft\nAuto"
    this.playerText = this.add.text(800, 25, Text, { color: '#ffffff', fontSize: '170px' ,fontFamily: 'gtaFontNormal'});
    this.playerText.setScrollFactor(0);
    
    //プレイヤーの体力、スタミナ設定
    var datamoney = parseInt(localStorage.getItem('money')) || 0;
    this.PlayerMoney = datamoney;
    //if(localStorage.getItem('items') === null){
    if(!localStorage.getItem('items')){
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
    // キーをクリックするとゲームスタート
    this.input.keyboard.on('keydown', function(event) {
        this.openingBGM.stop();
        if(!this.scene.isSleeping("Inventory")) {
            // インベントリシーンを起動
            this.scene.start("Inventory",{
                'item' : this.item,
                'money' : this.PlayerMoney,
            });
            // インベントリシーンを待機状態にする
            this.scene.sleep("Inventory");
        }
        if(!this.scene.isSleeping("Shop")) {
            this.scene.run("Shop", {
                'item' : this.item,
                'money' : this.PlayerMoney,
            });
            
        }
        if(!this.scene.isSleeping("Settings")) {
            this.scene.run("Settings", {
                'item' : this.item,
                'money' : this.PlayerMoney,
            })
            
        }
        //this.sound.get('Start').pause;
        this.scene.start("mainScene", {
            'item' : this.item,
            'money' : this.PlayerMoney,
        });
    }, this);
};
startScene.setMoney = function(amount, addOrSet){
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