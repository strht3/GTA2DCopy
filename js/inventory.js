// スタート画面のシーン
var inventoryScene = new Phaser.Scene("Inventory");

inventoryScene.create = function (data) {
    //background
    this.drawBackground();
    //key settings
    this.keys = {};
    this.keys.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    
    // スリープが解除されたときに呼ぶメソッドを定義
    this.events.on("wake", this.onWake, this);
    this.input.on('pointerdown', this.onPointerDown, this);
    //inventory images
    this.item = data.item
    this.money = data.money
};
inventoryScene.update = function() {
};
inventoryScene.onPointerDown = function(pointer , over) {
    //if clicked outside the box, close scene + send all datas
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
    var allSprites = this.children.list.filter(x => x instanceof Phaser.GameObjects.Image)
    allSprites.forEach(x => x.destroy());
    // メインシーンからデータを受け取る
    this.item = data.item;
    this.money = data.money;
    var inventoryImage = this.add.image(400,300,'inventory');
    inventoryImage.displayWidth = 800;
    inventoryImage.displayHeight = 600;
    for (var i in this.item.Bag) {
        //calculation of position of items + Placing images
        var itemX = 30 + 59 * (i % 10);
        var itemY = 240 + 66 * Math.floor(i / 10);
        var item = this.add.image(itemX,itemY,this.item.Bag[i])
        item.setDisplaySize(50,50)
        item.originalPositionX = item.x;
        item.originalPositionY = item.y;
        item.setInteractive({ draggable: true });
        item.PlaceNum = i;
        
        // イベントを1回だけにしても、複数回ドラッグエンドイベントが呼ばれることがあったため、
        // 同じアイテムは一度しか呼ばないようにisSetでHandにセットしたかどうかを管理
        item.isSet = false;
        
        /* イベントは、1回セットするだけで有効だったため、for文の外に出しました。
           これのせいでドラッグした後に、何回もアイテムが消えたりしていたようです
        
        // ドラッグイベント：ドラッグをした時に実行される
        this.input.on('drag', (pointer, item, dragX, dragY) => {
            this.moveItemByDrug(pointer, dragX, dragY, item);
        });
        // ドラッグエンドイベント：ドラッグが終わった時に実行される
        this.input.on('dragend', (pointer, item, dragX, dragY) => {
            this.setItemPositionByDrug(pointer, dragX, dragY, item,i);
        });
        */
    }
    // ドラッグイベント：ドラッグをした時に実行される
    this.input.on('drag', (pointer, item, dragX, dragY) => {
        this.moveItemByDrug(pointer, dragX, dragY, item);
    });
    // ドラッグエンドイベント：ドラッグが終わった時に実行される
    this.input.on('dragend', (pointer, item, dragX, dragY) => {
        this.setItemPositionByDrug(pointer, dragX, dragY, item);
    }); 
    
    for (var x in this.item.Hand) {
        //calculation of position of items + Placing images
        var itemX = 535 + 59 * (x % 10);
        var itemY = 43
        var item = this.add.image(itemX,itemY,this.item.Hand[x])
        item.setDisplaySize(50,50)
    }
    for (var y in this.item.Armour) {
        //calculation of position of items + Placing images
        var itemX = 771
        var itemY = 306  + 66 * (y % 10);
        var item = this.add.image(itemX,itemY,this.item.Armour[y])
        item.setDisplaySize(50,50)
    }
    this.sound.play('inventory', {volume: 1, loop:false});
};
inventoryScene.moveItemByDrug = function(pointer, dragX, dragY, item) {
    item.x = dragX;
    item.y = dragY;
}
inventoryScene.setItemPositionByDrug = function(pointer, dragX, dragY, item,i) {
    if (pointer.x >= 854 && pointer.x <= 906 && pointer.y >= 144 && pointer.y <= 205) {
        // 特定の場所までドラッグしたら移動
        item.x = 551;
        item.y = 31.5;//142.5
        if(inventoryScene.item.Hand.length >= 5){
            return;
        }
        //inventoryScene.item.Hand[this.item.Hand.length] = item.texture.key;
        
        // アイテムがHandに未セットの時だけアイテムの移動を行う
        if (!item.isSet) {
            // 一度Handにセットしたら、isSetをtrueに変更
            item.isSet = true;
            inventoryScene.item.Hand.push(item.texture.key)
            inventoryScene.item.Bag.splice( item.PlaceNum, 1 );
            localStorage.setItem('items',JSON.stringify(this.item));
        }
    } else if(pointer.x >= 912 && pointer.x <= 965 && pointer.y >= 144 && pointer.y <= 204){
        // 特定の場所までドラッグしたら移動
        item.x = 609;
        item.y = 31.5;
        if(inventoryScene.item.Hand.length >= 5){
            return;
        }
        
        // アイテムがHandに未セットの時だけアイテムの移動を行う
        if (!item.isSet) {
            // 一度Handにセットしたら、isSetをtrueに変更
            item.isSet = true;
            inventoryScene.item.Hand.push(item.texture.key)
            inventoryScene.item.Bag.splice( item.PlaceNum, 1 );
            localStorage.setItem('items',JSON.stringify(this.item));
        }
    } else if(pointer.x >= 972 && pointer.x <= 1022 && pointer.y >= 144 && pointer.y <= 204){
        // 特定の場所までドラッグしたら移動
        item.x = 665;
        item.y = 31.5;
        if(inventoryScene.item.Hand.length >= 5){
            return;
        }
        
        // アイテムがHandに未セットの時だけアイテムの移動を行う
        if (!item.isSet) {
            // 一度Handにセットしたら、isSetをtrueに変更
            item.isSet = true;
            inventoryScene.item.Hand.push(item.texture.key)
            inventoryScene.item.Bag.splice( item.PlaceNum, 1 );
            localStorage.setItem('items',JSON.stringify(this.item));
        }
    } else if(pointer.x >= 1030 && pointer.x <= 1083 && pointer.y >= 144 && pointer.y <= 204){
        // 特定の場所までドラッグしたら移動
        item.x = 725;
        item.y = 31.5;
        if(inventoryScene.item.Hand.length >= 5){
            return;
        }
        
        // アイテムがHandに未セットの時だけアイテムの移動を行う
        if (!item.isSet) {
            // 一度Handにセットしたら、isSetをtrueに変更
            item.isSet = true;
            inventoryScene.item.Hand.push(item.texture.key)
            inventoryScene.item.Bag.splice( item.PlaceNum, 1 );
            localStorage.setItem('items',JSON.stringify(this.item));
        }
    } else if(pointer.x >= 1088 && pointer.x <= 1141 && pointer.y >= 144 && pointer.y <= 204){
        // 特定の場所までドラッグしたら移動
        item.x = 785;
        item.y = 31.5;
        if(inventoryScene.item.Hand.length >= 5){
            return;
        }
        
        // アイテムがHandに未セットの時だけアイテムの移動を行う
        if (!item.isSet) {
            // 一度Handにセットしたら、isSetをtrueに変更
            item.isSet = true;
            inventoryScene.item.Hand.push(item.texture.key)
            inventoryScene.item.Bag.splice( item.PlaceNum, 1 );
            localStorage.setItem('items',JSON.stringify(this.item));
        }
    } else {
        // それ以外はスタート位置に戻す
        item.x = item.originalPositionX;
        item.y = item.originalPositionY;
    }
}
