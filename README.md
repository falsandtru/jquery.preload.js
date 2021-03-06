# preload
preloadはユーザーが次に見るページを予測して先読み（事前読み込み）することでページ移動を高速化します。

## 概要
カーソルの位置と動きからユーザーが次に開くページ（リンク）を予測しajaxにより事前に先読みすることでブラウザとサーバーにあらかじめキャッシュを生成しページ移動を高速化します。

```javascript
$.preload();
```

## ブラウザサポート

* IE8+
* Firefox
* Chrome
* Safari

## 特徴

* プリロードのajax処理を中断せずpjaxに引き継げるため最短でページ移動が可能です。
* リクエストとトラフィックが最小限になるよう最適化しています。
* カーソルがリンク上にあるときのみ予測を行うため軽量です。
* プリロード数の上限と時間経過による回復を設定できます。
* プリロードの完了までページ移動を待機することができます。
* <a href="https://github.com/falsandtru/jquery-pjax">pjax</a>と組み合わせて使用できます。

## 対応

* jQuery1.4.2+
* 複数登録
* プリロード数の上限設定
* プリロード数の時間回復
* プリロードの実行間隔の設定
* プリロード中のリンクのロック
* <a href="https://github.com/falsandtru/jquery-pjax">pjax</a>との連携。

## preload + pjax
GoogleやAmazonが示すように、ページのロードタイムを1秒前後にまで改善したあとさらに短くする0.1秒には莫大な価値があります。preloadとpjaxはこの価値を約0.5秒分提供します。

preloadとpjaxの複合利用は、スクリプトファイルを置くだけでページの表示(移動)にかかる時間を約0.5秒短縮する手軽で効果の高い高速化手法です。ここで使用するpjaxは高度に自動化されているためHTMLやCSSがページごとにバラバラでも動作します。スクリプトと動的に追加される要素には注意が必要ですがpjaxの`load.reload`と`load.ignore`パラメータを調整するだけでプラグインを数十個入れたWordpressのような複雑なサイトでも快適に使用できますし、ユーザーJSとしてさえ動作します。ただし、タッチ操作ではpreloadを使用できず効果がいまひとつのため無効にします。

ページロードがどれだけ速くなったかをコンソールの出力から確認できます。以下の出力はクリックの310ミリ秒前にリンク先のページの取得を開始し、クリックから450ミリ秒で表示されたときのものです。

```
[-310, 1, 361, 379, 403, 424, 450, 486, 487, 491]
["preload(-310)", "continue(1)", "load(361)", "parse(379)", "head(403)", "content(424)", "css(450)", "script(486)", "renderd(487)", "defer(491)"]
```

※jQuery1.6+
※Windows7+Chrome

通常はリンクのクリックからHTMLファイルのダウンロード完了まで0.5～1秒、ページの表示（DOMロード）にさらに1秒の合計2秒前後かかるページ移動をpreload+pjaxではクリックからページの表示まで0.5秒（500ミリ秒）前後で完了することができます。詳細な設定項目は<a href="https://github.com/falsandtru/jquery-preload">preload</a>と<a href="https://github.com/falsandtru/jquery-pjax">pjax</a>の各ドキュメントに記載しています。PCでは多分これが一番速いと思います。

|パターン|HTMLダウンロード|DOMロード|合計|
|:---|:--:|:--:|:--:|
|Normal|500-1000ms|800-1600ms|1300-2600ms|
|preload+pjax|0-700ms|50-100ms|50-800ms|

jQueryとスクリプトを3つ追加するだけで動作します。

```html
<script charset="utf-8" src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script charset="utf-8" src="/lib/jquery.preload.js"></script>
<script charset="utf-8" src="/lib/jquery.pjax.js"></script>
<script charset="utf-8" src="/lib/accelerate.js"></script>
```

