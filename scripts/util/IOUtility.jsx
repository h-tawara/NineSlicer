/* menuをhiddenなど存在しない値にして表示しない
<javascriptresource>
<menu>hidden</menu>
<enableinfo>false</enableinfo>
</javascriptresource>
*/

#target photoshop

/**
 *	入出力関連のユーティリティ
 */
var IOUtility = (function ()
{
    //=======================================================================================================
    //. 初期化
    //=======================================================================================================
    function IOUtility() {
    };
    
    var mPT = IOUtility.prototype;
    
    //=======================================================================================================
    //. ファイル関連
    //=======================================================================================================

    //=======================================================================================================
    //. 設定
    //=======================================================================================================

    /** 
     * ファイルの復帰処理	
     */
    mPT.Revert = function () {
        var idRvrt = charIDToTypeID( "Rvrt" );
        executeAction( idRvrt, undefined, DialogModes.NO );
    };

    //=======================================================================================================
    //. 取得
    //=======================================================================================================

    /** 
     * 拡張子を除去
     * 
     * @param {string} _str (対象文字列)
     * @return {string} (除去後の文字列)
     */
    mPT.RemoveFileExtension = function (_str) {
        var reg=/(.*)(?:\.([^.]+$))/;
        var res = (_str.match (reg)[1]);
        
        return res;
    };


    //=======================================================================================================
    //. フォルダ関連
    //=======================================================================================================

    //=======================================================================================================
    //. 設定
    //=======================================================================================================

    /** 
     * フォルダの作成処理
     * 
     * @param {string} _path (作成するフォルダパス)
     */
    mPT.MakeFolder = function (_path) {
        var folderObj = new Folder(_path);
            
        // フォルダが存在しなければ
        if(!folderObj.exists) {
            folderObj.create();
        }
    };

    /** 
     * フォルダの選択処理
     *
     * @return {string} targetFolder (選択したフォルダパス)	
     */
    mPT.FolderReference = function () {
        targetFolder = Folder.selectDialog("フォルダを指定してください");

        return targetFolder;
    };

    /** 
     * フォルダ内のファイルを開く
     * 
     * @param {string} _folderPath (開く対象のフォルダ)
     */
    mPT.OpenFileList = function (_folderPath) {
        var fileList = [].concat(
            _folderPath.getFiles('*.psd') ,
            _folderPath.getFiles('*.png') ,
            _folderPath.getFiles('*.jpe?g') ,
        );
        
        for (var i = 0; i < fileList.length; i++) {
            var fileObj = new File(fileList[i]);
            app.open(fileObj);
        }
    };
    
    //=======================================================================================================
    //. 保存関連
    //=======================================================================================================

    /** 
     * PNG形式で保存
     * 
     * @param {string} _path (保存パス)
     */
    mPT.SavePNG = function (_path) {
        var saveFileObj = new File(_path);
        var pngOpt = new PNGSaveOptions();	//PNGの設定
        pngOpt.interlaced = false;  //インターレースなし
        activeDocument.saveAs (saveFileObj, pngOpt, true, Extension.LOWERCASE)
    };

    
    /** 
     * PSD形式で保存
     * 
     * @param {string} _path (保存パス)
     */
    mPT.SavePSD = function (_path) {
        var saveFileObj = new File(_path);
        var psdOpt = new PhotoshopSaveOptions();
        psdOpt.alphaChannels = true;
        psdOpt.annotations = true;
        psdOpt.embedColorProfile = false;
        psdOpt.layers = true;
        psdOpt.spotColors = false;
        activeDocument.saveAs(saveFileObj, psdOpt, true, Extension.LOWERCASE);
    };

    /** 
     * テキストファイルの生成
     * @param {string} _path (ファイルの保存パス)
     * @param {string} _name (ファイルの保存名)
     * @param {string} _strData (ファイルの内容)
     */
	mPT.ExportText = function (_path, _name, _strData) {
		var fileName = _path + "/" + _name + ".txt";
		var file = new File(fileName);
		var isOpen = file.open("w");
		
		if (isOpen == true) {
			file.write(_strData);
			file.close();
		} else {
			alert("ファイルの読み込みに失敗しました");
		}
	};	

    return IOUtility;
})();