//=============================================================================
// RPGツクールMV - LL_StandingPictureMV.js v2.6.3
//-----------------------------------------------------------------------------
// ルルの教会 (Lulu's Church)
// https://nine-yusha.com/
//
// URL below for license details.
// https://nine-yusha.com/plugin/
//=============================================================================

/*:
 * @target MV
 * @plugindesc 在显示消息窗口时显示立绘。
 * @author ルルの教会
 * @url https://nine-yusha.com/plugin-spicture/
 *
 * @help LL_StandingPictureMV.js
 *
 * 通过在消息中输入专用控制字符，
 * 可以显示立绘。
 *
 * ・如果输入\FH[ON]，即使窗口被擦除，立绘仍将继续存在。
 *   如果输入\FH[OFF]，则在清除窗口的同时取消并清除立绘。
 *   如果您想在窗口显示以外的时间显示/删除立绘，
 *   使用插件命令「制御文字の実行」。
 * ・立绘ID可以使用半角字母数字字符和下划线(_)。
 * ・立绘ID也可以指定为变量。。 【例】\F[\V[1]]
 * ・一次最多可显示4人的立绘。
 *
 * 専用制御文字:
 *   \F[立ち絵ID]         显示立绘1。 【例】\F[reid]
 *   \FF[立ち絵ID]        显示立绘2。
 *   \FFF[立ち絵ID]       显示立绘3。
 *   \FFFF[立ち絵ID]      显示立绘4。
 *   \M[モーション名]     播放立绘1的动作。 【例】\M[yes]
 *   \MM[モーション名]    播放立绘2的动作。
 *   \MMM[モーション名]   播放立绘3的动作。
 *   \MMMM[モーション名]  播放立绘4的动作。
 *   \AA[F]               焦点在立绘1上。 (除了立绘1以外都很暗)
 *   \AA[FF]              焦点在立绘2上。 (除了立绘2以外都很暗)
 *   \AA[FFF]             焦点在立绘3上。 (除了立绘3以外都很暗)
 *   \AA[FFFF]            焦点在立绘4上。 (除了立绘4以外都很暗)
 *   \AA[N]               使所有立绘都变暗。
 *   \AA[R]               重置立绘的焦点。
 *   \FH[ON]              开启保持模式（立绘继续保持）
 *   \FH[OFF]             关闭保持模式
 *
 * 立绘动作一览:
 *   yes(点头)、yesyes(点两下头)、no(横着晃)、noslow(慢慢横着晃)
 *   jump(跳起来)、jumpjump(跳两次)、jumploop(继续跳)
 *   shake(哆哆嗦嗦)、shakeloop(继续哆哆嗦嗦)
 *   runleft(跑到画面左边)、runright(跑到画面右边)
 *   noslowloop(持续摇晃)、huwahuwa(轻飘飘的)
 *
 * 插件命令（控制字符的执行）:
 *   LL_StandingPictureMV processChar 制御文字
 *   LL_StandingPictureMV processChar \F[s]\M[yes]\FH[ON]  # 显示立绘s
 *   LL_StandingPictureMV processChar \FH[OFF]             # 清除立绘
 *
 * 插件命令:
 *   LL_StandingPictureMV setEnabled true       # 设置立绘显示（默认）
 *   LL_StandingPictureMV setEnabled false      # 隐藏立绘
 *   LL_StandingPictureMV setTone 68,-34,-34,0  # 将立绘的色调改为黄昏
 *   LL_StandingPictureMV setTone -68,-68,68,0  # 将立绘的色调改为夜晚
 *   LL_StandingPictureMV setTone 0,0,0,255     # 将立绘的色调改为黑白
 *   LL_StandingPictureMV setTone 0,0,0,0       # 恢复立绘的色调为正常  
 *
 * 使用条款:
 *   ・不需要版权记载。
 *   ・使用时不需要特别报告。
 *   ・商用和非商用均可。
 *   ・r18作品也没有使用限制。
 *   ・可以根据游戏自由更改。
 *   ・禁止作为插件素材重新分发(包括修改后)。
 *
 * 作者: ルルの教会
 * 作成日: 2022/7/8
 *
 * @command processChar
 * @text 控制字符的执行
 * @desc 在显示窗口以外的时间操作立绘。
 *
 * @arg text
 * @text 控制字符
 * @desc [例]显示立绘→\F[s] \FH[ON]、清除立绘→\FH[OFF]
 * 与显示文本时一样输入控制字符。
 * @type multiline_string
 *
 * @command setEnabled
 * @text 立绘显示ON・OFF
 * @desc 立绘的显示/不显示统一控制。
 *
 * @arg enabled
 * @text 立绘显示
 * @desc 如果设置为OFF，则根本不会显示立绘。 
 * @default true
 * @type boolean
 *
 * @command setTone
 * @text 色调变化
 * @desc 改变立绘的色调。
 *
 * @arg toneR
 * @text 红
 * @desc 色调的R分量。 (-255～255)
 * @default 0
 * @type number
 * @min -255
 * @max 255
 *
 * @arg toneG
 * @text 绿
 * @desc 色调的G分量。 (-255～255)
 * @default 0
 * @type number
 * @min -255
 * @max 255
 *
 * @arg toneB
 * @text 青
 * @desc 色调的B分量。 (-255～255)
 * @default 0
 * @type number
 * @min -255
 * @max 255
 *
 * @arg toneC
 * @text 灰色
 * @desc 灰色的强度。 (0～255)
 * @default 0
 * @type number
 * @min 0
 * @max 255
 *
 * @param sPictures
 * @text 立绘列表
 * @desc 定义要在消息窗口中显示的立绘。
 * @default []
 * @type struct<sPictures>[]
 *
 * @param picture1Settings
 * @text 立绘1(\F)的设定
 * @desc ※不使用这个项目
 *
 * @param transition
 * @text 切换效果
 * @desc 指定出现/擦除时的切换效果。
 * @type select
 * @default 1
 * @option 无
 * @value 0
 * @option 淡出
 * @value 1
 * @option 向左飘浮
 * @value 2
 * @option 向右飘浮
 * @value 3
 * @option 向下飘浮
 * @value 4
 * @option 向上飘浮
 * @value 5
 * @parent picture1Settings
 *
 * @param foreFront
 * @text 显示在窗口前面
 * @desc 打开时，显示在消息窗口的前面。
 * @type boolean
 * @default false
 * @parent picture1Settings
 *
 * @param picture2Settings
 * @text 立绘2(\FF)的设定
 * @desc ※不使用这个项目
 *
 * @param transition2
 * @text 切换效果
 * @desc 指定出现/擦除时的切换效果。
 * @type select
 * @default 1
 * @option 无
 * @value 0
 * @option 淡出
 * @value 1
 * @option 向左飘浮
 * @value 2
 * @option 向右飘浮
 * @value 3
 * @option 向下飘浮
 * @value 4
 * @option 向上飘浮
 * @value 5
 * @parent picture2Settings
 *
 * @param foreFront2
 * @text 显示在窗口前面
 * @desc 打开时，显示在消息窗口的前面。
 * @type boolean
 * @default false
 * @parent picture2Settings
 *
 * @param picture3Settings
 * @text 立绘3(\FFF)的设定
 * @desc ※不使用这个项目
 *
 * @param transition3
 * @text 切换效果
 * @desc 指定出现/擦除时的切换效果。
 * @type select
 * @default 1
 * @option 无
 * @value 0
 * @option 淡出
 * @value 1
 * @option 向左飘浮
 * @value 2
 * @option 向右飘浮
 * @value 3
 * @option 向下飘浮
 * @value 4
 * @option 向上飘浮
 * @value 5
 * @parent picture3Settings
 *
 * @param foreFront3
 * @text 显示在窗口前面
 * @desc 打开时，显示在消息窗口的前面。
 * @type boolean
 * @default false
 * @parent picture3Settings
 *
 * @param picture4Settings
 * @text 立绘4(\FFFF)的设定
 * @desc ※不使用这个项目
 *
 * @param transition4
 * @text 切换效果
 * @desc 指定出现/擦除时的切换效果。
 * @type select
 * @default 1
 * @option 无
 * @value 0
 * @option 淡出
 * @value 1
 * @option 向左飘浮
 * @value 2
 * @option 向右飘浮
 * @value 3
 * @option 向下飘浮
 * @value 4
 * @option 向上飘浮
 * @value 5
 * @parent picture4Settings
 *
 * @param foreFront4
 * @text 显示在窗口前面
 * @desc 打开时，显示在消息窗口的前面。
 * @type boolean
 * @default false
 * @parent picture4Settings
 *
 * @param focusToneAdjust
 * @text 聚焦时的暗度
 * @desc 用AA[s]聚焦时的暗度(-255～0)。
 * 过暗时请进行调整。 (初始值:-96 )
 * @default -96
 * @min -255
 * @max 0
 * @type number
 *
 * @param catheBootPicture
 * @text 预加载立绘图像
 * @desc 消除浏览器播放（例如 Atsmar）期间的加载等待。
 * 根据图像数量和生产线速度，启动可能会延迟。 
 * @default true
 * @type boolean
 */

