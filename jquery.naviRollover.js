/*
 * jquery.naviRollover.js ver.1.2.3
 * Author : http://2inc.org
 * created: 2011/06/14
 * modified : 2012/03/15
 * creative commons 表示 - 継承 3.0 (CC BY-SA 3.0)
 * http://creativecommons.org/licenses/by-sa/3.0/deed.ja
 *
 * 現在のページが属するカテゴリーのボタンにクラスをつけたり
 * 画像を反転させたりするjQueryプラグイン
 *
 * ナビゲーションの各リンクの最後の/を基準に各カテゴリのディレクトリを判別
 * 例：http://2inc.org/hoge/fuga/ → /fuga/ 現在のページが/fuga/以下なら処理
 *     http://2inc.org/hoge/ → /hoge/ 現在のページが/hoge/以下なら処理
 *     http://2inc.org/hoge → / 現在のページが/以下なら処理
 *
 * 判別後の処理の種類
 * type : html
 *      リンクにclassを付与
 * type : image
 *      リンク内の画像名が *_n.ext のものを、*_r.ext に置き換える
 */
( function( $ ) {
	$.fn.naviRollOver = function(config){
		var navi = this;
		var defaults = {
			'root' : false ,		// ルートパス
			'type' : 'html' ,		// タイプ(html or image)
			'keepFlg' : false,		// 見つけても処理続けるか
			'globalFlg' : false,	// true : リンクの2階層目のディレクトリで判断, false : リンクの最後のディレクトリで判断
			'tag' : 'ul:first li a',	// 処理をするhtmlタグを指定
			'className' : 'cur'			// カレントリンクに付与されるclass名
		};
		var topurl = '';	// トップページURLパス（実値）
		var setting = $.extend( defaults, config );
		var url;		// 現在のURLパス（ページ名は除く）
		var naviArr;	// ナビゲーションのタグ（リンク）の集合
		var navurl;		// ナビゲーションのURLパス
		var baseUrl;	// トップページURLパス（基準値）

		return this.each( function() {
			// 引数がちゃんとあるときだけ処理
			if ( setting.root ) {
				topurl = setting.root;
				switch ( setting.globalFlg ) {
					case true :
						// 現在のURLパスからトップ階層を省いたもの
						url = getPathUnderSecondDir( location.pathname );
						break;
					case false :
						// 現在のURLパスを取得（その階層以下のページを省くため、一番後ろの / まで）。
						url = getPathUntilLastSlash( location.pathname );
						break;
				}
				var naviArr = navi.find( setting.tag );
				$.each( naviArr, function() {
					if ( typeof this.pathname !== 'undefined' ) {
						var atag = this;
					} else if ( typeof $(this).find( 'a' ).get(0) !== 'undefined' ) {
						var atag = $(this).find( 'a' ).get(0);
					}
					if ( typeof atag !== 'undefined' && atag.hostname === location.hostname ) {
						var _pathname = atag.pathname;
						// IE用
						if ( _pathname.substring( 0, 1 ) != '/' ) {
							_pathname = '/' + _pathname;
						}
		
						// 2階層目のディレクトリを基準に、現在のページがその下位であれば処理
						// デフォルトは最後のディレクトリを基準に処理
						switch ( setting.globalFlg ) {
							case true :
								navurl = getPathUnderSecondDir( _pathname );
								baseUrl = '/';
								break;
							case false :
								navurl = getPathUntilLastSlash( _pathname );
								baseUrl = topurl;
								break;
						}
						// 一致したのが見つかったら
						if ( url.indexOf( navurl ) == 0 && navurl != baseUrl || navurl == url ) {
							switch ( setting.type ) {
								case 'html' :
									$(this).addClass( setting.className );
									break;
								case 'image' :
									var currentImg = $(this).find('img').attr('src').split( "_n", 2 );
									var newCurrentImgSrc = currentImg[0] + "_r" + currentImg[1];
									var currentImg = $(this).find('img').attr({ src: newCurrentImgSrc });
									break;
							}
							return setting.keepFlg;
						}
					}
				});
			}
		});

		/* 最後の / の位置を返す
		--------------------------------------------------*/
		function getPathUntilLastSlash( str ) {
			var c = str.lastIndexOf( "/" );			// 一番後ろの/の位置を取得（その階層以下のページを省くため）
			var path = str.substring( 0, c + 1 );	// 頭から一番後ろの/までの文字列を返す
			// /が複数ある時用
			if ( path.match( /^\/{2,}(.*)/i ) ) {
				path = '/' + RegExp.$1;
			}
			return path;
		}

		/* 引数からトップ階層を省いたものを返す
		--------------------------------------------------*/
		function getPathUnderSecondDir( str ) {
			var path = getPathUntilLastSlash( str );
			path = path.substring( topurl.length );
			var n = path.indexOf( "/" );
			path = '/' + path.substring( 0, n + 1 );
			return path;
		}
	};
})( jQuery );