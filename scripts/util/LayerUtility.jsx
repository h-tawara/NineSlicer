/* menuをhiddenなど存在しない値にして表示しない
<javascriptresource>
<menu>hidden</menu>
<enableinfo>false</enableinfo>
</javascriptresource>
*/

#target photoshop

/**
 *	レイヤー関連のユーティリティ
 */
var LayerUtility = (function (){
    //=======================================================================================================
    //. 初期化
    //=======================================================================================================
    function LayerUtility() {
    };
    
    var mPT = LayerUtility.prototype;

    //=======================================================================================================
    //. 取得
    //=======================================================================================================

    /** 
     * 選択レイヤーを取得
     * 
     * @return {Layer} (選択レイヤー)
     */
    mPT.GetSelectedLayers = function () {
        var selectLayer = [];
    
        var idGrp = stringIDToTypeID( "groupLayersEvent" );
        var descGrp = new ActionDescriptor();
        var refGrp = new ActionReference();
        refGrp.putEnumerated(charIDToTypeID( "Lyr " ),charIDToTypeID( "Ordn" ),charIDToTypeID( "Trgt" ));
        descGrp.putReference(charIDToTypeID( "null" ), refGrp );
        executeAction( idGrp, descGrp, DialogModes.ALL );

        for (var i = 0; i < app.activeDocument.activeLayer.layers.length; i++) {
            selectLayer.push(app.activeDocument.activeLayer.layers[i])
        }

        Undo();
    
        return selectLayer;
    };

    //=======================================================================================================
    //. 確認
    //=======================================================================================================

    /**
     * ドキュメント内に背景レイヤーが含まれているか？
     * 
     * @return {bool} (true = 含まれている, false = 含まれていない)
     */
    mPT.IsBackGroundLayerToDoc = function () {
        var res = false;
        var layers = activeDocument.layers;
        
        for(var i = 0; i < layers.length; i++) {
            if (layers[i].isBackgroundLayer) {
                res = true;
                break;
            }
        }
        
        return res;
    };

    //=======================================================================================================
    //. 設定
    //=======================================================================================================
    
    /** 
     * 全てのレイヤーを非表示に	
     */
    mPT.LayerAllEnable = function () {
        docObj = activeDocument;
        for (var i = 0; i < docObj.layers.length; i++) {
            docObj.layers[i].visible = false;
        }
    };

    /** 
     * 対象レイヤーのリストを全て非表示に
     *
     * @param {Array of Layers} _targetLayers (対象レイヤー)
     */
    mPT.LayerEnable = function (_targetLayers) {
        for (var i = 0; i < _targetLayers.length; i++) {
            _targetLayers[i].visible = false;
        }
    };


    /** 
     * レイヤーの表示状態を転送
     *
     * @param {Array of Layers} _targetLayers (転送先レイヤー)
     * @param {Array of Layers} _copyLayers (転送元レイヤー)
     */
    mPT.CopyLayerVisible = function (_targetLayers, _copyLayers) {
        for (var i = 0; i < _targetLayers.length; i++) {
                _targetLayers[i].visible = _copyLayers[i].visible;
        }
    };

    /** 
     * レイヤーを別ドキュメントに複製
     *
     * @param {string} _docName (対象のドキュメント名)
     */
    mPT.DuplicateLayer = function (_docName) {
        var idDplc = charIDToTypeID( "Dplc" );
            var desc = new ActionDescriptor();
            var idnull = charIDToTypeID( "null" );
                var ref1 = new ActionReference();
                var idLyr = charIDToTypeID( "Lyr " );
                var idOrdn = charIDToTypeID( "Ordn" );
                var idTrgt = charIDToTypeID( "Trgt" );
                ref1.putEnumerated( idLyr, idOrdn, idTrgt );
            desc.putReference( idnull, ref1 );
            var idT = charIDToTypeID( "T   " );
                var ref2 = new ActionReference();
                var idDcmn = charIDToTypeID( "Dcmn" );
                ref2.putName( idDcmn, _docName );
            desc.putReference( idT, ref2 );
            var idVrsn = charIDToTypeID( "Vrsn" );
            desc.putInteger( idVrsn, 5 );
            var idIdnt = charIDToTypeID( "Idnt" );
                var list1 = new ActionList();
                list1.putInteger( 2 );
            desc.putList( idIdnt, list1 );
        executeAction( idDplc, desc, DialogModes.NO );
    };
    
    /**
     * 選択レイヤーをスタンプ
     */
    mPT.LayerStampSelect = function () {
        var idMrgtwo = charIDToTypeID( "Mrg2" );
            var desc = new ActionDescriptor();
            var idDplc = charIDToTypeID( "Dplc" );
            desc.putBoolean( idDplc, true );
        executeAction( idMrgtwo, desc, DialogModes.NO );
    };
    
    /**
     * 表示状態のレイヤーをスタンプ
     */
    mPT.LayerStampVisible = function () {
        var idMrgV = charIDToTypeID( "MrgV" );
            var desc10 = new ActionDescriptor();
            var idDplc = charIDToTypeID( "Dplc" );
            desc10.putBoolean( idDplc, true );
        executeAction( idMrgV, desc10, DialogModes.NO );
    };
    
    /**
     * 指定名のレイヤーを選択
     * ※同一名のレイヤーがあると複数選択されてしまう
     *
     * @param {string} _layerName (選択したいレイヤー名)
     */
    mPT.SelectLayerName = function (_layerName){
        var idslct = charIDToTypeID( "slct" );
            var desc = new ActionDescriptor();
            var idnull = charIDToTypeID( "null" );
                var ref = new ActionReference();
                var idLyr = charIDToTypeID( "Lyr " );
                ref.putName( idLyr, _layerName);
            desc.putReference( idnull, ref );
            var idselectionModifier = stringIDToTypeID( "selectionModifier" );
            var idselectionModifierType = stringIDToTypeID( "selectionModifierType" );
            var idaddToSelection = stringIDToTypeID( "addToSelection" );
            desc.putEnumerated( idselectionModifier, idselectionModifierType, idaddToSelection );
            var idMkVs = charIDToTypeID( "MkVs" );
            desc.putBoolean( idMkVs, false );
        executeAction( idslct, desc, DialogModes.NO );
    };
    
    /**
     * 全てのレイヤーを選択
     */
    mPT.SelectLayerAll = function () {
        var desc29 = new ActionDescriptor();
            var ref23 = new ActionReference();
            ref23.putEnumerated( charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt') );
            desc29.putReference( charIDToTypeID('null'), ref23 );
        executeAction( stringIDToTypeID('selectAllLayers'), desc29, DialogModes.NO );
    }
    
    /**
     * マスク処理
     */
    mPT.Mask = function () {
        var idMk = charIDToTypeID( "Mk  " );
            var desc = new ActionDescriptor();
            var idNw = charIDToTypeID( "Nw  " );
            var idChnl = charIDToTypeID( "Chnl" );
            desc.putClass( idNw, idChnl );
            var idAt = charIDToTypeID( "At  " );
                var ref1 = new ActionReference();
                var idChnl = charIDToTypeID( "Chnl" );
                var idChnl = charIDToTypeID( "Chnl" );
                var idMsk = charIDToTypeID( "Msk " );
                ref1.putEnumerated( idChnl, idChnl, idMsk );
            desc.putReference( idAt, ref1 );
            var idUsng = charIDToTypeID( "Usng" );
            var idUsrM = charIDToTypeID( "UsrM" );
            var idRvlS = charIDToTypeID( "RvlS" );
            desc.putEnumerated( idUsng, idUsrM, idRvlS );
        executeAction( idMk, desc, DialogModes.NO );
    };
    
    /**
     * 選択レイヤーをグループ化
     */
    mPT.MakeGroupSelect = function () {
        var idMk = charIDToTypeID( "Mk  " );
                var desc3 = new ActionDescriptor();
                var idnull = charIDToTypeID( "null" );
                        var ref1 = new ActionReference();
                        var idlayerSection = stringIDToTypeID( "layerSection" );
                        ref1.putClass( idlayerSection );
                desc3.putReference( idnull, ref1 );
                var idFrom = charIDToTypeID( "From" );
                        var ref2 = new ActionReference();
                        var idLyr = charIDToTypeID( "Lyr " );
                        var idOrdn = charIDToTypeID( "Ordn" );
                        var idTrgt = charIDToTypeID( "Trgt" );
                        ref2.putEnumerated( idLyr, idOrdn, idTrgt );
                desc3.putReference( idFrom, ref2 );
                var idlayerSectionStart = stringIDToTypeID( "layerSectionStart" );
                desc3.putInteger( idlayerSectionStart, 42 );
                var idlayerSectionEnd = stringIDToTypeID( "layerSectionEnd" );
                desc3.putInteger( idlayerSectionEnd, 43 );
                var idNm = charIDToTypeID( "Nm  " );
                desc3.putString( idNm, """Group""" );
        executeAction( idMk, desc3, DialogModes.NO );
    };
    
    /**
     * 全てのレイヤーをグループ化
     */
    mPT.MakeGroupAll = function () {
        mPT.SelectLayerAll();
        mPT.MakeGroupSelect();
    };

    /**
     * 全てのレイヤーを結合
     * 
     * @param {bool} _isDupulicate (複製するか？)
     */
    mPT.MergeAllLayer = function (_isDupulicate) {
        // 背景レイヤーが含まれていたらレイヤーに変換 -> 背景レイヤーだとグループ化、スタンプが出来ないため
        if (mPT.IsBackGroundLayerToDoc()) {
            activeDocument.backgroundLayer.isBackgroundLayer = false;
        }
        
        // 全てをグループ化 -> 選択したレイヤーにロックがあるなどやレイヤー数が1以下だとスタンプ出来ないため
        mPT.MakeGroupAll();

        // 複製するか？
        if (_isDupulicate) {
            mPT.LayerStampVisible();
        } else {
            activeDocument.activeLayer.merge();
        }
    };
    
    return LayerUtility;
})();