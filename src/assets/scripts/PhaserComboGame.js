'use strict';

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var GameLogic = {
  // we get the full game settings from an API endpoint of the game server    
  settings: null,
  // type: one of 'demo' (demo games need no user authentication), 'normal', 'timefree' (free games have no time restrictions)
  type: 'timefree',
  // cards: list (array) of all game cards
  cards: [],
  // mainCard: the selected card from the cards array that the user sees in front of the stack at any time
  mainCard: null,
  // the game timer object
  timer: null,
  // the session duration, set by the game settings
  sessionDurationSeconds: 0,
  // a time counter in seconds
  timeRemainingSeconds: 0,
  // a counter of the correct user answers
  correctAnswers: 0,
  // a counter of the wrong user answers
  wrongAnswers: 0,
  // a boolean flag to know when the game is already over
  gameIsOver: false,
  // the number of real money cashback the user has won when the game is over, from special questions in this game
  //cashbackWon: 0,
  // the index of the last card in GameLogic.Cards that its image is loaded
  oldCardsIndex: 0,
  // How many cards are added to GameLogic.cards array with the last answer response from the server
  extraCardsCount: 0,
  // An array of all valid game type values
  validTypes: ['demo', 'normal', 'timefree'],
  reset: function reset(type) {
    if (GameLogic.validTypes.indexOf(type) > -1) {
      GameLogic.type = type;
      GameLogic.cards = [];
      GameLogic.mainCard = null;
      GameLogic.timer = null; //GameLogic.sessionDurationSeconds = null;

      GameLogic.timeRemainingSeconds = 0;
      GameLogic.correctAnswers = 0;
      GameLogic.wrongAnswers = 0;
      GameLogic.gameIsOver = false;
      GameLogic.oldCardsIndex = 0;
      GameLogic.extraCardsCount = 0;
    }
  }
};
var Localization = {
  locale: 'en',
  // 'en' alternatively
  dictionary: {},
  Translate: function Translate(term) {
    var localeDictionary = Localization.dictionary[Localization.locale] || Localization.dictionary['en'];
    if (localeDictionary) return localeDictionary[term] || "[".concat(term, "]");else return "[".concat(term, "]");
  },
  TranslateQuestion: function TranslateQuestion(question) {
    return question[Localization.locale] || question['en'];
  }
};

var Card =
/*#__PURE__*/
function () {
  // id: question id
  // imageUrl: a link to the question image
  // questionText: a multi-lingual object (dictionary) of the question
  // questionSubtitle: (optional) a multi-lingual object (dictionary) of the question subtitle
  // questionChoices: an object (dictionary) of the 2 possible question choices (yes/no, si/no, oui/non, true/false) as multi-lingual objects 
  function Card(other) {
    _classCallCheck(this, Card);

    // id, imageUrl, questionText, questionSubtitle, questionChoices) {
    this.id = other.id;
    this.imageUrl = other.imageUrl;
    this.question = other.title;
    this.choices = other.choices;
    this.answerIsCorrect = null; // dont know yet

    this.isExtraTime = other.isExtraTime || false; // true if the card is a special bonus card and will grant some extra time if answered correctly

    this.isCashback = other.isCashback || false; // true if the card is a special bonus card and will grant some cashback money (to be matured and redeemed later on) if answered correctly

    this.cashbackType = other.cashbackType; // 'gold', 'silver' or 'bronze'

    this.cardObject = null; // a reference to the Phaser.js card object
  } // called when the user answers a question


  _createClass(Card, [{
    key: "userAnswer",
    value: function userAnswer(answer, gameType, callback) {
      if (answer !== 0 && answer !== 1 && answer !== -1) return;
      var that = this;
      that.answer = answer;

      __phaser.api.answerQuestion(that.id, answer, gameType).then(function (res) {
        //callback for what to do when the answer is correct/ wrong
        if (res.questionResult) that.answerIsCorrect = res.questionResult;
        return callback(null, res.ticket, res.questionResult, res.sessionResult, res.extraQuestions);
      }, function (err) {
        return callback(err);
      });
    }
  }, {
    key: "endGame",
    value: function endGame(gameType, callback) {
      var that = this;
     //console.log("Ending Game!!!");

      __phaser.api.answerQuestion(that.id, -1, gameType).then(function (res) {
        return callback(null, res.ticket, res.questionResult, res.sessionResult, res.extraQuestions);
      }, function (err) {
        return callback(err);
      });
    }
  }]);

  return Card;
}();