preload: [https://github.com/falsandtru/jquery-preload](https://github.com/falsandtru/jquery-preload)  
pjax: [https://github.com/falsandtru/jquery-pjax](https://github.com/falsandtru/jquery-pjax)

```javascript
// accelerate.js
if (!/touch|tablet|mobile|phone|android|iphone|ipad|blackberry/i.test(window.navigator.userAgent)) {
  $.preload({
    forward: $.pjax.follow,
    check: $.pjax.getCache,
    encode: true,
    ajax: {
      success: function ( data, textStatus, XMLHttpRequest ) {
        !$.pjax.getCache( this.url ) && $.pjax.setCache( this.url, null, textStatus, XMLHttpRequest );
      }
    }
  });

  $.pjax({
    area: 'body',
    load: { css: true, script: true },
    cache: { click: true, submit: false, popstate: true },
    speedcheck: true
  });

  $(document).bind('pjax.ready', function() {$(document).trigger('preload');});
}
```

## 使用法
プリロードにより高速化するためにはユーザーがカーソルを合わせてからクリックするまでの時間＋ロック時間内にプリロードが完了しなければならず、HTMLのダウンロードに要する時間（表示に要する時間ではない）をあらかじめ高速化しロック時間を平均ダウンロード時間より大きく設定する必要があります。平均ダウンロード時間が1秒を大きく超える場合はかえってページ移動が遅くなる可能性が高くなります。ダウンロード時間はブラウザのデベロッパーツールのネットワークタブなどで確認できます。

なお`forward`メソッドによりpjaxと連携させた場合はajax処理を中断しないためこの制限がありません。

### jQuery
v1.7.2の使用を推奨します。

v1.4.2から動作します。

### Register

#### *$.preload( [ Setting as object ] )*
#### *$().preload( [ Setting as object ] )*
コンテキスト内のリンク（アンカー要素）のプリロードの予測を有効にします。コンテキストが設定されなかった場合は`document`がコンテキストに設定されます。

```javascript
$.preload();
$(document).preload();
```

### Parameter
パラメータはすべてパラメータ用オブジェクトのプロパティに設定して渡します。パラメータとなるオブジェクトのプロパティは以下のとおりです。

#### *ns: Namespace as string*
ネームスペースを設定します。プリロードを複数登録する場合は設定が必要です。初期値は`null`です。

#### *link: Selector as string*
コンテキスト内でプリロードの対象となるリンクをjQueryセレクタで設定します。初期値は`a:not([target])`です。

#### *filter: Selector as string / function*
プリロードの対象となるリンクを絞り込むjQueryセレクタまたは関数を設定します。初期値は`function(){return /^https?:/.test(this.href) && /(\/[^.]*|\.html?|\.php)([#?].*)?$/.test(this.href);}`です。

#### *lock: Millisecond as number*
プリロード中にプリロードの対象となるリンクをロックする時間をミリ秒で設定します。ロック中のクリックはajax処理を外部に引き渡した場合を除きプリロードの完了またはロック時間が経過するまで保留されます。初期値は`1000`です。

#### *forward: function( event, ajax [, host ] )*
プリロード中にリンクがクリックされた場合にajax処理を引き継がせるための関数を設定します。引継ぎはリンクがロック中であるかにかかわらず直ちに行われます。第二引数は`$.ajax()`の戻り値、第三引数は異なるホストへリクエストしている場合に設定されます。戻り値に`false`を設定すると引継ぎをキャンセルします。初期値は`null`です。

#### *check: function( url )*
プリロードを実行するかを戻り値により設定します。コンテキストにプリロードの対象となるDOM要素が与えられます。戻り値が真偽値に変換して真であればすでにプリロード済みであるかにかかわらずプリロードを実行、偽であれば中止します。プリロード済みのページを再度キャッシュしたい場合に有用です。初期値は`null`です。

#### *balance.host: function()*
リクエスト先のホストを戻り値で設定します。初期値は`null`です。

#### *balance.ajax: function()*
ロードバランス時のAjax設定を設定します。初期値は`{ beforeSend: null }`です。

#### *interval: Millisecond as numbery*
プリロードの実行間隔をミリ秒で設定します。初期値は`1000`です。

#### *limit: number*
プリロードの実行回数の上限を設定します。初期値は`2`です。

#### *cooldown: Millisecond as number*
プリロードを再実行可能にするまでの時間をミリ秒で設定します。初期値は`10000`です。

#### *skip: Millisecond as numbery*
ブラウザキャッシュが存在するとみなす、ajaxによるページ取得に要した時間の上限をミリ秒で設定します。ブラウザキャッシュが存在するとみなす場合にはプリロードの実行回数と間隔を更新しません。初期値は`50`です。

#### *query: string*
プリロードによるリクエストURLに加えるパラメータを設定します。初期値は`null`です。

#### *encode: Switch as boolean*
パーセントエンコードしたURLをプリロードに使用しリンクも書き換えるかを設定します。falsandtru/jquery-pjaxと連携させる場合は`true`を設定してください。初期値は`false`です。

#### *ajax: object*
プリロード時で実行される`$.ajax()`に与えるパラメータを設定します。初期値は`{ async: true, timeout: 1500 }`です。

### Method
#### *enable()*
preloadを有効にします。

#### *disable()*
preloadを無効にします。

### Property
なし

### Event
プラグインが使用するカスタムイベントです。

#### *preload*
プリロードを実行するための各種イベントハンドラを再設定します。再設定される範囲はイベントの起点により絞り込まれます。`window`オブジェクトを起点にすることはできません。ajaxやpjaxによりDOMが変更された場合は`$.preload()`を再実行せずにこのイベントを実行してください。`$.preload()`でも再設定可能ですが可読性が下がるうえ、イベントを使用した方が処理も効率的です。

## ライセンス
MIT License
