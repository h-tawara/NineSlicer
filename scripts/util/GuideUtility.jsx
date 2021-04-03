/* menuをhiddenなど存在しない値にして表示しない
<javascriptresource>
<menu>hidden</menu>
<enableinfo>false</enableinfo>
</javascriptresource>
*/

#target photoshop

/**
 *	ガイド関連のユーティリティ
 */
var GuideUtility = (function ()
{
	//=======================================================================================================
	//. 初期化
	//=======================================================================================================
	function GuideUtility() {
	};
	
	var mPT = GuideUtility.prototype;
	
	//=======================================================================================================
	//. 取得
	//=======================================================================================================

	/**
	 *	ドキュメントに指定されているガイドを取得
	 *
	 *	@return {Array of Guides} (設定されている全てのガイド)
	 */
	mPT.GetAllGuide = function () {
		return app.activeDocument.guides;
	};

	/**
	 *	ドキュメントに指定されている縦方向ガイドを取得
	 *
	 *	@return {Array of Guides} (設定されている縦方向のガイド)
	 */
	mPT.GetGuidesVertical = function () {
		var guides = app.activeDocument.guides;
		var guidesVertical = [];
		
		for (var i =0; i < guides.length; i++) {
			if (guides[i].direction == Direction.VERTICAL) {
				guidesVertical.push(guides[i]);
			}
		}
		
		return guidesVertical;
	};
	
	/**
	 *	ドキュメントに指定されている横方向ガイドを取得
	 *
	 *	@return {Array of Guides} (設定されている横方向のガイド)
	 */
	mPT.GetGuidesHorizontal = function () {
		var guides = app.activeDocument.guides;
		var guidesHorizontal = [];
		
		for (var i =0; i < guides.length; i++) {
			if (guides[i].direction == Direction.HORIZONTAL) {
				guidesHorizontal.push(guides[i]);
			}
		}
		
		return guidesHorizontal;
	};
	
	return GuideUtility;
})();