var __phaser = {
  gameObj: null,
  api: null,
  //-------------------
  game: {
    type: 'demo',
    //-------------------
    init: function init(canvasEle, appComponent, locale) {
      Localization.locale = locale;
      // create game object
      var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.CANVAS, canvasEle, {
        preload: preload,
        create: create,
        update: update
      }, true); //var game = new Phaser.Game(800, 500, Phaser.AUTO, canvasEle, { preload: preload, create: create, update: update });

      var gameState = "preload"; // assign it

      __phaser.gameObj = game; // Assign the game logic struct

      game.logic = GameLogic;
      var demoTimeTxt;
      var loadingtext;
      var loadingPercentage;
      var demoTimer;
      var demoTimerLoop;
      var demoQuestionTxt;
      var demoCardImageUrl;
      var demoCardImages = [];
      var demoImageLoadedCount = 0;
      var demoCardObjects = [];
      var demoIsDragging = false; // var cardShadow;

      var dropZoneNo;
      var dropZoneYes;
      var noLabel;
      var yesLabel;
      var firstAnswer = true;
      var Swipe;
      var SwipeOff = true;
      var globalRatio;
      var buttonsActive = true;
      var gearGroup;
      var g1;
      var imagesLoaded = 0;
      var that = this; //-----------------------  PRELOAD

      function preload() {
        // Viewport Size Detection
        var x = 32;
        var y = 0;
        var yi = 32;
       //console.log('Viewport Height: ' + game.scale.viewportHeight, x, y += yi);
       //console.log('window.innerHeight: ' + window.innerHeight, x, y += yi);
       //console.log('window.outerHeight: ' + window.outerHeight, x, y += yi); // set canvas color

        game.stage.backgroundColor = '#95a5a6'; // Create Loader

        this.gearGroup = game.add.group();
        game.load.image("Gear", "assets/sprites/gear.png"); // load images/sounds/scripts

        game.load.image("whitebox", "assets/sprites/white_box.png");
        game.load.image("frame", "assets/sprites/polaroid_frame.png");
        game.load.image("frameGold", "assets/sprites/polaroid_frame_gold.png");
        game.load.image("frameSilver", "assets/sprites/polaroid_frame_silver.png");
        game.load.image("frameBronze", "assets/sprites/polaroid_frame_bronze.png");
        game.load.image("zone_yes", "assets/sprites/zone_yes.png");
        game.load.image("zone_no", "assets/sprites/zone_no.png");
        game.load.image("timerbg", "assets/sprites/timerBg.png");
        game.load.image("tableBg", "assets/sprites/tableBg.png");
        game.load.image("falseTag", "assets/sprites/false@3x.png");
        game.load.image("trueTag", "assets/sprites/true@3x.png");
        game.load.image("gameNo", "assets/sprites/no@3x.png");
        game.load.image("gameYes", "assets/sprites/yes@3x.png");
        game.load.image("gameNoDesat", "assets/sprites/no@3x_desat.png");
        game.load.image("gameYesDesat", "assets/sprites/yes@3x_desat.png");
        game.load.image("endGameBtn", "assets/sprites/stop@3x.png");
        game.load.image("endGameBtn_desat", "assets/sprites/stop@3x_desat.png");
        game.load.image("plusSec", "assets/sprites/cek.png");
        game.load.image("timerPic", "assets/sprites/timer.png");
        game.load.image("lights", "assets/sprites/lights.png"); // preloader events

        game.load.onLoadStart.add(loadStart, this);
        game.load.onFileComplete.add(fileComplete, this);
        game.load.onLoadComplete.add(loadComplete, this);
        game.load.enableParallel = true;
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignVertically = true;
        this.scale.pageAlignHorizontally = true;
        this.scale.updateLayout(true); // this.scale.setScreenSize(true);

        this.scale.setResizeCallback(function (scale, parentBounds) {
          this.scale.setMaximum();
         //console.log("Resizing!!!");
         //console.log("Scale: " + scale);
         //console.log("parentBounds: " + parentBounds);
         //console.log('window.innerHeight: ' + window.innerHeight);
         //console.log('window.outerHeight: ' + window.outerHeight);
         //console.log('window.outerWidth: ' + window.outerWidth);
         //console.log('window.innerWidth: ' + window.innerWidth);
         //console.log('window.devicePixelRatio: ' + window.devicePixelRatio); // var scaleRatio = getMinSquareParentSize() / game.width;
          // scale.setUserScale(scaleRatio, scaleRatio, 0, 0);   // set square size
        }, this);
      } //-----------------------
      // Global functions


      function dropCards() {
        buttonsActive = false;
       //console.log("GameTyoe: " + __phaser.game.type);

        // if (__phaser.game.type !== 'freetime') {
          if (that.yesButton_Desat != null) {
            that.yesButton_Desat.alpha = 1;
            that.noButton_Desat.alpha = 1;
          }
        // }

        var cardsLength = game.logic.cards.length;

        for (var i = 0; i < cardsLength; i++) {
          var cardObject = game.logic.cards[i].cardObject;
          cardObject.inputEnabled = false;
          var randomNum = game.rnd.integerInRange(-200, 200);
          game.add.tween(game.logic.cards[cardsLength - 1 - i].cardObject).to({
            y: game.camera.height + 500,
            x: game.world.centerX + randomNum
          }, 500, Phaser.Easing.Quadratic.In, true, i * 200);
          game.add.tween(game.logic.cards[cardsLength - 1 - i].cardObject).to({
            angle: randomNum / 2
          }, 500, Phaser.Easing.Quadratic.In, true, i * 200);
        }
      }

      function apiCallback(err, gameTicket, isCorrect, sessionResults, extraQuestions) {
        if (err) {// display Error to user?
        } else {
          if (isCorrect) {
            game.logic.correctAnswers++;
          } else {
            game.logic.wrongAnswers++;
          } // If First Time, start timer


          firstAnswer = false;

          if (__phaser.game.type !== 'timefree') {
            // Sync timer with server computed remaining seconds
            game.logic.timeRemainingSeconds = gameTicket.remainingSeconds;
          } // Check if last card is special gold cashback
          // if (game.logic.mainCard.isCashback && isCorrect) {
          // }
          // Check if last card is special extra time


          if (game.logic.mainCard != null) {
            if (game.logic.mainCard.isExtraTime && isCorrect) {
              var tweenTimePlus = game.add.tween(that.timePlus).to({
                alpha: 1
              }, 700, Phaser.Easing.Linear.None, true, __phaser.game.type === 'normal' ? 1000 : 0);
              tweenTimePlus.onComplete.add(function () {
                game.add.tween(that.timePlus).to({
                  alpha: 0
                }, 500, Phaser.Easing.Linear.None, true, 1000);
              }, this);
            }
          } // Check if extra questions have come from the server


          if (extraQuestions && extraQuestions.length > 0) {
            var _game$logic$cards;

            // load images for questions,
            // append to Cards
            var cards = __phaser._.map(extraQuestions, function (q, index) {
              q.imageUrl = __phaser.environment.gameServerDomainUrl + '/' + q.imageUrl;
              return new Card(q);
            });

            cards = cards.reverse();
            game.logic.extraCardsCount = cards.length;
            game.logic.oldCardsIndex = game.logic.cards.length - 1;

            (_game$logic$cards = game.logic.cards).unshift.apply(_game$logic$cards, _toConsumableArray(cards));

            var cardImagesCount = demoCardImages.length + imagesLoaded;
            var loader = null;

            for (var index = 0; index < cards.length; index++) {
              //game.logic.cards[index].cardUrlName = cards[index].imageUrl;
              loader = game.load.image('picture' + (cardImagesCount + index), cards[index].imageUrl);
             //console.log("Loaded Image " + index + ": " + cards[index].imageUrl);
              imagesLoaded++;
            } // Note: At the end of the loop, imagesLoaded == cards.length


            loader.start();
          }
        } // Remove Last From Array & change MainCard


        game.logic.cards.pop(); // Check for game over condition

        if (sessionResults) {
          game.logic.gameIsOver = true; // if (sessionResults.cashbackWon !== undefined && sessionResults.cashbackWon >= 0)
          //     game.logic.cashbackWon = sessionResults.cashbackWon;

          game.time.events.remove(demoTimer);
          demoTimer.remove(demoTimerLoop);
          dropCards();
          demoQuestionTxt.text = Localization.Translate("labelGameOver") + "\n" + sessionResults.correctAnswers + " " + Localization.Translate("labelCorrectAnswers");
          demoQuestionTxt.alpha = 0; // Wait one sec for animation to end before exiting the game
          //setTimeout(() => __phaser.destroyGame(), 1000);
        } else {
          game.logic.mainCard = __phaser._.last(game.logic.cards);
          tweenCardPositions();
        }
      }

      ;

      function tweenCardPositions() {
        for (var i = 0; i < game.logic.cards.length; i++) {
          var temCard = game.logic.cards[i].cardObject;

          if (i == game.logic.cards.length - 1) {
            game.add.tween(temCard.scale).to({
              x: globalRatio + 0.1,
              y: globalRatio + 0.1
            }, 500, Phaser.Easing.Elastic.Out, true);
            var lastTween = game.add.tween(temCard).to({
              y: temCard.y + (50 * globalRatio)
            }, 500, Phaser.Easing.Elastic.Out, true);
            lastTween.onComplete.add(UnlockButtons, this); // Open Lights or Not

            if (game.logic.mainCard.isCashback || game.logic.mainCard.isExtraTime) that.lights.alpha = 0.8;else that.lights.alpha = 0;
          } else if (i == game.logic.cards.length - 2) {
            //console.log("Tween: " + i);
            game.add.tween(temCard.scale).to({
              x: (globalRatio + 0.1) / 100 * 95,
              y: (globalRatio + 0.1) / 100 * 95
            }, 500, Phaser.Easing.Bounce.Out, true, 250);
            var lastTween2 = game.add.tween(temCard).to({
              y: temCard.y + (50 * globalRatio)
            }, 500, Phaser.Easing.Bounce.Out, true, 250); // lastTween2.onComplete.add(UnlockButtons, this);
          }
        }
      }

      function UnlockButtons() {
        // Unlocking Buttons!!!
        if (game.logic.mainCard != null) game.logic.mainCard.cardObject.inputEnabled = true;
        buttonsActive = true;

        if (__phaser.game.type !== 'timefree') {
          that.yesButton_Desat.alpha = 0;
          that.noButton_Desat.alpha = 0;
        } else {
          that.yesButton_Desat.alpha = 0;
          that.noButton_Desat.alpha = 0;
          that.endGameBtn_desat.alpha = 0;
        }
      } //-----------------------  CREATE


      function create() {
        var _this = this;

        //console.log("Running Create!!");
        // Reset ame.logic.extraCardsCount
        game.logic.extraCardsCount = 0; // SPINNING GEARS

        this.g1 = game.add.sprite(game.world.centerX - 65, game.world.centerY - 120, 'Gear');
        this.g1.anchor.set(0.5);
        this.g1.scale.set(0.9);
        this.gearGroup.add(this.g1);
        var tween1 = game.add.tween(this.g1).to({
          angle: 180
        }, 2000, Phaser.Easing.Quadratic.InOut, true).loop(true); // tween1.yoyo(true, 0);

        this.g2 = game.add.sprite(game.world.centerX + 85, game.world.centerY + 50, 'Gear');
        this.g2.anchor.set(0.5);
        this.g2.scale.set(0.8);
        var tween2 = game.add.tween(this.g2).to({
          angle: -180
        }, 2000, Phaser.Easing.Quadratic.InOut, true).loop(true); // tween2.yoyo(true, 0);

        this.gearGroup.add(this.g2); // LIGHTS

        that.lights = game.add.sprite(game.camera.width / 2, game.camera.height / 2 - game.camera.height / 100 * 18 + 100, 'lights');
        that.lights.anchor.set(0.5);
        that.lights.scale.set(5.5);
        var lightsTween = game.add.tween(that.lights).to({
          angle: 359
        }, 10000, Phaser.Easing.Linear.None, true).loop(true);
        that.lights.alpha = 0; // SWIPE INIT

        if (__phaser.game.type === 'demo') this.swipe = new Swipe(this.game);
       //console.log('window.innerHeight: ' + window.innerHeight);
       //console.log('window.outerHeight: ' + window.outerHeight);
       //console.log('window.outerWidth: ' + window.outerWidth);
       //console.log('window.innerWidth: ' + window.innerWidth);
       //console.log('window.devicePixelRatio: ' + window.devicePixelRatio);

        if (window.outerHeight < 600 && window.devicePixelRatio < 3) {
          // Small Screen
          globalRatio = 0.5;
         //console.log("SMALL SCREEN!!!");
        } else if (window.outerHeight > 1000 && window.devicePixelRatio == 2) {
          // iPad
          globalRatio = 1.1;
        }else if (window.outerHeight > 1000 && window.devicePixelRatio < 1.5) {
          // iPad
          globalRatio = 0.5;
        }else if (window.outerHeight < 1000 && window.devicePixelRatio < 1.5) {
          // iPad
          globalRatio = 0.3;
        } else {
          globalRatio = window.devicePixelRatio / 3; 
          // globalRatio = 1; 
        }
        
       //console.log("ScaleRatio = " + globalRatio); 
        //Check for Too Small Resolution


        // if (globalRatio < 0.5) globalRatio = 0.5; // BACKGROUND Timer EFFECT
        // make it from left to right
        // Slice it to 

        var timerBgBg = game.add.sprite(0, 0, 'whitebox');
        timerBgBg.anchor.set(0);
        timerBgBg.alpha = 0.3;
        timerBgBg.width = game.camera.width;
        timerBgBg.height = 5;
        var timerBg = game.add.sprite(0, 0, 'zone_no');
        timerBg.anchor.set(0);
        timerBg.width = game.camera.width;
        timerBg.height = 5;
        var TimerGroup = game.add.group();
        that.timePlus = game.add.sprite(0, 20, 'plusSec');
        that.timePlus.anchor.set(0);
        that.timePlus.alpha = 0; //  Create our Timer

        demoTimer = game.time.create(false); //  Set a TimerEvent to occur every second

        demoTimerLoop = demoTimer.loop(1000, updateCounter, this);
        var bgMoveStep = game.camera.height * 2 / 45; // console.log(bgMoveStep);

        function updateCounter() {
          // No Answer yet
          if (firstAnswer == true || game.logic.mainCard == null) return;
          game.logic.timeRemainingSeconds--;

          if (game.logic.timeRemainingSeconds < 0) {
            if (!game.logic.gameIsOver) {
              game.logic.gameIsOver = true; // Let the server take care of the results, submit a special (-1) user answer after the local timer is over

              game.logic.mainCard.userAnswer(-1, __phaser.game.type, apiCallback);
            }
          } else {
            // Make the scale of the line the acording to the remaining secs
            var newWidth = game.camera.width / 45 * game.logic.timeRemainingSeconds;
            if (__phaser.game.type !== 'timefree') game.world.bringToTop(that.timePlus);
            game.add.tween(timerBg).to({
              width: newWidth
            }, 100, Phaser.Easing.Linear.None, true);
            game.add.tween(that.timePlus).to({
              x: newWidth - 150 * globalRatio
            }, 300, Phaser.Easing.Linear.None, true);
          }
        }

        var dragPosition;
        var dragRotation;
        dropZoneNo = game.add.sprite(0, 0, 'zone_no');
        dropZoneNo.width = game.camera.width / 2 - (0 + 50 * globalRatio);
        dropZoneNo.height = game.camera.height;
        dropZoneNo.alpha = 0.01;
        dropZoneNo.inputEnabled = true;
        dropZoneNo.events.onInputOver.add(ZoneNoOver, this);

        function ZoneNoOver() {
          if (demoIsDragging == true) {
            noLabel.alpha = .5;
            noLabel.x = game.logic.mainCard.cardObject.x;
          }
        }

        dropZoneYes = game.add.sprite(game.camera.width, 0, 'zone_yes');
        dropZoneYes.anchor.set(1, 0);
        dropZoneYes.width = game.camera.width / 2 - (0 + 50 * globalRatio);
        dropZoneYes.height = game.camera.height; // dropZoneYes.anchor.set(1,0);

        dropZoneYes.alpha = 0.01;
        dropZoneYes.inputEnabled = true;
        dropZoneYes.events.onInputOver.add(ZoneYesOver, this);

        function ZoneYesOver() {
          if (demoIsDragging == true) {
            yesLabel.alpha = .5;
            yesLabel.x = game.logic.mainCard.cardObject.x;
          }
        } //////////////////////////////////////////////////////////////////////
        // BUTTONS
        ///////////////////////////////////////////////////////////////////////


        // if (__phaser.game.type !== 'timefree') {
          // Yes Button
          var yesButton = game.add.sprite(game.camera.width / 2 + 250 * globalRatio, this.game.world.height / 100 * 80, 'gameYes');
          yesButton.alpha = 0;
          yesButton.anchor.set(.5);
          yesButton.inputEnabled = true;
          yesButton.input.useHandCursor = true;
          yesButton.scale.set(globalRatio);
          that.yesButton_Desat = game.add.sprite(game.camera.width / 2 + 250 * globalRatio, this.game.world.height / 100 * 80, 'gameYesDesat');
          that.yesButton_Desat.alpha = 0;
          that.yesButton_Desat.anchor.set(.5);
          that.yesButton_Desat.scale.set(globalRatio);
          yesButton.events.onInputDown.add(doAnimYes, this); // Νο Button

          var noButton = game.add.sprite(game.camera.width / 2 - 250 * globalRatio, this.game.world.height / 100 * 80, 'gameNo');
          noButton.alpha = 0;
          noButton.anchor.set(.5);
          noButton.inputEnabled = true;
          noButton.input.useHandCursor = true;
          noButton.scale.set(globalRatio);
          that.noButton_Desat = game.add.sprite(game.camera.width / 2 - 250 * globalRatio, this.game.world.height / 100 * 80, 'gameNoDesat');
          that.noButton_Desat.alpha = 0;
          that.noButton_Desat.anchor.set(.5);
          that.noButton_Desat.scale.set(globalRatio);
          noButton.events.onInputDown.add(doAnimNo, this);
        // }

        function doAnimNo() {
          if (buttonsActive) {
            //console.log("No Pressed!!!");
            buttonsActive = false;

            if (__phaser.game.type !== 'timefree') {
              that.yesButton_Desat.alpha = 1;
              that.noButton_Desat.alpha = 1;
            } else {
              that.yesButton_Desat.alpha = 1;
              that.noButton_Desat.alpha = 1;
              that.endGameBtn_desat.alpha = 1;
            }

            var mainCard = game.logic.mainCard;
            mainCard.falseTag.alpha = 1;
            // mainCard.cardObject.inputEnabled = false;
            var CardTween = game.add.tween(mainCard.cardObject).to({
              x: mainCard.cardObject.x - 400 * globalRatio,
              y: mainCard.cardObject.y + 20,
              angle: mainCard.cardObject.angle - 15
            }, 300, Phaser.Easing.Quadratic.Out, true); // console.log(this);

            CardTween.onComplete.add(answerResult, this);
          }
        }

        function doAnimYes() {
          //console.log("buttonsActive: "+buttonsActive);
          if (buttonsActive) {
            //console.log("Yes Pressed!!!");
            buttonsActive = false;

            if (__phaser.game.type !== 'timefree') {
              that.yesButton_Desat.alpha = 1;
              that.noButton_Desat.alpha = 1;
            } else {
              that.yesButton_Desat.alpha = 1;
              that.noButton_Desat.alpha = 1;
              that.endGameBtn_desat.alpha = 1;
            }

            var mainCard = game.logic.mainCard;
            mainCard.trueTag.alpha = 1;
            // mainCard.cardObject.inputEnabled = false;
            var CardTween = game.add.tween(mainCard.cardObject).to({
              x: mainCard.cardObject.x + 400 * globalRatio,
              y: mainCard.cardObject.y + 20,
              angle: mainCard.cardObject.angle + 15
            }, 300, Phaser.Easing.Quadratic.Out, true); // console.log(this);

            CardTween.onComplete.add(answerResult, this);
          }
        }

        if (__phaser.game.type === 'timefree') {
          // yesButton.events.onInputDown.add(doAnimYes, this);
          var EndGame = function EndGame() {
           //console.log("Button Pressed!");
            game.logic.mainCard.endGame(__phaser.game.type, apiCallback);
            game.logic.reset(__phaser.game.type);
          };

          var endGameBtn = game.add.sprite(game.camera.width / 2, this.game.world.height / 100 * 80, 'endGameBtn');
          endGameBtn.anchor.set(.5);
          endGameBtn.inputEnabled = true;
          endGameBtn.input.useHandCursor = true;
          endGameBtn.scale.set(globalRatio);
          endGameBtn.events.onInputDown.add(EndGame, this);
          endGameBtn.alpha = 0;
          that.endGameBtn_desat = game.add.sprite(game.camera.width / 2, this.game.world.height / 100 * 80, 'endGameBtn_desat');
          that.endGameBtn_desat.anchor.set(.5); // that.endGameBtn_desat.inputEnabled = true;
          // that.endGameBtn_desat.input.useHandCursor = true;

          that.endGameBtn_desat.scale.set(globalRatio); // endGameBtn.events.onInputDown.add(EndGame, this);

          that.endGameBtn_desat.alpha = 0;
          var endgameTxt = this.game.add.text(game.camera.width / 2, this.game.world.height / 100 * 80, "", {
            fontSize: 40 * globalRatio + 'px',
            fill: '#000000',
            align: "center"
          });
          endgameTxt.anchor.set(0.5);
          endgameTxt.alpha = 0;
        }

        demoQuestionTxt = this.game.add.text(this.game.world.centerX, this.game.world.height / 1.25, "", {
          fontSize: '50px',
          fill: '#FFFFFF',
          align: "center"
        });
        demoQuestionTxt.anchor.set(0.5); // 	questionTxt.scale.set(globalRatio);
        // Create a Given Number of Cards, One On Top of the Other
        // 

        demoCardImages = [];
        game.logic.reset(__phaser.game.type);

        __phaser.api.createSession(__phaser.game.type).then(function (res) {
          if (res.questions) {
            // (Card class and its constructor need some re-factoring)
            // Estw oti:
            var cards = __phaser._.map(res.questions, function (q, index) {
              q.imageUrl = __phaser.environment.gameServerDomainUrl + '/' + q.imageUrl;
              return new Card(q);
            });

            var sessionTimeLeft = res.ticket.durationSeconds;
            cards = cards.reverse(); // Set Cards values to the ones created from the API response

            _this.game.logic.cards = cards;
            game.logic.durationSeconds = sessionTimeLeft;
            game.logic.timeRemainingSeconds = sessionTimeLeft;

            __phaser._.forEach(cards, function (c, index) {
              //game.logic.cards[index].cardUrlName = c.imageUrl;
              demoCardImages[index] = _this.game.load.image('picture' + index, c.imageUrl);
              demoCardImages[index].onLoadComplete.add(function () {
                // imagesLoaded++;
                // Count to check if all images have been loaded
                demoImageLoadedCount++; // And they have, because the loaded images sum is same as all images 

                if (demoImageLoadedCount == _this.game.logic.cards.length) {
                  CreateCards();
                  _this.gearGroup.alpha = 0;

                  if (__phaser.game.type === 'timefree') {
                    game.add.tween(endGameBtn).to({
                      alpha: 1
                    }, 1000, "Linear", true, 2000);
                    game.add.tween(endgameTxt).to({
                      alpha: 1
                    }, 1000, "Linear", true, 2000); // this.endGameBtn.alpha = 1;
                  }
                }
              });
            });
          } //console.log("Card Images Length: " + demoCardImages.length);


          game.load.start();
        }, function (err) {// ToDo: display error to user
          //console.error(err);
        }); // CreateCards();
        // Yes or No


        yesLabel = this.game.add.text(dropZoneYes.width / 2, dropZoneYes.height - 200, Localization.Translate("infoQuestionCorrect"), {
          fontSize: '100px',
          fill: '#FFFFFF',
          align: "center",
          boundsAlignH: "center",
          boundsAlignV: "middle"
        });
        yesLabel.anchor.set(0.5);
        yesLabel.alpha = 0;
        noLabel = this.game.add.text(game.camera.width - dropZoneNo.width / 2, dropZoneYes.height - 200, Localization.Translate("infoQuestionWrong"), {
          fontSize: '100px',
          fill: '#FFFFFF',
          align: "center",
          boundsAlignH: "center",
          boundsAlignV: "middle"
        });
        noLabel.anchor.set(0.5);
        noLabel.alpha = 0;

        function CreateCards() {
          
          // Disable pause
          game.stage.disableVisibilityChange=true;
          // cardShadow = game.add.sprite(0, 0, 'frame');
          // cardShadow.anchor.set(.5);
          // cardShadow.tint = 0x000000;
          // cardShadow.alpha = 0.3;
          // cardShadow.scale.set(globalRatio);
          for (var i = 0; i < game.logic.cards.length; i++) {
            var hitCheck;
            var card;
            var gameCard = game.logic.cards[i];
          // console.log("Batch: 0" + " Questn: " + i + " card question: " + gameCard.question["en"]);
          // console.log("card Url: " + gameCard.imageUrl);
            var imageInCard;
            var timerPic;
            var questionText; //console.log(gameCard.cashbackType);

            if (gameCard.isCashback) {
              if (gameCard.cashbackType == "gold") card = game.add.sprite(game.camera.width / 2, game.camera.height / 2 - game.camera.height / 100 * 18, 'frameGold');else if (gameCard.cashbackType == "silver") card = game.add.sprite(game.camera.width / 2, game.camera.height / 2 - game.camera.height / 100 * 18, 'frameSilver');else card = game.add.sprite(game.camera.width / 2, game.camera.height / 2 - game.camera.height / 100 * 18, 'frameBronze');
            } else {
              card = game.add.sprite(game.camera.width / 2, game.camera.height / 2 - game.camera.height / 100 * 18, 'frame');
            } // Place Last 3


            card.anchor.set(.5); // card.hitArea = new Phaser.Rectangle(-card.width, -card.height, card.width*2, card.height*2);

            hitCheck = game.add.sprite(0, 0, 'zone_no');
            hitCheck.anchor.set(.5);
            card.addChild(hitCheck);
            imageInCard = game.add.sprite(0, 74, 'picture' + i);
            imageInCard.anchor.set(.5);
            imageInCard.scale.set(1.2);
            card.addChild(imageInCard); // If This is an Extra Time Card add clock

            if (gameCard.isExtraTime) {
              timerPic = game.add.sprite(308, 381, 'timerPic');
              timerPic.anchor.set(.5);
              timerPic.scale.set(1.2);
              card.addChild(timerPic);
            }

            questionText = game.add.text(0, -370, "Test Text for Question Test Text for Question Test Text for Question", {
              fontSize: '40px',
              fill: '#000',
              align: "center"
            });
            questionText.anchor.set(0.5);
            questionText.wordWrap = true;
            questionText.wordWrapWidth = 750;
            card.addChild(questionText); // Add true Mark

            var trueTag = game.add.sprite(-200, -300, 'trueTag');
            trueTag.anchor.set(.5); // trueTag.scale.set(globalRatio);

            card.addChild(trueTag);
            game.logic.cards[i].trueTag = trueTag;
            game.logic.cards[i].trueTag.alpha = 0; //Add False Mark

            var falseTag = game.add.sprite(200, -300, 'falseTag');
            falseTag.anchor.set(.5); // falseTag.scale.set(globalRatio);

            card.addChild(falseTag);
            game.logic.cards[i].falseTag = falseTag;
            game.logic.cards[i].falseTag.alpha = 0;

            if (i == game.logic.cards.length - 1) {
              card.scale.set(globalRatio + 0.1);
              card.y += 100 * globalRatio;
            } else if (i == game.logic.cards.length - 2) {
              card.scale.set((globalRatio + 0.1) / 100 * 95);
              card.y += 50 * globalRatio;
            } else {
              card.scale.set((globalRatio + 0.1) / 100 * 90);
            } // card.scale.set(globalRatio);  
            // card.angle = game.rnd.integerInRange(-5,5);


            card.id = gameCard.id;
            game.logic.cards[i].questionText = questionText; //card.question = Localization.TranslateQuestion(gameCard.question);

            card.inputEnabled = true;
            card.input.useHandCursor = true; // CLOSED FOR SWIPE MECHANICS
            // card.input.enableDrag();

            card.events.onInputOver.add(onOver, this);
            card.events.onInputOut.add(onOut, this);
            card.events.onInputDown.add(onDown, this);
            card.events.onInputUp.add(onUp, this);
            card.events.onDragStart.add(onDragStart, this);
            card.events.onDragStop.add(onDragStop, this);
            dragPosition = new Phaser.Point(card.x, card.y);
            gameCard.cardObject = card;
            card.inputEnabled = false; // Add To CardObjects for animation
            // demoCardObjects.add(card);
          } // Play start Animation


          for (var i = 0; i < game.logic.cards.length; i++) {
            // card.cardObject.x = 0;
            // card.cardObject.scale.set(card.cardObject.scale*3);
            var _card = game.logic.cards[i]; //console.log(card.id);

            game.add.tween(_card.cardObject).from({
              y: -700,
              angle: game.rnd.integerInRange(-30, 30)
            }, 700, "Back.easeOut", true, 120 * i); 
            
            // game.logic.cards[i].questionText.text = "Batch: 0"+" Questn: "+i+" "+Localization.TranslateQuestion(game.logic.cards[i].question);
            game.logic.cards[i].questionText.text = Localization.TranslateQuestion(game.logic.cards[i].question);
          }

          game.logic.mainCard = __phaser._.last(game.logic.cards);
          game.logic.mainCard.cardObject.inputEnabled = true;
          demoQuestionTxt.text = ""; // cardShadow.bringToTop();
          // START TIMER
          //  Start the timer running - this is important!
          //  It won't start automatically, allowing you to hook it to button events and the like.
          //console.log("Now Start Counter")

          demoTimer.start(); // Change Text To "Waiting For First Answer!"
          // demoTimeTxt.text = Localization.Translate("labelBeforeTimerStart");

          function onOver(sprite, pointer) {//console.log("Mouse Over!");
            // sprite.tint = 0xf1f1f1;
          }

          function onDragStart(sprite, pointer) {
            //console.log("Drag Start!");
            if (sprite != game.logic.mainCard.cardObject) return; // cardShadow.bringToTop();

            sprite.bringToTop();
            dragPosition.set(sprite.x, sprite.y);
            dragRotation = sprite.angle;
            sprite.dragRotation = sprite.angle; // dragRotation = 0;

            demoIsDragging = true;
          }

          function onDown(sprite, pointer) {
            that.mouseIsDown = true; //record the place the mouse started

            that.startX = game.input.x;
          }

          function onUp(sprite, pointer) {
            //console.log("Mouse Out!");
            that.mouseIsDown = false; //get the ending point

            var endX = game.input.x; //
            //
            //check the start point against the end point
            //
            //
            // if(this.SwipeOff) {

            if (endX < that.startX) {
              //swipe left
             //console.log("Swiped left");
              doAnimNo();
            } else {
              //swipe right
             //console.log("Swiped Right");
              doAnimYes();
            } // }

          }

          function onOut(sprite, pointer) {
            //console.log("Mouse Out!");
            if (__phaser.game.type !== 'demo') sprite.tint = 0xffffff;
          }

          function onDragStop(sprite, pointer) {
            demoIsDragging = false;
            var mainCard = game.logic.mainCard;

            if (!sprite.getChildAt(0).overlap(dropZoneYes) && !sprite.getChildAt(0).overlap(dropZoneNo)) {
              game.add.tween(sprite).to({
                x: dragPosition.x,
                y: dragPosition.y,
                angle: dragRotation
              }, 500, "Back.easeOut", true);
            } else if (sprite.getChildAt(0).overlap(dropZoneYes)) {
              sprite.inputEnabled = false;

              if (__phaser.game.type !== 'timefree') {
                that.yesButton_Desat.alpha = 1;
                that.noButton_Desat.alpha = 1;
              } else {
                that.yesButton_Desat.alpha = 1;
                that.noButton_Desat.alpha = 1;
                that.endGameBtn_desat.alpha = 1;
              }

              game.add.tween(sprite).to({
                y: game.camera.height + sprite.height + 50
              }, 550, Phaser.Easing.Quadratic.In, true); //console.log("YES!!!!!");

              mainCard.userAnswer(0, __phaser.game.type, apiCallback);
            } else if (sprite.getChildAt(0).overlap(dropZoneNo)) {
              sprite.inputEnabled = false;

              if (__phaser.game.type !== 'timefree') {
                that.yesButton_Desat.alpha = 1;
                that.noButton_Desat.alpha = 1;
              } else {
                that.yesButton_Desat.alpha = 1;
                that.noButton_Desat.alpha = 1;
                that.endGameBtn_desat.alpha = 1;
              }

              game.add.tween(sprite).to({
                y: game.camera.height + sprite.height + 50
              }, 550, Phaser.Easing.Quadratic.In, true); //console.log("NO!!!!!");

              mainCard.userAnswer(1, __phaser.game.type, apiCallback);
            }

            sprite.scale.set(globalRatio + 0.1);
            yesLabel.alpha = 0;
            noLabel.alpha = 0;
          } // open buttons with delay


          game.time.events.add(Phaser.Timer.SECOND * 3, function () {
            // if (__phaser.game.type !== 'timefree') {
              yesButton.alpha = 1;
              noButton.alpha = 1;
            // }
          }, this);
        }
      } //-----------------------


      var batch = 0;

      function CreateExtraCards(extraCardCount, imageCount) {
        batch++; // var extendedGroup = game.add.group();
        // game.world.add(extendedGroup);
        // extendedGroup.sendToBack();
        // Create card objects and append behind last existing one
        // extra cards are game.logic.cards[0] up to game.logic.cards[extraCardCount -1]

       //console.log("extraCardCount: " + extraCardCount);
       //console.log("imageCount: " + imageCount);
       //console.log("imagesLoaded: " + imagesLoaded);
        imagesLoaded += extraCardCount;

        for (var i = extraCardCount - 1; i >= 0; i--) {
          var hitCheck;
          var card;
          var gameCard = game.logic.cards[i];
        // console.log("Batch: " + batch + " Questn: " + i + " card question: " + gameCard.question["en"]);
        // console.log("card Url: " + gameCard.imageUrl);
          var dragPosition;
          var dragRotation;
          var imageInCard;
          var timerPic;
          var questionText; //console.log(gameCard.cashbackType);

          if (gameCard.isCashback) {
            if (gameCard.cashbackType == "gold") card = game.add.sprite(game.camera.width / 2, game.camera.height / 2 - game.camera.height / 100 * 18, 'frameGold');else if (gameCard.cashbackType == "silver") card = game.add.sprite(game.camera.width / 2, game.camera.height / 2 - game.camera.height / 100 * 18, 'frameSilver');else card = game.add.sprite(game.camera.width / 2, game.camera.height / 2 - game.camera.height / 100 * 18, 'frameBronze');
          } else {
            card = game.add.sprite(game.camera.width / 2, game.camera.height / 2 - game.camera.height / 100 * 18, 'frame');
          }

          card.anchor.set(.5); // card.hitArea = new Phaser.Rectangle(-card.width, -card.height, card.width*2, card.height*2);

          hitCheck = game.add.sprite(0, 0, 'zone_no');
          hitCheck.anchor.set(.5);
          card.addChild(hitCheck);
         //console.log("LoadedImage: " + 'picture' + (imagesLoaded + i + 1));
          imageInCard = game.add.sprite(0, 74, 'picture' + (imagesLoaded + i + 1));
         //console.log(imageInCard);
          imageInCard.anchor.set(.5);
          imageInCard.scale.set(1.2);
          card.addChild(imageInCard);

          if (gameCard.isExtraTime) {
            timerPic = game.add.sprite(308, 381, 'timerPic');
            timerPic.anchor.set(.5);
            timerPic.scale.set(1.2);
            card.addChild(timerPic);
          }

          questionText = game.add.text(0, -370, "Test Text for Question Test Text for Question Test Text for Question", {
            fontSize: '40px',
            fill: '#000',
            align: "center"
          });
          questionText.anchor.set(0.5);
          questionText.wordWrap = true;
          questionText.wordWrapWidth = 750;
          card.addChild(questionText); // Add true Mark

          var trueTag = game.add.sprite(-200, -300, 'trueTag');
          trueTag.anchor.set(.5); // trueTag.scale.set(globalRatio);

          card.addChild(trueTag);
          game.logic.cards[i].trueTag = trueTag;
          game.logic.cards[i].trueTag.alpha = 0; //Add False Mark

          var falseTag = game.add.sprite(200, -300, 'falseTag');
          falseTag.anchor.set(.5); // falseTag.scale.set(globalRatio);

          card.addChild(falseTag);
          game.logic.cards[i].falseTag = falseTag;
          game.logic.cards[i].falseTag.alpha = 0;
          card.scale.set((globalRatio + 0.1) / 100 * 90); // card.scale.set(globalRatio);  
          // card.angle = game.rnd.integerInRange(-5,5);

          card.sendToBack();
          card.id = gameCard.id;
          game.logic.cards[i].questionText = questionText; 
          
          // questionText.text = "Batch: "+batch+" Questn: "+i+" "+Localization.TranslateQuestion(game.logic.cards[i].question);
          questionText.text = Localization.TranslateQuestion(game.logic.cards[i].question); //card.question = Localization.TranslateQuestion(gameCard.question);

          card.inputEnabled = true;
          card.input.useHandCursor = true; // card.input.enableDrag();

          card.events.onInputOver.add(onOver, this);
          card.events.onInputOut.add(onOut, this);
          card.events.onInputDown.add(onDown, this);
          card.events.onInputUp.add(onUp, this);
          card.events.onDragStart.add(onDragStart, this);
          card.events.onDragStop.add(onDragStop, this);
          dragPosition = new Phaser.Point(card.x, card.y);
          gameCard.cardObject = card;
          card.inputEnabled = false; // Add To Extended Group
          // extendedGroup.add(card);
        } // game.logic.mainCard = __phaser._.last(game.logic.cards);
        // game.logic.mainCard.cardObject.inputEnabled = true;
        // demoQuestionTxt.text = "";

        // Sent dropzones to back
        dropZoneNo.sendToBack();
        dropZoneYes.sendToBack();
        
        function onOver(sprite, pointer) {//console.log("Mouse Over!");
          // sprite.tint = 0xf1f1f1;
        }

        function onDragStart(sprite, pointer) {
          //console.log("Drag Start!");
          if (sprite != game.logic.mainCard.cardObject) return; // cardShadow.bringToTop();

          sprite.bringToTop();
          dragPosition.set(sprite.x, sprite.y);
          dragRotation = sprite.angle;
          sprite.dragRotation = sprite.angle; // dragRotation = 0;

          demoIsDragging = true;
        } // Creating Swipe Mechanics for free & normal game


        function onDown(sprite, pointer) {
          //set the mouseIsDown to true
          that.mouseIsDown = true; //
          //
          //record the place the mouse started
          //
          //

          that.startX = game.input.x;
        }

        function onUp(sprite, pointer) {
          //console.log("Mouse Out!");
          that.mouseIsDown = false; //get the ending point

          var endX = game.input.x; // if(this.SwipeOff) {
          console.log("that.startX: "+that.startX);
          if (endX < that.startX) {
            //swipe left
           //console.log("Swiped left");
            doAnimNo();
          } else {
            //swipe right
           //console.log("Swiped Right");
            doAnimYes();
          } // }

        }

        function onOut(sprite, pointer) {
          //console.log("Mouse Out!");
          sprite.tint = 0xffffff;
        }

        function onDragStop(sprite, pointer) {
          demoIsDragging = false;
          var mainCard = game.logic.mainCard;

          if (!sprite.getChildAt(0).overlap(dropZoneYes) && !sprite.getChildAt(0).overlap(dropZoneNo)) {
            game.add.tween(sprite).to({
              x: dragPosition.x,
              y: dragPosition.y,
              angle: dragRotation
            }, 500, "Back.easeOut", true);
          } else if (sprite.getChildAt(0).overlap(dropZoneYes)) {
            sprite.inputEnabled = false; // that.yesButton_Desat.alpha = 1;
            // that.noButton_Desat.alpha = 1;

            that.endGameBtn_desat.alpha = 1;
            game.add.tween(sprite).to({
              y: game.camera.height + sprite.height + 50
            }, 550, Phaser.Easing.Quadratic.In, true); //console.log("YES!!!!!");

            mainCard.userAnswer(0, __phaser.game.type, apiCallback);
          } else if (sprite.getChildAt(0).overlap(dropZoneNo)) {
            sprite.inputEnabled = false; // that.yesButton_Desat.alpha = 1;
            // that.noButton_Desat.alpha = 1;

            that.endGameBtn_desat.alpha = 1;
            game.add.tween(sprite).to({
              y: game.camera.height + sprite.height + 50
            }, 550, Phaser.Easing.Quadratic.In, true); //console.log("NO!!!!!");

            mainCard.userAnswer(1, __phaser.game.type, apiCallback);
          }

          sprite.scale.set(globalRatio + 0.1);
          yesLabel.alpha = 0;
          noLabel.alpha = 0;
        }

        function doAnimNo() {
          if (buttonsActive) {
            //console.log("No Pressed!!!");
            buttonsActive = false;

            if (__phaser.game.type !== 'timefree') {
              that.yesButton_Desat.alpha = 1;
              that.noButton_Desat.alpha = 1;
            } else {
              that.yesButton_Desat.alpha = 1;
              that.noButton_Desat.alpha = 1;
              that.endGameBtn_desat.alpha = 1;
            }

            var mainCard = game.logic.mainCard;
            mainCard.falseTag.alpha = 1;
            // mainCard.cardObject.inputEnabled = false;
            var CardTween = game.add.tween(mainCard.cardObject).to({
              x: mainCard.cardObject.x - 400 * globalRatio,
              y: mainCard.cardObject.y + 20,
              angle: mainCard.cardObject.angle - 15
            }, 300, Phaser.Easing.Quadratic.Out, true); // console.log(this);

            CardTween.onComplete.add(answerResult, this);
          }
        }

        function doAnimYes() {
          //console.log("buttonsActive: "+buttonsActive);
          if (buttonsActive) {
            //console.log("Yes Pressed!!!");
            buttonsActive = false;

            if (__phaser.game.type !== 'timefree') {
              that.yesButton_Desat.alpha = 1;
              that.noButton_Desat.alpha = 1;
            } else {
              that.yesButton_Desat.alpha = 1;
              that.noButton_Desat.alpha = 1;
              that.endGameBtn_desat.alpha = 1;
            }

            var mainCard = game.logic.mainCard;
            mainCard.trueTag.alpha = 1;
            // mainCard.cardObject.inputEnabled = false;
            var CardTween = game.add.tween(mainCard.cardObject).to({
              x: mainCard.cardObject.x + 400 * globalRatio,
              y: mainCard.cardObject.y + 20,
              angle: mainCard.cardObject.angle + 15
            }, 300, Phaser.Easing.Quadratic.Out, true); // console.log(this);

            CardTween.onComplete.add(answerResult, this);
          }
        }
      } //-----------------------


      function loadStart() {
        // text
        loadingtext = game.add.text(game.world.centerX, game.world.centerY / 2, "", {
          fontSize: 40 + 'px',
          fill: '#FFFFFF',
          align: "center",
          boundsAlignH: "center",
          boundsAlignV: "middle"
        });
        loadingtext.anchor.set(0.5);
        loadingPercentage = game.add.text(game.world.centerX, game.world.centerY / 2 + 50, "", {
          fontSize: 40 + 'px',
          fill: '#FFFFFF',
          align: "center",
          boundsAlignH: "center",
          boundsAlignV: "middle"
        });
        loadingPercentage.anchor.set(0.5);
      } //-----------------------
      //-----------------------


      function fileComplete(progress, cacheKey, success, totalLoaded, totalFiles) {} // loadingtext.setText("Loading...");
      // loadingPercentage.setText(progress + "%")
      //-----------------------
      //-----------------------


      function preloaderUpdate() {} // upadate cycle for anything in preload state
      //-----------------------
      //-----------------------


      function loadComplete() {
        // loadingtext.setText("All assets loaded");
        // loadingPercentage.setText("100%")
        if (game.logic && game.logic.cards && game.logic.cards.length > 0 && !game.logic.gameIsOver && game.logic.extraCardsCount > 0) {
         //console.log("imagesLoaded: " + game.logic.extraCardsCount + "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
          CreateExtraCards(game.logic.extraCardsCount, demoCardImages.length);
          game.logic.oldCardsIndex = 0;
        } else {
          // add slight delay before starting game
          game.time.events.add(Phaser.Timer.SECOND * 1, function () {
            loadingtext.destroy();
            loadingPercentage.destroy();
            startGame();
          }, this).autoDestroy = true;
        }
      } //-----------------------
      //-----------------------


      function startGame() {
        gameState = "gameplay";
      } //-----------------------
      //-----------------------


      function gameplayUpdate() {
        var mainCard = game.logic.mainCard;
        var mainCardObject = !mainCard ? null : mainCard.cardObject;

        if (SwipeOff) {
          if (demoIsDragging == true) {
            // console.log("Dragging: "+ isDragging);
            mainCardObject.angle = mainCardObject.dragRotation + (mainCardObject.x - game.camera.width / 2) / 15;

            if (mainCardObject.getChildAt(0).overlap(dropZoneYes)) {
              mainCard.trueTag.alpha = 1; //console.log("Over Yes!!!");
            } else {
              mainCard.trueTag.alpha = 0;
              yesLabel.alpha = 0;
            }

            if (mainCardObject.getChildAt(0).overlap(dropZoneNo)) {
              mainCard.falseTag.alpha = 1; //console.log("Over No!!!");
            } else {
              mainCard.falseTag.alpha = 0;
              noLabel.alpha = 0;
            } // console.log(mainCard.angle);} else{
            // if(cardShadow != null && cardShadow.alpha != 0)
            //   cardShadow.alpha = 0;

          }
        } else {
          if (buttonsActive) {
            buttonsActive = false;
            var direction = that.swipe.check();
           //console.log(direction);

            if (direction !== null) {
              // direction= { x: x, y: y, direction: direction }
             //console.log(direction);

              if (direction.direction == 4 || direction.direction == 32 || direction.direction == 128) {
                //console.log("Left");  
                mainCardObject.inputEnabled = false;
                var CardTween = game.add.tween(mainCardObject).to({
                  x: mainCardObject.x - 200,
                  y: mainCardObject.y + 20,
                  angle: mainCardObject.angle - 15
                }, 300, Phaser.Easing.Quadratic.Out, true);
                CardTween.onComplete.add(answerResult, this);
              }

              ;

              if (direction.direction == 8 || direction.direction == 16 || direction.direction == 64) {
                //console.log("Right"); 
                mainCardObject.inputEnabled = false;
                var CardTween = game.add.tween(mainCardObject).to({
                  x: mainCardObject.x + 200,
                  y: mainCardObject.y + 20,
                  angle: mainCardObject.angle + 15
                }, 300, Phaser.Easing.Quadratic.Out, true);
                CardTween.onComplete.add(answerResult, this);
              }

              ;
            }
          } else {// console.log("Closed Buttons!!!");
          }
        }
      } //-----------------------


      function answerResult() {
        console.log("answerResult!!! ");
        demoIsDragging = false;
        var mainCard = game.logic.mainCard;

        if (mainCard.cardObject.getChildAt(0).overlap(dropZoneYes)) {
          mainCard.cardObject.inputEnabled = false;
          console.log("dropZoneYes !!!");
          if (__phaser.game.type !== 'timefree') {
            that.yesButton_Desat.alpha = 1;
            that.noButton_Desat.alpha = 1;
          } else {
            that.yesButton_Desat.alpha = 1;
            that.noButton_Desat.alpha = 1;
            that.endGameBtn_desat.alpha = 1;
          }

          game.add.tween(mainCard.cardObject).to({
            y: game.camera.height + mainCard.cardObject.height + 50
          }, 550, Phaser.Easing.Quadratic.In, true); //console.log("YES!!!!!");

          mainCard.userAnswer(0, __phaser.game.type, apiCallback);
        } else if (mainCard.cardObject.getChildAt(0).overlap(dropZoneNo)) {
          mainCard.cardObject.inputEnabled = false;
          console.log("dropZoneNo !!!");
          if (__phaser.game.type !== 'timefree') {
            that.yesButton_Desat.alpha = 1;
            that.noButton_Desat.alpha = 1;
          } else {
            that.yesButton_Desat.alpha = 1;
            that.noButton_Desat.alpha = 1;
            that.endGameBtn_desat.alpha = 1;
          }

          game.add.tween(mainCard.cardObject).to({
            y: game.camera.height + mainCard.cardObject.height + 50
          }, 550, Phaser.Easing.Quadratic.In, true); //console.log("NO!!!!!");

          mainCard.userAnswer(1, __phaser.game.type, apiCallback);
        }

        mainCard.cardObject.scale.set(globalRatio + 0.1);
        mainCard.trueTag.alpha = 0;
        mainCard.falseTag.alpha = 0;
        yesLabel.alpha = 0;
        noLabel.alpha = 0;
      } 
      ///////////////////////////////////////////////
      //////////    SWIPE    ////////////////////////
      ///////////////////////////////////////////////


      function Swipe(game, model) {
        var self = this;
        self.DIRECTION_UP = 1;
        self.DIRECTION_DOWN = 2;
        self.DIRECTION_LEFT = 4;
        self.DIRECTION_RIGHT = 8;
        self.DIRECTION_UP_RIGHT = 16;
        self.DIRECTION_UP_LEFT = 32;
        self.DIRECTION_DOWN_RIGHT = 64;
        self.DIRECTION_DOWN_LEFT = 128;
        self.game = game;
        self.model = model !== undefined ? model : null;
        self.dragLength = 100;
        self.diagonalDelta = 50;
        self.swiping = false;
        self.direction = null;
        self.tmpDirection = null;
        self.tmpCallback = null;
        self.diagonalDisabled = false;
        this.game.input.onDown.add(function () {
          self.swiping = true;
        });
        this.game.input.onUp.add(function () {
          self.swiping = false;
        });
        this.setupKeyboard();
      }

      Swipe.prototype.setupKeyboard = function () {
        var self = this;
        var up = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        up.onDown.add(function () {
          if (self.tmpDirection !== null) {
            switch (self.tmpDirection) {
              case self.DIRECTION_LEFT:
                self.direction = self.DIRECTION_UP_LEFT;
                self.model !== null && self.model.upLeft && self.model.upLeft();
                break;

              case self.DIRECTION_RIGHT:
                self.direction = self.DIRECTION_UP_RIGHT;
                self.model !== null && self.model.upRight && self.model.upRight();
                break;

              default:
                self.direction = self.DIRECTION_UP;
                self.model !== null && self.model.up && self.model.up();
            }

            self.tmpDirection = null;
            self.tmpCallback = null;
          } else {
            self.tmpDirection = self.DIRECTION_UP;
            self.tmpCallback = self.model !== null && self.model.up ? self.model.up : null;
          }
        });
        up.onUp.add(this.keyUp, this);
        var down = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        down.onDown.add(function () {
          if (self.tmpDirection !== null) {
            switch (self.tmpDirection) {
              case self.DIRECTION_LEFT:
                self.direction = self.DIRECTION_DOWN_LEFT;
                self.model !== null && self.model.downLeft && self.model.downLeft();
                break;

              case self.DIRECTION_RIGHT:
                self.direction = self.DIRECTION_DOWN_RIGHT;
                self.model !== null && self.model.downRight && self.model.downRight();
                break;

              default:
                self.direction = self.DIRECTION_DOWN;
                self.model !== null && self.model.down && self.model.down();
            }

            self.tmpDirection = null;
            self.tmpCallback = null;
          } else {
            self.tmpDirection = self.DIRECTION_DOWN;
            self.tmpCallback = self.model !== null && self.model.down ? self.model.down : null;
          }
        });
        down.onUp.add(this.keyUp, this);
        var left = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        left.onDown.add(function () {
          if (self.tmpDirection !== null) {
            switch (self.tmpDirection) {
              case self.DIRECTION_UP:
                self.direction = self.DIRECTION_UP_LEFT;
                self.model !== null && self.model.upLeft && self.model.upLeft();
                break;

              case self.DIRECTION_DOWN:
                self.direction = self.DIRECTION_DOWN_LEFT;
                self.model !== null && self.model.downLeft && self.model.downLeft();
                break;

              default:
                self.direction = self.DIRECTION_LEFT;
                self.model !== null && self.model.left && self.model.left();
            }

            self.tmpDirection = null;
            self.tmpCallback = null;
          } else {
            self.tmpDirection = self.DIRECTION_LEFT;
            self.tmpCallback = self.model !== null && self.model.left ? self.model.left : null;
          }
        });
        left.onUp.add(this.keyUp, this);
        var right = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        right.onDown.add(function () {
          if (self.tmpDirection !== null) {
            switch (self.tmpDirection) {
              case self.DIRECTION_UP:
                self.direction = self.DIRECTION_UP_RIGHT;
                self.model !== null && self.model.upRight && self.model.upRight();
                break;

              case self.DIRECTION_DOWN:
                self.direction = self.DIRECTION_DOWN_RIGHT;
                self.model !== null && self.model.downRight && self.model.downRight();
                break;

              default:
                self.direction = self.DIRECTION_RIGHT;
                self.model !== null && self.model.right && self.model.right();
            }

            self.tmpDirection = null;
            self.tmpCallback = null;
          } else {
            self.tmpDirection = self.DIRECTION_RIGHT;
            self.tmpCallback = self.model !== null && self.model.right ? self.model.right : null;
          }
        });
        right.onUp.add(this.keyUp, this);
      };

      Swipe.prototype.keyUp = function () {
        this.direction = this.tmpDirection;
        this.tmpDirection = null;

        if (this.tmpCallback !== null) {
          this.tmpCallback.call(this.model);
          this.tmpCallback = null;
        }
      };

      Swipe.prototype.check = function () {
       //console.log("Swipe Checking!!!");

        if (this.direction !== null) {
          var result = {
            x: 0,
            y: 0,
            direction: this.direction
          };
          this.direction = null;
          return result;
        }

        if (!this.swiping) return null;
        if (Phaser.Point.distance(this.game.input.activePointer.position, this.game.input.activePointer.positionDown) < this.dragLength) return null;
        this.swiping = false;
        var direction = null;
        var deltaX = this.game.input.activePointer.position.x - this.game.input.activePointer.positionDown.x;
        var deltaY = this.game.input.activePointer.position.y - this.game.input.activePointer.positionDown.y;
        var result = {
          x: this.game.input.activePointer.positionDown.x,
          y: this.game.input.activePointer.positionDown.y
        };
        var deltaXabs = Math.abs(deltaX);
        var deltaYabs = Math.abs(deltaY);

        if (!this.diagonalDisabled && deltaXabs > this.dragLength - this.diagonalDelta && deltaYabs > this.dragLength - this.diagonalDelta) {
          if (deltaX > 0 && deltaY > 0) {
            direction = this.DIRECTION_DOWN_RIGHT;
            this.model !== null && this.model.downRight && this.model.downRight(result);
          } else if (deltaX > 0 && deltaY < 0) {
            direction = this.DIRECTION_UP_RIGHT;
            this.model !== null && this.model.upRight && this.model.upRight(result);
          } else if (deltaX < 0 && deltaY > 0) {
            direction = this.DIRECTION_DOWN_LEFT;
            this.model !== null && this.model.downLeft && this.model.downLeft(result);
          } else if (deltaX < 0 && deltaY < 0) {
            direction = this.DIRECTION_UP_LEFT;
            this.model !== null && this.model.upLeft && this.model.upLeft(result);
          }
        } else if (deltaXabs > this.dragLength || deltaYabs > this.dragLength) {
          if (deltaXabs > deltaYabs) {
            if (deltaX > 0) {
              direction = this.DIRECTION_RIGHT;
              this.model !== null && this.model.right && this.model.right(result);
            } else if (deltaX < 0) {
              direction = this.DIRECTION_LEFT;
              this.model !== null && this.model.left && this.model.left(result);
            }
          } else {
            if (deltaY > 0) {
              direction = this.DIRECTION_DOWN;
              this.model !== null && this.model.down && this.model.down(result);
            } else if (deltaY < 0) {
              direction = this.DIRECTION_UP;
              this.model !== null && this.model.up && this.model.up(result);
            }
          }
        }

        if (direction !== null) {
          result['direction'] = direction;
          return result;
        }

        return null;
      };

      if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
          module.exports = Swipe;
        }
      } //-----------------------  UPDATE


      function update() {
        // list of gamestates and their loops
        if (gameState == "preload") {
          preloaderUpdate();
        }

        if (gameState == "gameplay") {
          gameplayUpdate();
        }
      } //-----------------------
      /////////////////////////////////////////////////////
      //-----------------------  RESIZE


      function onResize() {
        // list of gamestates and their loops
       //console.log("Resizing!!!");
      } //-----------------------

    }
  },
  //-------------------
  //-------------------
  destroyGame: function destroyGame(callback) {
    this.gameObj.destroy();
    callback();
  } //-------------------

};