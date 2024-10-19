var Settings = new Phaser.Scene("Settings");
Settings.preload = function() {
    // テキストエリアを表示するプラグインの導入
    this.load.scenePlugin({
        key: "rexuiplugin",
        url: "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js",
        sceneKey: "rexUI",
    });

};
Settings.create = function (data) {
    this.keys = {};
    this.keys.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    
    // スリープが解除されたときに呼ぶメソッドを定義
    this.events.on("wake", this.onWake, this);
    this.input.on('pointerdown', this.onPointerDown, this);
    this.item = data.item
    this.money = data.money
};
Settings.onPointerDown = function(pointer , over) {
    if(!(pointer.position.x > 516 && pointer.position.x < 972 && pointer.position.y > 78 && pointer.position.y < 781)){
        this.scene.sleep("Settings");
        this.scene.wake("mainScene",  {
            'item' : this.item,
            'money' : this.money,
        });
    }
};
Settings.drawBackground = function(){
    // シーン全体の背景色 黒の透過画面
    this.cameras.main.setBackgroundColor();
    // 画面中央の灰色の枠を透過画面で表示
    this.rectangle = this.add.rectangle(175, 0, 440, 600, 0x6495ed, 1).setOrigin(0,0);
    // カメラの中心を移動
    this.cameras.main.centerOn(400, 300);
};
Settings.onWake = function(sys, data) {
    // メインシーンからデータを受け取る
    this.drawBackground();
    var Image = this.add.image(400,300,'Menu');
    
    Image.displayWidth = 600;
    Image.displayHeight = 800;
    this.item = data.item;
    this.money = data.money
    this.createTextArea();
};
Settings.createTextArea = function(){
    this.messageDialog = this.rexUI.add
    .dialog({
      x: 390,
      y: 105,
      width:300,
      background: this.rexUI.add.roundRectangle({
        radius: 20,
        color: 0x000,
        alpha: 1,
      }),
      title: this.createLabel("-- Privacy Policy--").setDraggable(),
      content: this.createLabel("We do not accept illegal access to our games.\nWe respect your privacy. \nWe will allow any users to use our services \nWe will not include any illegal contents \nor illegal codes which harms your privacy"),
      space: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 20,
      },
      expand: {
        title: false,
      },
    })
    .layout();
    
    this.codeArea = this.add.rectangle(210, 500, 150, 36, 0xf1f1f1, 0.8).setOrigin(0,0);
	this.codeArea.setAlpha(1);
    this.text = this.add.text(215, 505, 'Type Code', { color: '#000000', fixedWidth: 150, fixedHeight: 36 });
	this.text.setOrigin(0, 0);
	this.Enter = this.add.image(430,520,'Enter');
	this.Enter.setDisplaySize(130,50)

	this.text.setInteractive().on('pointerdown', () => {
		this.rexUI.edit(this.text);
	});
	this.Enter.setInteractive().on('pointerdown', () => {
		//Code recognization
		this.sound.play('Buy', {volume: 1, loop:false});
		if(this.text._text == "CODETEST"){
		    this.money = 50000;
		}
	});
}
Settings.createLabel = function (text) {
  return this.rexUI.add.label({
    // 最小幅
    width: 40,
    // 最小高さ
    height: 40,
    //background: this.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x5e92f3),
    text: this.add.text(0, 0, text, {
      fontSize: "16px",
    }),
    space: {
      left: 10,
      right: 10,
      top: 10,
      bottom: 10,
    },
  });
};