// スタート画面のシーン
var inventoryScene = new Phaser.Scene("Inventory");
inventoryScene.create = function (data) {
    this.drawBackground();
    this.keys = {};
    this.keys.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    
    // スリープが解除されたときに呼ぶメソッドを定義
    this.events.on("wake", this.onWake, this);
    this.input.on('pointerdown', this.onPointerDown, this);
    var inventoryImage = this.add.image(400,300,'inventory');
    
    inventoryImage.displayWidth = 800;
    inventoryImage.displayHeight = 600;
};
inventoryScene.update = function() {
};
inventoryScene.onPointerDown = function(pointer , over) {
    if(!(pointer.position.x > 330 && pointer.position.x < 1130 && pointer.position.y > 142.5 && pointer.position.y < 742.5)){
        this.scene.sleep("Inventory");
        this.scene.wake("mainScene",  {
            'item' : this.item,
            'money' : this.money,
        });
    }
};
inventoryScene.drawBackground = function(){
    // シーン全体の背景色 黒の透過画面
    this.cameras.main.setBackgroundColor();
    // 画面中央の灰色の枠を透過画面で表示
    this.rectangle = this.add.rectangle(0, 0, 800, 600, 0xf1f1f1, 0.8).setOrigin(0,0);
    // カメラの中心を移動
    this.cameras.main.centerOn(400, 300);
};
inventoryScene.onWake = function(sys, data) {
    // メインシーンからデータを受け取る
    this.item = data.item;
    this.money = data.money
    for (var i in this.item.Bag) {
        var itemX = 30 + 59 * (i % 10);
        var itemY = 240 + 66 * Math.floor(i / 10);
        var item = this.add.image(itemX,itemY,this.item.Bag[i])
        item.setDisplaySize(50,50)
        item.setDraggable()
    }
    for (var x in this.item.Hand) {
        var itemX = 535 + 59 * (x % 10);
        var itemY = 43
        var item = this.add.image(itemX,itemY,this.item.Hand[x])
        item.setDisplaySize(50,50)
    }
    for (var y in this.item.Armour) {
        var itemX = 771
        var itemY = 306  + 66 * (y % 10);
        var item = this.add.image(itemX,itemY,this.item.Armour[y])
        item.setDisplaySize(50,50)
    }
    this.sound.play('inventory', {volume: 1, loop:false});
};