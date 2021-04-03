/* menuをhiddenなど存在しない値にして表示しない
<javascriptresource>
<menu>hidden</menu>
<enableinfo>false</enableinfo>
</javascriptresource>
*/

#target photoshop

/**
 *	選択関連のユーティリティ
 */
var SelectUtility = (function ()
{
    //=======================================================================================================
    //. 初期化
    //=======================================================================================================
    function SelectUtility() {
    };
    
    var mPT = SelectUtility.prototype;
    

    //=======================================================================================================
    //. 設定
    //=======================================================================================================

    /**
     * 指定範囲を選択 - 長方形選択ツール
     *
     * @param {float} _startX (選択範囲の左基点)
     * @param {float} _startY (選択範囲の上基点)
     * @param {float} _endX (選択範囲の右基点)
     * @param {float} _endY (選択範囲の下基点)
     */
    mPT.SelectRangeSquare = function (_startX, _startY, _endX, _endY) {
        var idsetd = charIDToTypeID( "setd" );
            var desc9 = new ActionDescriptor();
            var idnull = charIDToTypeID( "null" );
                var ref2 = new ActionReference();
                var idChnl = charIDToTypeID( "Chnl" );
                var idfsel = charIDToTypeID( "fsel" );
                ref2.putProperty( idChnl, idfsel );
            desc9.putReference( idnull, ref2 );
            var idT = charIDToTypeID( "T   " );
                var desc10 = new ActionDescriptor();
                var idTop = charIDToTypeID( "Top " );
                var idPxl = charIDToTypeID( "#Pxl" );
                desc10.putUnitDouble( idTop, idPxl, _startY );
                var idLeft = charIDToTypeID( "Left" );
                var idPxl = charIDToTypeID( "#Pxl" );
                desc10.putUnitDouble( idLeft, idPxl, _startX );
                var idBtom = charIDToTypeID( "Btom" );
                var idPxl = charIDToTypeID( "#Pxl" );
                desc10.putUnitDouble( idBtom, idPxl, _endY );
                var idRght = charIDToTypeID( "Rght" );
                var idPxl = charIDToTypeID( "#Pxl" );
                desc10.putUnitDouble( idRght, idPxl, _endX );
            var idRctn = charIDToTypeID( "Rctn" );
            desc9.putObject( idT, idRctn, desc10 );
        executeAction( idsetd, desc9, DialogModes.NO );
    };

    /** 
     * 選択範囲を移動
     * @param {float} _moveX (移動距離X)
     * @param {float} _moveY (移動距離Y)
     */
    mPT.SelectTransform = function (_moveX, _moveY) {
        var idTrnf = charIDToTypeID( "Trnf" );
            var desc40 = new ActionDescriptor();
            var idnull = charIDToTypeID( "null" );
                var ref12 = new ActionReference();
                var idLyr = charIDToTypeID( "Lyr " );
                var idOrdn = charIDToTypeID( "Ordn" );
                var idTrgt = charIDToTypeID( "Trgt" );
                ref12.putEnumerated( idLyr, idOrdn, idTrgt );
            desc40.putReference( idnull, ref12 );
            var idFTcs = charIDToTypeID( "FTcs" );
            var idQCSt = charIDToTypeID( "QCSt" );
            var idQcsa = charIDToTypeID( "Qcsa" );
            desc40.putEnumerated( idFTcs, idQCSt, idQcsa );
            var idOfst = charIDToTypeID( "Ofst" );
                var desc41 = new ActionDescriptor();
                var idHrzn = charIDToTypeID( "Hrzn" );
                var idPxl = charIDToTypeID( "#Pxl" );
                desc41.putUnitDouble( idHrzn, idPxl, _moveX );
                var idVrtc = charIDToTypeID( "Vrtc" );
                var idPxl = charIDToTypeID( "#Pxl" );
                desc41.putUnitDouble( idVrtc, idPxl, _moveY );
            var idOfst = charIDToTypeID( "Ofst" );
            desc40.putObject( idOfst, idOfst, desc41 );
            var idIntr = charIDToTypeID( "Intr" );
            var idIntp = charIDToTypeID( "Intp" );
            var idBcbc = charIDToTypeID( "Bcbc" );
            desc40.putEnumerated( idIntr, idIntp, idBcbc );
        executeAction( idTrnf, desc40, DialogModes.NO );
    }
    
    return SelectUtility;
})();