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
          that.ref.authWithPassword({
            email: 'quanct@gmail.com',
            password: $('#admin-sign-in input').val()
          }, function(error, authData) {
            $('#admin-sign-in input').val('');
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
      $uidMenu: $('#users'),
      $chat: $('#chat')
    },

    init: function() {
      var that = this;
      var els = that.els;

      that.fbase.init();
      $('#admin-sign-in-btn').on('click', function(event) {
        that.fbase.auth(function(authData) {
          that.fbase.ref.on('value', that.updateTranscript.bind(that));

          $('#users').on('click', 'li', function(event) {
            that.currentUid = $(event.currentTarget).attr('data-id');
            that.render();
          });
        });
      });
      $('#admin-sign-out-btn').on('click', function(event) {
        if (that.fbase.ref) that.fbase.ref.unauth();
      });
    },

    currentUid: null,

    transcript: null,

    updateTranscript: function(snapshot) {
      debug.log('transcript updated:', snapshot.val());

      var val = snapshot.val();
      this.transcript = val;
      if (!this.currentUid) {
        this.currentUid = this.transcript ? Object.keys(this.transcript)[0] : null;
      }
      this.render();
    },

    render: function() {
      var that = this;
      var els = that.els;

      if (!that.transcript) return;

      els.$uidMenu.html('');

      Object.keys(that.transcript).forEach(function(key) {
        var $uidMenuItemTemplate = $('#user-menu-item');
        var $uidMenuItem;

        $uidMenuItem =
          $($uidMenuItemTemplate
            .html()
            .replace(/`uid`/g, key));

        if (key === that.currentUid) {
          $uidMenuItem.addClass('active');
        }

        for (var qid in that.transcript[key]) {
          if (!that.transcript[key][qid].answer) {
            $uidMenuItem.addClass('has-new-data');
            break;
          }
        }

        els.$uidMenu.append($uidMenuItem);
      });

      els.$chat.html('');

      Object.keys(that.transcript[that.currentUid]).forEach(function(questionId) {
        var entry = that.transcript[that.currentUid][questionId];
        var $chatEntryTemplate = $('#chat-entry');
        var $chatEntry =
          $($chatEntryTemplate
            .html()
            .replace('`question`', entry.question)
            .replace('`answer`', entry.answer ? entry.answer : '<br/>'));

        if (!entry.answer) $chatEntry.css('background-color', 'rgba(255, 0, 0, 0.1');

        $chatEntry.find('button').on('click', function(event) {
          var answer = $chatEntry.find('textarea').val();
          var ref = new Firebase('https://scorching-fire-8079.firebaseio.com/' + that.currentUid)
          ref.child(questionId).update({
            answer: answer,
            answerCreatedAt: Firebase.ServerValue.TIMESTAMP
          });
        });

        els.$chat.append($chatEntry);
      });
    }
  };

  app.init();
});
