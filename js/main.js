var mainScene = new Phaser.Scene("mainScene");

mainScene.create = function () {
    // 初期設定メソッド呼び出し
    this.config();
    
    // 背景色の設定
    this.cameras.main.setBackgroundColor('#99CCFF');
    
    // メインシーン
    this.add.text(300, 300, "This is Template",{
        font : "30px Open Sans",
        fill : "#ff0000",
    });
};

mainScene.update = function() {
    
};

mainScene.config = function () {

};