/*~struct~sPictures:
 *
 * @param id
 * @text 立绘ID
 * @desc 立绘ID。在调用带有控制字符的立绘时使用。
 * 请输入半角字母数字(_)。
 * @type string
 *
 * @param imageName
 * @text 图像文件名
 * @desc 选择要作为站立图片显示的图像文件。 
 * @dir img/pictures
 * @type file
 * @require 1
 *
 * @param origin
 * @text 原点
 * @desc 是立绘的原点。
 * @default 0
 * @type select
 * @option 左上
 * @value 0
 * @option 中央
 * @value 1
 *
 * @param x
 * @text X坐标(立绘1)
 * @desc 这是由立绘1(F)调用时的显示位置(X)。 
 * @default 464
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param y
 * @text Y坐标(立绘1)
 * @desc 这是由立绘1(F)调用时的显示位置(Y)。 
 * @default 96
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param x2
 * @text X坐标 (立绘2)
 * @desc 这是由立绘2(FF)调用时的显示位置(X)。 
 * @default 20
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param y2
 * @text Y坐标(立绘2)
 * @desc 这是由立绘2(FF)调用时的显示位置(Y)。
 * @default 96
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param x3
 * @text X坐标(立绘3)
 * @desc 这是由立绘3(FFF)调用时的显示位置(X)。 
 * @default 364
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param y3
 * @text Y坐标(立绘3)
 * @desc 这是由立绘3(FFF)调用时的显示位置(Y)。
 * @default 96
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param x4
 * @text X坐标(立绘4)
 * @desc 这是由立绘4(FFFF)调用时的显示位置(X)。 
 * @default 120
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param y4
 * @text Y坐标(立绘4)
 * @desc 这是由立绘4(FFFF)调用时的显示位置(Y)。
 * @default 96
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param reverse
 * @text 立绘2、4的左右反转
 * @desc 立绘2(FF)、立绘4(FFFF)被调用时
 * 是否左右翻转立绘。
 * @default 1
 * @type select
 * @option 不左右翻转
 * @value 1
 * @option 左右翻转
 * @value -1
 *
 * @param scaleX
 * @text X放大率
 * @desc 立绘的放大率(X)。
 * @default 100
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param scaleY
 * @text Y放大率
 * @desc 立绘的放大率(Y)。
 * @default 100
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param opacity
 * @text 不透明度
 * @desc 立绘的不透明度(0～255)。
 * @default 255
 * @type number
 * @min 0
 * @max 255
 *
 * @param blendMode
 * @text 合成方法
 * @desc 立绘的合成方法。
 * @default 0
 * @type select
 * @option 通常
 * @value 0
 * @option 加算
 * @value 1
 * @option 除算
 * @value 2
 * @option 屏幕
 * @value 3
 */

