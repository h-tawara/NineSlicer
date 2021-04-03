/**
 * 9スライス画像を作成するツール(ガイドを指定)
 * @author h-tawara <https://www.omusubi-tech.com/>
 */

#target photoshop

#include "util/LayerUtility.jsx";
#include "util/SelectUtility.jsx";
#include "util/GuideUtility.jsx";
#include "util/IOUtility.jsx";

var NineSlicer = (function()
{
    //=======================================================================================================
    //. 定数
    //=======================================================================================================

    const NAME_EXPORT_FOLDER = "export";
    
    //=======================================================================================================
    //. 初期化
    //=======================================================================================================

    /**
     * コンストラクタ
     */
    var NineSlicer = function () {
    };

    // プロトタイプ
    var mPT = NineSlicer.prototype;

    //=======================================================================================================
    //. 内部クラス
    //=======================================================================================================
    
    /**
     * スライスの範囲
     */
    var SliceArea = function (_startX, _startY, _endX, _endY) {
        this.startX = _startX;
        this.startY = _startY;
        this.endX = _endX;
        this.endY = _endY;
    };
    
    //=======================================================================================================
    //. 汎用クラス
    //=======================================================================================================
    var layerUtil = new LayerUtility();
    var selectUtil = new SelectUtility();
    var guideUtil = new GuideUtility();
    var ioUtil = new IOUtility();
    
    //=======================================================================================================
    //. 設定
    //=======================================================================================================

    /**
     * メイン処理
     */
    mPT.Main = function () {
        if (mPT.DocumentCheck()) {
            var guidesX = guideUtil.GetGuidesVertical();
            var guidesY= guideUtil.GetGuidesHorizontal();
        
            if (mPT.GuideCheck(guidesX, guidesY)) {
                // 単位設定を保持＋Pixelに変換 -> 単位違いのズレ防止
                var myRulerUnits = preferences.rulerUnits;
                preferences.rulerUnits = Units.PIXELS;
                
                var sliceArea = mPT.SetSliceArea(guidesX, guidesY);
                
                layerUtil.MergeAllLayer(false);
            
                // スライス処理
                mPT.DeleteSliceArea(sliceArea);
                mPT.MoveSlice(sliceArea);
                
                // アルファでトリミング
                activeDocument.trim(TrimType.TRANSPARENT, true, true, true, true);
                
                // 書き出しフォルダを作成して保存
                var path = activeDocument.path + "/" + NAME_EXPORT_FOLDER;
                ioUtil.MakeFolder(path);
                path = path + "/" + ioUtil.RemoveFileExtension(activeDocument.name);
                ioUtil.SavePNG(path);
                
                activeDocument.selection.deselect();				
                
                // 単位設定を元に戻す
                preferences.rulerUnits = myRulerUnits;
                
                alert("スライスが完了しました。", "完了");
            }
        }
    };

    /**
     * ドキュメントが開かれているか？
     * 
     * @return {bool} (true = 開かれている, false = いない)
     */
    mPT.DocumentCheck = function () {
        if (documents < 1) {
            alert("ドキュメントを開いてから実行してください。");
            return false;
        }

        return true;
    };
    
    /**
     * ガイド設定チェック
     * 
     * @param {Array of Guides} _guidesVer 縦ラインのガイドリスト
     * @param {Array of Guides} _guidesHor 横ラインのガイドリスト
     * 
     * @return {bool} (true = 設定されている, false = されていない)
     */
    mPT.GuideCheck = function (_guidesVer, _guidesHor) {
        if (app.activeDocument.guides.length == 0) {
            alert("ガイドが設定されていません。\nガイドを設定してください。");
            return false;
        }
        if (!(_guidesVer.length == 2 || _guidesVer.length == 0)) {
            alert("\n縦ラインのガイドは2つ設定してください。");
            return false;
        }
        if (!(_guidesHor.length == 2 || _guidesHor.length == 0)) {
            alert("\n横ラインのガイドは2つ設定してください。");
            return false;
        }
    
        return true;
    }

    /**
     * スライスの範囲を設定
     *
     * @param {Array of Guides} _guidesVer 縦ラインのガイドリスト
     * @param {Array of Guides} _guidesHor 横ラインのガイドリスト
     *
     * @return {SliceArea} (スライスの範囲)
     */
    mPT.SetSliceArea = function (_guidesVer, _guidesHor) {
        var sliceArea = new SliceArea (0, 0, 0, 0);

        // Xの反映を設定
        if (_guidesVer.length != 0) {
            var valueA = _guidesVer[0].coordinate.value;
            var valueB = _guidesVer[1].coordinate.value;
            
            if (valueA > valueB) {
                sliceArea.startX = valueB;
                sliceArea.endX = valueA;
            } else {
                sliceArea.startX = valueA;
                sliceArea.endX = valueB;
            }
        }

        // Yの反映を設定
        if (_guidesHor.length != 0) {
            var valueA = _guidesHor[0].coordinate.value;
            var valueB = _guidesHor[1].coordinate.value;

            if (valueA > valueB) {
                sliceArea.startY = valueB;
                sliceArea.endY = valueA;
            } else {
                sliceArea.startY = valueA;
                sliceArea.endY = valueB;
            }
        }
    
        return sliceArea;
    };

    /**
     * スライス範囲のセルを除去
     * 
     * @param {SliceArea} _sliceArea (スライス範囲)
     */
    mPT.DeleteSliceArea = function (_sliceArea) {
        var width = activeDocument.width;
        var height = activeDocument.height;
        
        // Xの範囲を除去
        if (!(_sliceArea.startX == 0 && _sliceArea.endX == 0)) {
            selectUtil.SelectRangeSquare(_sliceArea.startX, 0, _sliceArea.endX, height);
            activeDocument.selection.clear();
        }
        
        // Yの範囲を除去
        if (!(_sliceArea.startY == 0 && _sliceArea.endY == 0)) {
            selectUtil.SelectRangeSquare(0, _sliceArea.startY, width, _sliceArea.endY);
            activeDocument.selection.clear();
        }
    }

    /**
     * スライス除去分の移動処理
     * 
     * @param {SliceArea} _sliceArea (スライス範囲)
     */
    mPT.MoveSlice = function (_sliceArea) {
        var width = activeDocument.width;
        var height = activeDocument.height;

        // Xの移動処理
        var moveX = _sliceArea.endX - _sliceArea.startX;
        selectUtil.SelectRangeSquare(_sliceArea.endX, 0, width, height);
        selectUtil.SelectTransform(-moveX, 0);
        
        // Yの移動処理
        var moveY = _sliceArea.endY - _sliceArea.startY;
        selectUtil.SelectRangeSquare(0, _sliceArea.endY, width, height);
        selectUtil.SelectTransform(0, -moveY);
    }
    
    return NineSlicer;
})();


//=======================================================================================================
//. 実行部
//=======================================================================================================
var instance = new NineSlicer();
app.activeDocument.suspendHistory("NineSlicer", "instance.Main()");