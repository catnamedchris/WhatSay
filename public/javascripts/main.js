$(function() {
  var debug = {
    isActive: true,

    log: function() {
      if (this.isActive) {
        console.log.apply(
          console,
          Array.prototype.slice.call(arguments, 0));
      }
    }
  };

  var app = {
    fbase: {
      _URL: 'https://scorching-fire-8079.firebaseio.com',

      ref: null,

      init: function() {
        this.ref = new Firebase(this._URL);
        return this;
      },

      authData: null,

      auth: function(callback) {
        var that = this;
        var authData = that.ref.getAuth();

        if (authData) {
          that.authData = authData;
          callback(authData);
        } else {
          that.ref.authAnonymously(function(error, authData) {
            if (error) {
              debug.log('Login Failed!', error);
            } else {
              debug.log('Authenticated successfully with payload:', authData);
              that.authData = authData;
              callback(authData);
            }
          });
        }
      }
    },

    els: {
      $textarea: $('#question'),
      $submitBtn: $('#btn-submit'),
      $waitMarker: $('#wait-marker'),
      $answerArea: $('#answer-area'),
      $answerContainer: $('#answer-container'),
      $answer: $('#answer'),
      $historyBtn: $('#btn-logs'),
      $logs: $('#logs'),
      $logCloseBtn: $('#logs .btn'),
      $chat: $('#chat')
    },

    init: function() {
      var that = this;
      var els = that.els;

      screen.orientation.lock('portrait');

      that.fbase.init().auth(function(authData) {
        that.fbase.ref.on('value', that.updateTranscript.bind(that));

        els.$submitBtn.on('click', function(event) {
          var opts = {
            lines: 12, // The number of lines to draw
            length: 15, // The length of each line
            width: 8, // The line thickness
            radius: 20, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            direction: 1, // 1: clockwise, -1: counterclockwise
            color: '#fff', // #rgb or #rrggbb or array of colors
            speed: 1, // Rounds per second
            trail: 60, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            className: 'spinner', // The CSS class to assign to the spinner
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            top: '50%', // Top position relative to parent
            left: '50%' // Left position relative to parent
          };
          var spinner = new Spinner(opts).spin();

          that.currentQuestionId =
            that.fbase.ref.child(authData.uid)
              .push({
                question: els.$textarea.val(),
                questionCreatedAt: Firebase.ServerValue.TIMESTAMP
              })
              .key();

          els.$answerContainer.fadeTo('slow', 0).hide();
          els.$waitMarker
            .append(spinner.el)
            .show()
            .fadeTo('slow', 1);
        });

        els.$historyBtn.on('click', function(event) {
          if (!that.transcript) return;

          els.$chat.html('');

          Object.keys(that.transcript).forEach(function(key) {
            var entry = that.transcript[key];
            var $chatEntryTemplate = $('#chat-entry');
            var $chatEntry =
              $($chatEntryTemplate
                .html()
                .replace('`question`', entry.question)
                .replace('`answer`', entry.answer ? entry.answer : '<br/>'));

            els.$chat.append($chatEntry);
          });

          els.$logs.show().animate({ top: 0, opacity: 1 });
        });

        els.$logCloseBtn.on('click', function(event) {
          els.$logs.animate({ top: '-100%', opacity: 0 });
        });
      });
    },

    currentQuestionId: null,

    transcript: null,

    updateTranscript: function(snapshot) {
      debug.log('transcript updated:', snapshot.val());

      var val = snapshot.val();
      this.transcript = val ? val[this.fbase.authData.uid] : null;
      this.render();
    },

    render: function() {
      var els = this.els;
      var currentQuestionId = this.currentQuestionId;
      var transcript = this.transcript;

      if (transcript
        && (currentQuestionId in transcript)
        && transcript[currentQuestionId].answer) {

        els.$answer.text(transcript[currentQuestionId].answer);
        els.$waitMarker.fadeTo('slow', 0).hide();
        els.$answerContainer.show().fadeTo('slow', 1);
      }
    }
  };

  app.init();
});
