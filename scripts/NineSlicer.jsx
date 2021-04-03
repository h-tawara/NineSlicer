/*########################################################################################################################
#	9スライス画像を作成するツール(ガイドを指定)
#		@author h.tawara <http://artawa.hatenablog.com/>
########################################################################################################################*/

//================================================================================
#target photoshop

#include "LayerUtility.jsx";
#include "SelectUtility.jsx";
#include "GuideUtility.jsx";
#include "IOUtility.jsx";

//================================================================================
var NineSlicer = (function() {
	
	//================================================================================
	// 定数
	//================================================================================
	// 出力関連
	const NAME_EXPORT_FOLDER = "export";
	
	//================================================================================
	// コンストラクタ
	//================================================================================
	var NineSlicer = function () {
	};

	var mPT = NineSlicer.prototype;	// プロトタイプ

	//================================================================================
	// 内部クラス
	//================================================================================
	
	// スライスの範囲
	var SliceArea = function (_startX, _startY, _endX, _endY) {
		this.startX = _startX;
		this.startY = _startY;
		this.endX = _endX;
		this.endY = _endY;
	};
	
	//================================================================================
	// 汎用クラス	
	//================================================================================
	var layerUtil = new LayerUtility();
	var selectUtil = new SelectUtility();
	var guideUtil = new GuideUtility();
	var ioUtil = new IOUtility();
	
	//================================================================================
	// メイン処理
	//================================================================================
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

	//================================================================================
	// ドキュメントチェック
	//================================================================================
	mPT.DocumentCheck = function () {
		if (documents < 1) {
			alert("ドキュメントを開いてから実行してください。");
			return false;
		}

		return true;
	};
	
	//================================================================================
	// ガイド設定チェック
	//================================================================================
	mPT.GuideCheck = function (_guidesX, _guidesY) {
		// ガイドが設定されているか？
		if (app.activeDocument.guides.length == 0) {
			alert("ガイドが設定されていません。\nガイドを設定してください。");
			return false;
		}
		// 縦ラインガイドのチェック
		if (!(_guidesX.length == 2 || _guidesX.length == 0)) {
			alert("\n縦ラインのガイドは2つ設定してください。");
			return false;
		}
		// 横ラインガイドのチェック
		if (!(_guidesY.length == 2 || _guidesY.length == 0)) {
			alert("\n横ラインのガイドは2つ設定してください。");
			return false;
		}
	
		return true;
	}

	//================================================================================
	// スライスの範囲を設定
	//================================================================================
	mPT.SetSliceArea = function (_guidesX, _guidesY) {
		var sliceArea = new SliceArea (0, 0, 0, 0);

		// Xの反映を設定
		if (_guidesX.length != 0) {
			var valueA = _guidesX[0].coordinate.value;
			var valueB = _guidesX[1].coordinate.value;
			
			if (valueA > valueB) {
				sliceArea.startX = valueB;
				sliceArea.endX = valueA;
			} else {
				sliceArea.startX = valueA;
				sliceArea.endX = valueB;
			}
		}

		// Yの反映を設定
		if (_guidesY.length != 0) {
			var valueA = _guidesY[0].coordinate.value;
			var valueB = _guidesY[1].coordinate.value;

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

	//================================================================================
	// スライス範囲のセルを除去
	//================================================================================
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
	
	//================================================================================
	// スライス除去分の移動処理
	//================================================================================	
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


//########################################################################################################################
// 実行部
var instance = new NineSlicer();
app.activeDocument.suspendHistory("NineSlicer", "instance.Main()");