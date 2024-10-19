var shopScene = new Phaser.Scene("Shop");
shopScene.preload = function() {
    // テキストエリアを表示するプラグインの導入
    this.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');

};
shopScene.create = function (data) {
    // スリープが解除されたときに呼ぶメソッドを定義
    this.events.on("wake", this.onWake, this);
    this.input.on('pointerdown', this.onPointerDown, this);
    this.item = data.item
    this.money = data.money
    
    
};
shopScene.update = function() {
};
shopScene.onPointerDown = function(pointer , over) {
    if(!(pointer.position.x > 330 && pointer.position.x < 1130 && pointer.position.y > 142.5 && pointer.position.y < 142.5)){
        this.scene.sleep("Shop");
        this.scene.wake("mainScene", {
            'item' : this.item,
            'money' : this.money,
        });
    }
};
shopScene.drawBackground = function(){
    // シーン全体の背景色 黒の透過画面
    this.cameras.main.setBackgroundColor();
    // 画面中央の灰色の枠を透過画面で表示
    this.rectangle = this.add.rectangle(0, 0, 800, 600, 0xf1f1f1, 0.8).setOrigin(0,0);
    // カメラの中心を移動
    this.cameras.main.centerOn(400, 300);
};
shopScene.onWake = function(sys, data) {
    this.drawBackground();
    var shopImage = this.add.image(400,300,'GunShop');
    shopImage.displayWidth = 800;
    shopImage.displayHeight = 600;
    // メインシーンからデータを受け取る
    this.item = data.item;


    this.money = data.money;
    this.sound.play('Shop', {volume: 1, loop:false});
    this.createProduct();
    this.createTextArea();
};
shopScene.createProduct = function() {
    this.ProductOnSale = {
        "Bat" : {
            Price:"50",
        },
        "Knife":{
            Price:"100",
        },
        "CheapSword":{
            Price: "500",
        },
        "Glock17":{
            Price: "1000",
        },
        "MAC11":{
            Price: "1500",
        }, 
        "G36K":{
            Price: "2000",
        }
    };
    
}
shopScene.createTextArea = function() {
     // スクロールボックスに追加するデータを設定
     var items = this.createItems(1);
     
    // スクロールパネルを作成
    var scrollablePanel = this.rexUI.add.scrollablePanel({
        x: 400, y: 300,
        width: 300, height: 420,

        scrollMode: 0,

        background: this.rexUI.add.roundRectangle({
            radius: 20,
            color: '0x4e342e'
        }),

        panel: {
            // スクロールパネル内のパネルを作成。関数を呼び出している
            child: this.createGrid(this, items, 2),
            mask: {
                padding: 2,
            },
        },

        slider: {
            track: this.rexUI.add.roundRectangle({
                width: 20,
                radius: 10,
                color: '0x260e04'
            }),
            thumb: this.rexUI.add.roundRectangle({
                radius: 13,
                color: '0x7b5e57'
            }),
        },

        space: {
            left: 20,
            right: 20,
            top: 20,
            bottom: 20,
            panel: 10,
        }
    })
    .layout()
    
    scrollablePanel.setChildrenInteractive({
            targets: [
                scrollablePanel.getByName('table', true),
            ]
        })
            .on('child.down', function (child) {
                var item = child.children[2].text
                if (!item) {
                    return;
                }
                //purchase code
                if(this.money >= this.ProductOnSale[item].Price){
                    this.money -= this.ProductOnSale[item].Price;
                    this.item.Bag[this.item.Bag.length] = item;
                    this.sound.play('Buy', {volume: 1, loop:false});
                }else{
                    this.sound.play('Cancel', {volume: 1, loop:false});
                    return;
                }
                
            }, this)
            .on('child.over', function (child, pointer) {
                var item = child.children[2].text
                if (!item) {
                    return;
                }
                //Price view
                var X = child.children[2].x
                var Y = child.children[2].y
                var price = this.ProductOnSale[item].Price;
                price = "$" + price;
                this.PriceView = this.add.text(X, Y, price, { color: '#FFFF00', fontSize: '45px' ,fontFamily: 'gtaFontNormal'});
                
            }, this)
            .on('child.out', function (child, pointer) {
                var item = child.children[2].text
                if (!item) {
                    return;
                }
                //Price view
                this.PriceView.destroy();
                
            }, this)
    
};

shopScene.createItems = function (count, productName) {
    var data = [];
    for(z in this.ProductOnSale){
        for (var i = 0; i < count; i++) {
            data.push({
                id: z,
                textureKey: z,
            });
        }
    }
    return data;
}

shopScene.createGrid = function (scene, items, col) {
    if (col === undefined) {
        col = 1;
    }

    return scene.rexUI.add.gridSizer({
        column: col,
        row: Math.ceil(items.length / col),

        columnProportions: 1,

        createCellContainerCallback: function (scene, x, y, config, gridSizer) {
            config.expand = true;

            var item = items[(y * col) + x];
            var cellContainer = shopScene.createCellContainer(scene, item);
            if (item) {
                cellContainer.getElement('icon').setTexture(item.textureKey).setTint(item.color).setDisplaySize(75,75);
                cellContainer.getElement('id').setText(item.id);
            }
            return cellContainer;
        },

        name: 'table'
    })
}
shopScene.createCellContainer = function (scene, item) {
    return scene.rexUI.add.overlapSizer({
        height: 80
    })
        .addBackground(scene.rexUI.add.roundRectangle(0, 0, 20, 20, 0).setStrokeStyle(2, '0x260e04'))
        .add(
            scene.add.image(0, 0, ''),
            { key: 'icon', align: 'center', expand: false }
        )
        .add(
            scene.add.text(0, 0, '', {fontSize: '17px'}),
            { key: 'id', align: 'left-top', expand: false }
        )
}