(function() {
	"use strict";
	var pluginName = "LL_StandingPictureMV";

	var parameters = PluginManager.parameters(pluginName);
	// 切替効果
	var transitions = [
		null,
		Number(parameters["transition"] || 1),
		Number(parameters["transition2"] || 1),
		Number(parameters["transition3"] || 1),
		Number(parameters["transition4"] || 1)
	];
	// ウィンドウ前面表示
	var foreFronts = [
		null,
		eval(parameters["foreFront"] || "false"),
		eval(parameters["foreFront2"] || "false"),
		eval(parameters["foreFront3"] || "false"),
		eval(parameters["foreFront4"] || "false")
	];

	var focusToneAdjust = Number(parameters["focusToneAdjust"] || -96);
	var catheBootPicture = eval(parameters["catheBootPicture"] || "true");
	var sPictures = JSON.parse(parameters["sPictures"] || "null");
	var sPictureLists = [];
	if (sPictures) {
		sPictures.forEach(function(elm) {
			sPictureLists.push(JSON.parse(elm));
		});
	}

	//-----------------------------------------------------------------------------
	// PluginCommand (for MV)
    //

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === pluginName) {
            switch (args[0]) {
				case 'processChar':
					var text = args[1];
					exStandingPictureParseChar(text);

					// 立ち絵表示状態を継続
					if ($gameSystem._LL_StandingPicture_picture1.showSPicture) {
						$gameSystem._LL_StandingPicture_picture1.refSPicture = true;
						$gameSystem._LL_StandingPicture_picture1.animationCount = animationFrame[$gameSystem._LL_StandingPicture_picture1.motionSPicture];
					}
					if ($gameSystem._LL_StandingPicture_picture2.showSPicture) {
						$gameSystem._LL_StandingPicture_picture2.refSPicture = true;
						$gameSystem._LL_StandingPicture_picture2.animationCount = animationFrame[$gameSystem._LL_StandingPicture_picture2.motionSPicture];
					}
					if ($gameSystem._LL_StandingPicture_picture3.showSPicture) {
						$gameSystem._LL_StandingPicture_picture3.refSPicture = true;
						$gameSystem._LL_StandingPicture_picture3.animationCount = animationFrame[$gameSystem._LL_StandingPicture_picture3.motionSPicture];
					}
					if ($gameSystem._LL_StandingPicture_picture4.showSPicture) {
						$gameSystem._LL_StandingPicture_picture4.refSPicture = true;
						$gameSystem._LL_StandingPicture_picture4.animationCount = animationFrame[$gameSystem._LL_StandingPicture_picture4.motionSPicture];
					}
					if (!$gameSystem._LL_StandingPicture_holdSPicture) {
						$gameSystem._LL_StandingPicture_picture1.showSPicture = false;
						$gameSystem._LL_StandingPicture_picture2.showSPicture = false;
						$gameSystem._LL_StandingPicture_picture3.showSPicture = false;
						$gameSystem._LL_StandingPicture_picture4.showSPicture = false;
						$gameSystem._LL_StandingPicture_picture1.motionSPicture = "";
						$gameSystem._LL_StandingPicture_picture2.motionSPicture = "";
						$gameSystem._LL_StandingPicture_picture3.motionSPicture = "";
						$gameSystem._LL_StandingPicture_picture4.motionSPicture = "";
					}
					break;
				case 'setEnabled':
					var enabled = eval(args[1] || "true");
					$gameSystem._StandingPictureDisabled = !enabled;
					break;
				case 'setTone':
					var setTone = args[1].split(',');
					var pictureTone = [Number(setTone[0]), Number(setTone[1]), Number(setTone[2]), Number(setTone[3])];
					$gameSystem._StandingPictureTone = pictureTone;
					break;
            }
        }
	};

	// アニメーションフレーム数定義
	var animationFrame = {
		"yes":        24,
		"yesyes":     48,
		"no":         24,
		"noslow":     48,
		"jump":       24,
		"jumpjump":   48,
		"jumploop":   48,
		"shake":      1,
		"shakeloop":  1,
		"runleft":    1,
		"runright":   1,
		"noslowloop": 96,
		"breathing":  96,
		"breathing2": 96,
		"huwahuwa":   192,
		"none":       0
	};

	// フォーカス状態リセット用
	let focusReset = false;

	//-----------------------------------------------------------------------------
	// Game_System
	//
	// 立ち絵制御用の独自配列を追加定義します。

	var _Game_System_initialize = Game_System.prototype.initialize;
	Game_System.prototype.initialize = function() {
		_Game_System_initialize.apply(this, arguments);

		this.iniLLStandingPictures();
		this._LL_StandingPicture_battleCache = null;
	};

	Game_System.prototype.iniLLStandingPictures = function() {
		// 立ち絵1 (F)
		this._LL_StandingPicture_picture1 = {
			animationCount: 0,
			spriteSPicture: null,
			showSPicture: false,
			refSPicture: false,
			motionSPicture: ""
		};
		// 立ち絵2 (FF)
		this._LL_StandingPicture_picture2 = {
			animationCount: 0,
			spriteSPicture: null,
			showSPicture: false,
			refSPicture: false,
			motionSPicture: ""
		};
		// 立ち絵3 (FFF)
		this._LL_StandingPicture_picture3 = {
			animationCount: 0,
			spriteSPicture: null,
			showSPicture: false,
			refSPicture: false,
			motionSPicture: ""
		};
		// 立ち絵4 (FFFF)
		this._LL_StandingPicture_picture4 = {
			animationCount: 0,
			spriteSPicture: null,
			showSPicture: false,
			refSPicture: false,
			motionSPicture: ""
		};
		// フォーカス設定
		this._LL_StandingPicture_focusSPicture = {
			0: false,
			1: false,
			2: false,
			3: false,
			4: false
		};
		// ホールド設定
		this._LL_StandingPicture_holdSPicture = false;
	}

	Game_System.prototype.inBattleMakeCacheLLStandingPictures = function() {
		if (!this._LL_StandingPicture_battleCache) {
			this._LL_StandingPicture_battleCache = {
				picture1: this._LL_StandingPicture_picture1,
				picture2: this._LL_StandingPicture_picture2,
				picture3: this._LL_StandingPicture_picture3,
				picture4: this._LL_StandingPicture_picture4,
				focusSPicture: this._LL_StandingPicture_focusSPicture,
				holdSPicture: this._LL_StandingPicture_holdSPicture
			};
		}
		this.iniLLStandingPictures();
	}

	Game_System.prototype.refreshCacheLLStandingPictures = function() {
		if (this._LL_StandingPicture_battleCache) {
			this._LL_StandingPicture_picture1 = this._LL_StandingPicture_battleCache.picture1;
			this._LL_StandingPicture_picture2 = this._LL_StandingPicture_battleCache.picture2;
			this._LL_StandingPicture_picture3 = this._LL_StandingPicture_battleCache.picture3;
			this._LL_StandingPicture_picture4 = this._LL_StandingPicture_battleCache.picture4;
			this._LL_StandingPicture_focusSPicture = this._LL_StandingPicture_battleCache.focusSPicture;
			this._LL_StandingPicture_holdSPicture = this._LL_StandingPicture_battleCache.holdSPicture;
		}
		this._LL_StandingPicture_battleCache = null;
	}

	//-----------------------------------------------------------------------------
	// ExStandingPictureParseChar
	//
	// 立ち絵制御文字を解読する関数です。

	var exStandingPictureParseChar = function(text) {
		text = text.replace(/\\V\[(\d+)\]/gi, function() {
			return $gameVariables.value(parseInt(arguments[1]));
		}.bind(this));

		// 専用制御文字を取得 (\F[s])
		var sPictureNumber = null;
		var processEscapeNumber = text.match(/\\F\[(\w+)\]/);
		if (processEscapeNumber) {
			if (processEscapeNumber[1]) {
				sPictureNumber = processEscapeNumber[1];
			}
		}
		// 専用制御文字を取得 (\FF[s])
		var sPictureNumber2 = null;
		processEscapeNumber = text.match(/\\FF\[(\w+)\]/);
		if (processEscapeNumber) {
			if (processEscapeNumber[1]) {
				sPictureNumber2 = processEscapeNumber[1];
			}
		}
		// 専用制御文字を取得 (\FFF[s])
		var sPictureNumber3 = null;
		processEscapeNumber = text.match(/\\FFF\[(\w+)\]/);
		if (processEscapeNumber) {
			if (processEscapeNumber[1]) {
				sPictureNumber3 = processEscapeNumber[1];
			}
		}
		// 専用制御文字を取得 (\FFFF[s])
		var sPictureNumber4 = null;
		processEscapeNumber = text.match(/\\FFFF\[(\w+)\]/);
		if (processEscapeNumber) {
			if (processEscapeNumber[1]) {
				sPictureNumber4 = processEscapeNumber[1];
			}
		}
		// 専用制御文字を取得 (\M[s])
		var sPictureMotion = null;
		processEscapeNumber = text.match(/\\M\[(\w+)\]/);
		if (processEscapeNumber) {
			if (processEscapeNumber[1]) {
				sPictureMotion = processEscapeNumber[1];
			}
		}
		// 専用制御文字を取得 (\MM[s])
		var sPictureMotion2 = null;
		processEscapeNumber = text.match(/\\MM\[(\w+)\]/);
		if (processEscapeNumber) {
			if (processEscapeNumber[1]) {
				sPictureMotion2 = processEscapeNumber[1];
			}
		}
		// 専用制御文字を取得 (\MMM[s])
		var sPictureMotion3 = null;
		processEscapeNumber = text.match(/\\MMM\[(\w+)\]/);
		if (processEscapeNumber) {
			if (processEscapeNumber[1]) {
				sPictureMotion3 = processEscapeNumber[1];
			}
		}
		// 専用制御文字を取得 (\MMMM[s])
		var sPictureMotion4 = null;
		processEscapeNumber = text.match(/\\MMMM\[(\w+)\]/);
		if (processEscapeNumber) {
			if (processEscapeNumber[1]) {
				sPictureMotion4 = processEscapeNumber[1];
			}
		}
		// 専用制御文字を取得 (\AA[s])
		var focusSPicture = false;
		processEscapeNumber = text.match(/\\AA\[(F|1)\]/);
		if (processEscapeNumber) {
			if (processEscapeNumber[1]) {
				focusSPicture = true;
			}
		}
		var focusSPicture2 = false;
		processEscapeNumber = text.match(/\\AA\[(FF|2)\]/);
		if (processEscapeNumber) {
			if (processEscapeNumber[1]) {
				focusSPicture2 = true;
			}
		}
		var focusSPicture3 = false;
		processEscapeNumber = text.match(/\\AA\[(FFF|3)\]/);
		if (processEscapeNumber) {
			if (processEscapeNumber[1]) {
				focusSPicture3 = true;
			}
		}
		var focusSPicture4 = false;
		processEscapeNumber = text.match(/\\AA\[(FFFF|4)\]/);
		if (processEscapeNumber) {
			if (processEscapeNumber[1]) {
				focusSPicture4 = true;
			}
		}
		var focusSPictureAllout = false;
		processEscapeNumber = text.match(/\\AA\[(N|0)\]/);
		if (processEscapeNumber) {
			if (processEscapeNumber[1]) {
				focusSPictureAllout = true;
			}
		}
		$gameSystem._LL_StandingPicture_focusSPicture = {
			0: focusSPictureAllout,
			1: focusSPicture,
			2: focusSPicture2,
			3: focusSPicture3,
			4: focusSPicture4
		};
		// フォーカス状態リセット (\AA[R])
		processEscapeNumber = text.match(/\\AA\[(R|0)\]/);
		if (processEscapeNumber) {
			if (processEscapeNumber[1]) {
				focusReset = true;
			}
		}
		// 専用制御文字を取得 (\FH[s])
		var sPictureHold = null;
		processEscapeNumber = text.match(/\\FH\[(\w+)\]/);
		if (processEscapeNumber) {
			if (processEscapeNumber[1]) {
				sPictureHold = processEscapeNumber[1];
			}
		}
		// 立ち絵1を更新
		if (sPictureNumber) {
			var sPicture = sPictureLists.filter(function(item, index) {
				if (String(item.id) == sPictureNumber) return true;
			});
			$gameSystem._LL_StandingPicture_picture1.spriteSPicture = sPicture[0];
			if (sPicture[0]) {
				$gameSystem._LL_StandingPicture_picture1.showSPicture = true;
				$gameSystem._LL_StandingPicture_picture1.refSPicture = true;
			} else {
				$gameSystem._LL_StandingPicture_picture1.showSPicture = false;
				$gameSystem._LL_StandingPicture_picture1.refSPicture = false;
			}
			// 再生モーション定義
			$gameSystem._LL_StandingPicture_picture1.motionSPicture = sPictureMotion ? sPictureMotion : "none";
			$gameSystem._LL_StandingPicture_picture1.animationCount = animationFrame[$gameSystem._LL_StandingPicture_picture1.motionSPicture];
		} else {
			if (!$gameSystem._LL_StandingPicture_holdSPicture) {
				$gameSystem._LL_StandingPicture_picture1.showSPicture = false;
				$gameSystem._LL_StandingPicture_picture1.motionSPicture = "";
			} else if (sPictureMotion) {
				// 再生モーション更新
				$gameSystem._LL_StandingPicture_picture1.motionSPicture = sPictureMotion;
				$gameSystem._LL_StandingPicture_picture1.animationCount = animationFrame[$gameSystem._LL_StandingPicture_picture1.motionSPicture];
			}
		}
		// 立ち絵2を更新
		if (sPictureNumber2) {
			var sPicture2 = sPictureLists.filter(function(item, index) {
				if (String(item.id) == sPictureNumber2) return true;
			});
			$gameSystem._LL_StandingPicture_picture2.spriteSPicture = sPicture2[0];
			if (sPicture2[0]) {
				$gameSystem._LL_StandingPicture_picture2.showSPicture = true;
				$gameSystem._LL_StandingPicture_picture2.refSPicture = true;
			} else {
				$gameSystem._LL_StandingPicture_picture2.showSPicture = false;
				$gameSystem._LL_StandingPicture_picture2.refSPicture = false;
			}
			// 再生モーション定義
			$gameSystem._LL_StandingPicture_picture2.motionSPicture = sPictureMotion2 ? sPictureMotion2 : "none";
			$gameSystem._LL_StandingPicture_picture2.animationCount = animationFrame[$gameSystem._LL_StandingPicture_picture2.motionSPicture];
		} else {
			if (!$gameSystem._LL_StandingPicture_holdSPicture) {
				$gameSystem._LL_StandingPicture_picture2.showSPicture = false;
				$gameSystem._LL_StandingPicture_picture2.motionSPicture = "";
			} else if (sPictureMotion2) {
				// 再生モーション更新
				$gameSystem._LL_StandingPicture_picture2.motionSPicture = sPictureMotion2;
				$gameSystem._LL_StandingPicture_picture2.animationCount = animationFrame[$gameSystem._LL_StandingPicture_picture2.motionSPicture];
			}
		}
		// 立ち絵3を更新
		if (sPictureNumber3) {
			var sPicture3 = sPictureLists.filter(function(item, index) {
				if (String(item.id) == sPictureNumber3) return true;
			});
			$gameSystem._LL_StandingPicture_picture3.spriteSPicture = sPicture3[0];
			if (sPicture3[0]) {
				$gameSystem._LL_StandingPicture_picture3.showSPicture = true;
				$gameSystem._LL_StandingPicture_picture3.refSPicture = true;
			} else {
				$gameSystem._LL_StandingPicture_picture3.showSPicture = false;
				$gameSystem._LL_StandingPicture_picture3.refSPicture = false;
			}
			// 再生モーション定義
			$gameSystem._LL_StandingPicture_picture3.motionSPicture = sPictureMotion3 ? sPictureMotion3 : "none";
			$gameSystem._LL_StandingPicture_picture3.animationCount = animationFrame[$gameSystem._LL_StandingPicture_picture3.motionSPicture];
		} else {
			if (!$gameSystem._LL_StandingPicture_holdSPicture) {
				$gameSystem._LL_StandingPicture_picture3.showSPicture = false;
				$gameSystem._LL_StandingPicture_picture3.motionSPicture = "";
			} else if (sPictureMotion3) {
				// 再生モーション更新
				$gameSystem._LL_StandingPicture_picture3.motionSPicture = sPictureMotion3;
				$gameSystem._LL_StandingPicture_picture3.animationCount = animationFrame[$gameSystem._LL_StandingPicture_picture3.motionSPicture];
			}
		}
		// 立ち絵4を更新
		if (sPictureNumber4) {
			var sPicture4 = sPictureLists.filter(function(item, index) {
				if (String(item.id) == sPictureNumber4) return true;
			});
			$gameSystem._LL_StandingPicture_picture4.spriteSPicture = sPicture4[0];
			if (sPicture4[0]) {
				$gameSystem._LL_StandingPicture_picture4.showSPicture = true;
				$gameSystem._LL_StandingPicture_picture4.refSPicture = true;
			} else {
				$gameSystem._LL_StandingPicture_picture4.showSPicture = false;
				$gameSystem._LL_StandingPicture_picture4.refSPicture = false;
			}
			// 再生モーション定義
			$gameSystem._LL_StandingPicture_picture4.motionSPicture = sPictureMotion4 ? sPictureMotion4 : "none";
			$gameSystem._LL_StandingPicture_picture4.animationCount = animationFrame[$gameSystem._LL_StandingPicture_picture4.motionSPicture];
		} else {
			if (!$gameSystem._LL_StandingPicture_holdSPicture) {
				$gameSystem._LL_StandingPicture_picture4.showSPicture = false;
				$gameSystem._LL_StandingPicture_picture4.motionSPicture = "";
			} else if (sPictureMotion4) {
				// 再生モーション更新
				$gameSystem._LL_StandingPicture_picture4.motionSPicture = sPictureMotion4;
				$gameSystem._LL_StandingPicture_picture4.animationCount = animationFrame[$gameSystem._LL_StandingPicture_picture4.motionSPicture];
			}
		}

		// ホールドモードを切替
		if (sPictureHold === "ON") {
			$gameSystem._LL_StandingPicture_holdSPicture = true;
		} else if (sPictureHold === "OFF") {
			$gameSystem._LL_StandingPicture_holdSPicture = false;
		}
	}

	//-----------------------------------------------------------------------------
	// ExStandingPicture
	//
	// 立ち絵を表示する独自のクラスを追加定義します。

	class ExStandingPicture {

		static create (elm) {
			// 立ち絵1
			elm._spSprite = new Sprite_LL_SPicture();
			elm.addChildAt(elm._spSprite, elm.children.indexOf(foreFronts[1] ? elm._windowLayer : elm._spriteset) + 1);
			// 立ち絵2
			elm._spSprite2 = new Sprite_LL_SPicture();
			elm.addChildAt(elm._spSprite2, elm.children.indexOf(foreFronts[2] ? elm._windowLayer : elm._spriteset) + 1);
			// 立ち絵3
			elm._spSprite3 = new Sprite_LL_SPicture();
			elm.addChildAt(elm._spSprite3, elm.children.indexOf(foreFronts[3] ? elm._windowLayer : elm._spriteset) + 1);
			// 立ち絵4
			elm._spSprite4 = new Sprite_LL_SPicture();
			elm.addChildAt(elm._spSprite4, elm.children.indexOf(foreFronts[4] ? elm._windowLayer : elm._spriteset) + 1);

			// ※下記は念のためMVでは無効 (v2.5.1)

			// 立ち絵画像を事前読み込み
			// if (catheBootPicture) {
			// 	sPictureLists.forEach(function(elm) {
			// 		ImageManager.loadPicture(elm.imageName);
			// 	});
			// }

			// 旧Ver.のセーブデータ読み込み対策
			if (typeof $gameSystem._LL_StandingPicture_picture1 === "undefined") {
				$gameSystem.iniLLStandingPictures();
			}

			// 戦闘時判定
			if (SceneManager._scene.constructor === Scene_Battle) {
				// 表示中の立ち絵を消去
				$gameSystem.inBattleMakeCacheLLStandingPictures();
			} else {
				$gameSystem.refreshCacheLLStandingPictures();
			}

			// 立ち絵表示状態を継続
			if ($gameSystem._LL_StandingPicture_picture1.showSPicture) {
				$gameSystem._LL_StandingPicture_picture1.refSPicture = true;
				$gameSystem._LL_StandingPicture_picture1.animationCount = animationFrame[$gameSystem._LL_StandingPicture_picture1.motionSPicture];
			}
			if ($gameSystem._LL_StandingPicture_picture2.showSPicture) {
				$gameSystem._LL_StandingPicture_picture2.refSPicture = true;
				$gameSystem._LL_StandingPicture_picture2.animationCount = animationFrame[$gameSystem._LL_StandingPicture_picture2.motionSPicture];
			}
			if ($gameSystem._LL_StandingPicture_picture3.showSPicture) {
				$gameSystem._LL_StandingPicture_picture3.refSPicture = true;
				$gameSystem._LL_StandingPicture_picture3.animationCount = animationFrame[$gameSystem._LL_StandingPicture_picture3.motionSPicture];
			}
			if ($gameSystem._LL_StandingPicture_picture4.showSPicture) {
				$gameSystem._LL_StandingPicture_picture4.refSPicture = true;
				$gameSystem._LL_StandingPicture_picture4.animationCount = animationFrame[$gameSystem._LL_StandingPicture_picture4.motionSPicture];
			}
		}

		static update (elm) {
			// 立ち絵を非表示に設定している場合、処理を中断
			if ($gameSystem._StandingPictureDisabled) {
				elm._spSprite.opacity = 0;
				elm._spSprite2.opacity = 0;
				elm._spSprite3.opacity = 0;
				elm._spSprite4.opacity = 0;
				return;
			}

			// 立ち絵1ピクチャ作成
			if ($gameSystem._LL_StandingPicture_picture1.spriteSPicture && $gameSystem._LL_StandingPicture_picture1.refSPicture) {
				this.refresh(elm._spSprite, $gameSystem._LL_StandingPicture_picture1.spriteSPicture, 1);
				$gameSystem._LL_StandingPicture_picture1.refSPicture = false;
			}
			// 立ち絵2ピクチャ作成
			if ($gameSystem._LL_StandingPicture_picture2.spriteSPicture && $gameSystem._LL_StandingPicture_picture2.refSPicture) {
				this.refresh(elm._spSprite2, $gameSystem._LL_StandingPicture_picture2.spriteSPicture, 2);
				$gameSystem._LL_StandingPicture_picture2.refSPicture = false;
			}
			// 立ち絵3ピクチャ作成
			if ($gameSystem._LL_StandingPicture_picture3.spriteSPicture && $gameSystem._LL_StandingPicture_picture3.refSPicture) {
				this.refresh(elm._spSprite3, $gameSystem._LL_StandingPicture_picture3.spriteSPicture, 3);
				$gameSystem._LL_StandingPicture_picture3.refSPicture = false;
			}
			// 立ち絵4ピクチャ作成
			if ($gameSystem._LL_StandingPicture_picture4.spriteSPicture && $gameSystem._LL_StandingPicture_picture4.refSPicture) {
				this.refresh(elm._spSprite4, $gameSystem._LL_StandingPicture_picture4.spriteSPicture, 4);
				$gameSystem._LL_StandingPicture_picture4.refSPicture = false;
			}

			// フォーカス状態リセット
			if (focusReset) {
				elm._spSprite.setBlendColor([0, 0, 0, 0]);
				elm._spSprite2.setBlendColor([0, 0, 0, 0]);
				elm._spSprite3.setBlendColor([0, 0, 0, 0]);
				elm._spSprite4.setBlendColor([0, 0, 0, 0]);
				focusReset = false;
			}

			// フォーカス処理
			if (
				$gameSystem._LL_StandingPicture_focusSPicture[0] !== false ||
				$gameSystem._LL_StandingPicture_focusSPicture[1] !== false ||
				$gameSystem._LL_StandingPicture_focusSPicture[2] !== false ||
				$gameSystem._LL_StandingPicture_focusSPicture[3] !== false ||
				$gameSystem._LL_StandingPicture_focusSPicture[4] !== false
			) {
				// フォーカス状態を一度リフレッシュ
				elm._spSprite.setBlendColor([0, 0, 0, 0]);
				elm._spSprite2.setBlendColor([0, 0, 0, 0]);
				elm._spSprite3.setBlendColor([0, 0, 0, 0]);
				elm._spSprite4.setBlendColor([0, 0, 0, 0]);

				if ($gameSystem._LL_StandingPicture_focusSPicture[1] === false || $gameSystem._LL_StandingPicture_focusSPicture[0] === true) {
					elm._spSprite.setBlendColor([0, 0, 0, (focusToneAdjust * -1)]);
				}
				if ($gameSystem._LL_StandingPicture_focusSPicture[2] === false || $gameSystem._LL_StandingPicture_focusSPicture[0] === true) {
					elm._spSprite2.setBlendColor([0, 0, 0, (focusToneAdjust * -1)]);
				}
				if ($gameSystem._LL_StandingPicture_focusSPicture[3] === false || $gameSystem._LL_StandingPicture_focusSPicture[0] === true) {
					elm._spSprite3.setBlendColor([0, 0, 0, (focusToneAdjust * -1)]);
				}
				if ($gameSystem._LL_StandingPicture_focusSPicture[4] === false || $gameSystem._LL_StandingPicture_focusSPicture[0] === true) {
					elm._spSprite4.setBlendColor([0, 0, 0, (focusToneAdjust * -1)]);
				}
			}

			// フェード処理
			if ($gameSystem._LL_StandingPicture_picture1.showSPicture) {
				this.fadeIn(elm._spSprite, $gameSystem._LL_StandingPicture_picture1.spriteSPicture, 1);
			} else {
				this.fadeOut(elm._spSprite, $gameSystem._LL_StandingPicture_picture1.spriteSPicture, 1);
			}
			if ($gameSystem._LL_StandingPicture_picture2.showSPicture) {
				this.fadeIn(elm._spSprite2, $gameSystem._LL_StandingPicture_picture2.spriteSPicture, 2);
			} else {
				this.fadeOut(elm._spSprite2, $gameSystem._LL_StandingPicture_picture2.spriteSPicture, 2);
			}
			if ($gameSystem._LL_StandingPicture_picture3.showSPicture) {
				this.fadeIn(elm._spSprite3, $gameSystem._LL_StandingPicture_picture3.spriteSPicture, 3);
			} else {
				this.fadeOut(elm._spSprite3, $gameSystem._LL_StandingPicture_picture3.spriteSPicture, 3);
			}
			if ($gameSystem._LL_StandingPicture_picture4.showSPicture) {
				this.fadeIn(elm._spSprite4, $gameSystem._LL_StandingPicture_picture4.spriteSPicture, 4);
			} else {
				this.fadeOut(elm._spSprite4, $gameSystem._LL_StandingPicture_picture4.spriteSPicture, 4);
			}

			// 立ち絵モーション再生
			if (!elm._spSprite.opening && !elm._spSprite.closing && $gameSystem._LL_StandingPicture_picture1.animationCount > 0) {
				$gameSystem._LL_StandingPicture_picture1.animationCount = this.animation(elm._spSprite, $gameSystem._LL_StandingPicture_picture1.motionSPicture, $gameSystem._LL_StandingPicture_picture1.animationCount);
			}
			if (!elm._spSprite2.opening && !elm._spSprite2.closing && $gameSystem._LL_StandingPicture_picture2.animationCount > 0) {
				$gameSystem._LL_StandingPicture_picture2.animationCount = this.animation(elm._spSprite2, $gameSystem._LL_StandingPicture_picture2.motionSPicture, $gameSystem._LL_StandingPicture_picture2.animationCount);
			}
			if (!elm._spSprite3.opening && !elm._spSprite3.closing && $gameSystem._LL_StandingPicture_picture3.animationCount > 0) {
				$gameSystem._LL_StandingPicture_picture3.animationCount = this.animation(elm._spSprite3, $gameSystem._LL_StandingPicture_picture3.motionSPicture, $gameSystem._LL_StandingPicture_picture3.animationCount);
			}
			if (!elm._spSprite4.opening && !elm._spSprite4.closing && $gameSystem._LL_StandingPicture_picture4.animationCount > 0) {
				$gameSystem._LL_StandingPicture_picture4.animationCount = this.animation(elm._spSprite4, $gameSystem._LL_StandingPicture_picture4.motionSPicture, $gameSystem._LL_StandingPicture_picture4.animationCount);
			}
		}

		static refresh (sSprite, sPicture, sNumber) {
			sSprite.setPicture(sPicture);
			sSprite.showing = false;
			var calcScaleX = Number(sPicture.scaleX);
			var calcScaleY = Number(sPicture.scaleY);
			// 左右反転させる場合 (立ち絵2, 4)
			if (sNumber == 2 || sNumber == 4) calcScaleX *= Number(sPicture.reverse);
			// 画像が読み込まれたあとに実行
			sSprite.bitmap.addLoadListener(function() {
				if (Number(sPicture.origin) == 0) {
					// 左上原点
					if (sNumber == 1) {
						sSprite.x = Number(sPicture.x);
						sSprite.y = Number(sPicture.y);
						sSprite.originX = Number(sPicture.x);
						sSprite.originY = Number(sPicture.y);
					}
					if (sNumber == 2) {
						sSprite.x = Number(sPicture.x2);
						sSprite.y = Number(sPicture.y2);
						sSprite.originX = Number(sPicture.x2);
						sSprite.originY = Number(sPicture.y2);
					}
					if (sNumber == 3) {
						sSprite.x = Number(sPicture.x3);
						sSprite.y = Number(sPicture.y3);
						sSprite.originX = Number(sPicture.x3);
						sSprite.originY = Number(sPicture.y3);
					}
					if (sNumber == 4) {
						sSprite.x = Number(sPicture.x4);
						sSprite.y = Number(sPicture.y4);
						sSprite.originX = Number(sPicture.x4);
						sSprite.originY = Number(sPicture.y4);
					}
				} else {
					// 中央原点
					if (sNumber == 1) {
						sSprite.x = Number(sPicture.x) - (sSprite.width * calcScaleX / 100) / 2;
						sSprite.y = Number(sPicture.y) - (sSprite.height * calcScaleY / 100) / 2;
						sSprite.originX = Number(sPicture.x) - (sSprite.width * calcScaleX / 100) / 2;
						sSprite.originY = Number(sPicture.y) - (sSprite.height * calcScaleY / 100) / 2;
					}
					if (sNumber == 2) {
						sSprite.x = Number(sPicture.x2) - (sSprite.width * calcScaleX / 100) / 2;
						sSprite.y = Number(sPicture.y2) - (sSprite.height * calcScaleY / 100) / 2;
						sSprite.originX = Number(sPicture.x2) - (sSprite.width * calcScaleX / 100) / 2;
						sSprite.originY = Number(sPicture.y2) - (sSprite.height * calcScaleY / 100) / 2;
					}
					if (sNumber == 3) {
						sSprite.x = Number(sPicture.x3) - (sSprite.width * calcScaleX / 100) / 2;
						sSprite.y = Number(sPicture.y3) - (sSprite.height * calcScaleY / 100) / 2;
						sSprite.originX = Number(sPicture.x3) - (sSprite.width * calcScaleX / 100) / 2;
						sSprite.originY = Number(sPicture.y3) - (sSprite.height * calcScaleY / 100) / 2;
					}
					if (sNumber == 4) {
						sSprite.x = Number(sPicture.x4) - (sSprite.width * calcScaleX / 100) / 2;
						sSprite.y = Number(sPicture.y4) - (sSprite.height * calcScaleY / 100) / 2;
						sSprite.originX = Number(sPicture.x4) - (sSprite.width * calcScaleX / 100) / 2;
						sSprite.originY = Number(sPicture.y4) - (sSprite.height * calcScaleY / 100) / 2;
					}
				}
				// 切替効果
				if (sSprite.opacity == 0) {
					if (transitions[sNumber] == 0) sSprite.opacity = Number(sPicture.opacity);
					if (transitions[sNumber] == 2) sSprite.x -= 30;
					if (transitions[sNumber] == 3) sSprite.x += 30;
					if (transitions[sNumber] == 4) sSprite.y += 30;
					if (transitions[sNumber] == 5) sSprite.y -= 30;
				}
				sSprite.setBlendMode(Number(sPicture.blendMode));
				sSprite.setColorTone($gameSystem._StandingPictureTone ? $gameSystem._StandingPictureTone : [0, 0, 0, 0]);
				sSprite.setBlendColor([0, 0, 0, 0]);
				sSprite.scale.x = calcScaleX / 100;
				sSprite.scale.y = calcScaleY / 100;
				sSprite.showing = true;
			}.bind(this));
		}

		static fadeIn (sSprite, sPicture, sNumber) {
			if (!sSprite.showing) return;
			if (sSprite.opacity >= Number(sPicture.opacity)) {
				sSprite.opening = false;
				sSprite.opacity = Number(sPicture.opacity);
				return;
			}
			sSprite.opening = true;
			sSprite.closing = false;
			// 切替効果
			if (sSprite.originX > sSprite.x) sSprite.x += 2;
			if (sSprite.originX < sSprite.x) sSprite.x -= 2;
			if (sSprite.originY < sSprite.y) sSprite.y -= 2;
			if (sSprite.originY > sSprite.y) sSprite.y += 2;
			sSprite.opacity += Number(sPicture.opacity) / 15;
		}

		static fadeOut (sSprite, sPicture, sNumber) {
			if (sSprite.opacity == 0) {
				sSprite.closing = false;
				return;
			}
			sSprite.closing = true;
			if (!sPicture) {
				sSprite.opacity = 0;
				return;
			}
			sSprite.opacity -= Number(sPicture.opacity) / 15;
			// 切替効果
			if (transitions[sNumber] == 0) sSprite.opacity = 0;
			if (transitions[sNumber] == 2 && sSprite.originX - 30 < sSprite.x) sSprite.x -= 2;
			if (transitions[sNumber] == 3 && sSprite.originX + 30 > sSprite.x) sSprite.x += 2;
			if (transitions[sNumber] == 4 && sSprite.originY + 30 > sSprite.y) sSprite.y += 2;
			if (transitions[sNumber] == 5 && sSprite.originY - 30 < sSprite.y) sSprite.y -= 2;
		}

		static animation (sSprite, sMotion, animationCount) {
			if (!sSprite.showing) return animationCount;
			if (sMotion == "yes") {
				if (animationCount > 12) {
					sSprite.y += 2;
				} else {
					sSprite.y -= 2;
				}
				animationCount -= 1;
			}
			if (sMotion == "yesyes") {
				if (animationCount > 36) {
					sSprite.y += 2;
				} else if (animationCount > 24) {
					sSprite.y -= 2;
				} else if (animationCount > 12) {
					sSprite.y += 2;
				} else {
					sSprite.y -= 2;
				}
				animationCount -= 1;
			}
			if (sMotion == "no") {
				if (animationCount > 18) {
					sSprite.x += 2;
				} else if (animationCount > 6) {
					sSprite.x -= 2;
				} else {
					sSprite.x += 2;
				}
				animationCount -= 1;
			}
			if (sMotion == "noslow") {
				if (animationCount > 36) {
					sSprite.x += 1;
				} else if (animationCount > 12) {
					sSprite.x -= 1;
				} else {
					sSprite.x += 1;
				}
				animationCount -= 1;
			}
			if (sMotion == "jump") {
				if (animationCount > 12) {
					sSprite.y -= 2;
				} else {
					sSprite.y += 2;
				}
				animationCount -= 1;
			}
			if (sMotion == "jumpjump") {
				if (animationCount > 36) {
					sSprite.y -= 2;
				} else if (animationCount > 24) {
					sSprite.y += 2;
				} else if (animationCount > 12) {
					sSprite.y -= 2;
				} else {
					sSprite.y += 2;
				}
				animationCount -= 1;
			}
			if (sMotion == "jumploop") {
				if (animationCount > 36) {
					sSprite.y -= 2;
				} else if (animationCount > 24) {
					sSprite.y += 2;
				}
				animationCount -= 1;
				if (animationCount == 0) animationCount = 48;
			}
			if (sMotion == "shake") {
				if (animationCount <= 2) {
					sSprite.x -= 2;
					animationCount += 1;
				} else if (animationCount <= 4) {
					sSprite.y -= 2;
					animationCount += 1;
				} else if (animationCount <= 6) {
					sSprite.x += 4;
					sSprite.y += 4;
					animationCount += 1;
				} else if (animationCount <= 8) {
					sSprite.y -= 2;
					animationCount += 1;
				} else if (animationCount == 9) {
					sSprite.x -= 2;
					animationCount += 1;
				} else if (animationCount == 10) {
					sSprite.x -= 2;
					animationCount = 0;
				}
			}
			if (sMotion == "shakeloop") {
				if (animationCount <= 2) {
					sSprite.x -= 1;
					animationCount += 1;
				} else if (animationCount <= 4) {
					sSprite.y -= 1;
					animationCount += 1;
				} else if (animationCount <= 6) {
					sSprite.x += 2;
					sSprite.y += 2;
					animationCount += 1;
				} else if (animationCount <= 8) {
					sSprite.y -= 1;
					animationCount += 1;
				} else if (animationCount <= 10) {
					sSprite.x -= 1;
					animationCount += 1;
				}
				if (animationCount > 10) animationCount = 1;
			}
			if (sMotion == "runleft") {
				sSprite.x -= 16;
				if (sSprite.x < -2000) animationCount = 0;
			}
			if (sMotion == "runright") {
				sSprite.x += 16;
				if (sSprite.x > 2000) animationCount = 0;
			}
			if (sMotion == "noslowloop") {
				if (animationCount > 72) {
					sSprite.x += 0.25;
				} else if (animationCount > 24) {
					sSprite.x -= 0.25;
				} else {
					sSprite.x += 0.25;
				}
				animationCount -= 1;
				if (animationCount == 0) animationCount = animationFrame["noslowloop"];
			}
			if (sMotion == "breathing") {
				if (animationCount > 72) {
					sSprite.y += 0.5;
				} else if (animationCount > 48) {
					sSprite.y -= 0.5;
				} else {
				}
				animationCount -= 1;
				if (animationCount == 0) animationCount = animationFrame["breathing"];
			}
			if (sMotion == "breathing2") {
				if (animationCount > 48) {
					// sSprite.anchor.y = 1;
					sSprite.y -= sSprite.height * 0.0003;
					sSprite.scale.y += 0.0003;
				} else {
					// sSprite.anchor.y = 1;
					sSprite.y += sSprite.height * 0.0003;
					sSprite.scale.y -= 0.0003;
				}
				animationCount -= 1;
				if (animationCount == 0) animationCount = animationFrame["breathing2"];
			}
			if (sMotion == "huwahuwa") {
				if (animationCount > 144) {
					sSprite.y += 0.25;
				} else if (animationCount > 48) {
					sSprite.y -= 0.25;
				} else {
					sSprite.y += 0.25;
				}
				animationCount -= 1;
				if (animationCount == 0) animationCount = animationFrame["huwahuwa"];
			}
			return animationCount;
		}
	}

	var _Scene_Map_update = Scene_Map.prototype.update;
	Scene_Map.prototype.update = function() {
		_Scene_Map_update.apply(this, arguments);
		ExStandingPicture.update(this);
	};

	var _Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
	Scene_Map.prototype.createDisplayObjects = function() {
		_Scene_Map_createDisplayObjects.apply(this, arguments);
		ExStandingPicture.create(this);
	};

	var _Scene_Battle_update = Scene_Battle.prototype.update;
	Scene_Battle.prototype.update = function() {
		_Scene_Battle_update.apply(this, arguments);
		ExStandingPicture.update(this);
	};

	var _Scene_Battle_createDisplayObjects = Scene_Battle.prototype.createDisplayObjects;
	Scene_Battle.prototype.createDisplayObjects = function() {
		_Scene_Battle_createDisplayObjects.apply(this, arguments);
		ExStandingPicture.create(this);
	};

	var _Window_Message_updateClose = Window_Message.prototype.updateClose;
	Window_Message.prototype.updateClose = function() {
		// ピクチャ消去判定
		if (this._closing && this.openness == 255) {
			if (!$gameSystem._LL_StandingPicture_holdSPicture) {
				$gameSystem._LL_StandingPicture_picture1.showSPicture = false;
				$gameSystem._LL_StandingPicture_picture2.showSPicture = false;
				$gameSystem._LL_StandingPicture_picture3.showSPicture = false;
				$gameSystem._LL_StandingPicture_picture4.showSPicture = false;
				$gameSystem._LL_StandingPicture_picture1.motionSPicture = "";
				$gameSystem._LL_StandingPicture_picture2.motionSPicture = "";
				$gameSystem._LL_StandingPicture_picture3.motionSPicture = "";
				$gameSystem._LL_StandingPicture_picture4.motionSPicture = "";
			}
	    }
		_Window_Message_updateClose.apply(this, arguments);
	};

	var _Window_Message_startMessage = Window_Message.prototype.startMessage;
	Window_Message.prototype.startMessage = function() {
		var messageAllText = $gameMessage.allText();
		exStandingPictureParseChar(messageAllText);

		_Window_Message_startMessage.apply(this, arguments);
	};

	var _Window_Base_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
	Window_Base.prototype.convertEscapeCharacters = function(text) {
		// 立ち絵呼び出し用の制御文字(\V[n]内包)を追加
		text = text.replace(/\\F\[\\V\[(\d+)\]\]/gi, "");
		text = text.replace(/\\FF\[\\V\[(\d+)\]\]/gi, "");
		text = text.replace(/\\FFF\[\\V\[(\d+)\]\]/gi, "");
		text = text.replace(/\\FFFF\[\\V\[(\d+)\]\]/gi, "");

		// 立ち絵呼び出し用の制御文字を追加
		text = text.replace(/\\F\[(\w+)\]/gi, "");
		text = text.replace(/\\FF\[(\w+)\]/gi, "");
		text = text.replace(/\\FFF\[(\w+)\]/gi, "");
		text = text.replace(/\\FFFF\[(\w+)\]/gi, "");
		text = text.replace(/\\M\[(\w+)\]/gi, "");
		text = text.replace(/\\MM\[(\w+)\]/gi, "");
		text = text.replace(/\\MMM\[(\w+)\]/gi, "");
		text = text.replace(/\\MMMM\[(\w+)\]/gi, "");
		text = text.replace(/\\AA\[(\w+)\]/gi, "");
		text = text.replace(/\\FH\[(\w+)\]/gi, "");

		return _Window_Base_convertEscapeCharacters.call(this, text);
	};

	var _Scene_Boot_loadSystemImages = Scene_Boot.loadSystemImages;
	Scene_Boot.loadSystemImages = function() {
		_Scene_Boot_loadSystemImages.call(this);

		if (!catheBootPicture) return;

		// 立ち絵画像を事前読み込み
		sPictureLists.forEach(function(elm) {
			ImageManager.loadPicture(elm.imageName);
		});
	};


	//-----------------------------------------------------------------------------
	// Sprite_LL_SPicture
	//
	// 立ち絵を表示するための独自のスプライトを追加定義します。

	function Sprite_LL_SPicture() {
		this.initialize.apply(this, arguments);
	}

	Sprite_LL_SPicture.prototype = Object.create(Sprite.prototype);
	Sprite_LL_SPicture.prototype.constructor = Sprite_LL_SPicture;

	Sprite_LL_SPicture.prototype.initialize = function() {
		Sprite.prototype.initialize.call(this);

		this.bitmap = null;
		this.opacity = 0;
		this.opening = false;
		this.closing = false;
		this.originX = 0;
		this.originY = 0;
		this.showing = false;

		this.setOverlayBitmap();
		this.initMembers();
	};

	Sprite_LL_SPicture.prototype.setOverlayBitmap = function() {
		//
	};

	Sprite_LL_SPicture.prototype.initMembers = function() {
		//
	};

	Sprite_LL_SPicture.prototype.update = function() {
		Sprite.prototype.update.call(this);
	};

	Sprite_LL_SPicture.prototype.setPicture = function(sPicture) {
		// ベース画像
		this.bitmap = null;
		this.bitmap = ImageManager.loadPicture(sPicture.imageName);
	};

	Sprite_LL_SPicture.prototype.setBlendColor = function(color) {
		Sprite.prototype.setBlendColor.call(this, color);
	};

	Sprite_LL_SPicture.prototype.setColorTone = function(tone) {
		Sprite.prototype.setColorTone.call(this, tone);
	};

	Sprite_LL_SPicture.prototype.setBlendMode = function(mode) {
		this.blendMode = mode;
	};
})();
