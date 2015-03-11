$(function() {
  var socket = io();
  var adminSocketId = null;
  var logs = {};
  var currentSocketId = null;

  var $socketIdMenu = $('#users');
  var $textarea = $('#admin-answer');
  var $answerBtn = $('#log button');

  var logs = {};

  var storedLogs = localStorage.getItem('WhatSayAdminLogs');
  if (storedLogs) {
    logs = JSON.parse(storedLogs);
    currentSocketId = Object.keys(logs)[0];
  }

  if (currentSocketId) {
    Object.keys(logs).forEach(function(id) {
      var $userMenuItemTemplate = $('#user-menu-item');
      var $userMenuItem;

      $userMenuItem =
        $($userMenuItemTemplate
          .html()
          .replace(/`socketId`/g, id));

      if (id === currentSocketId) {
        $userMenuItem.addClass('active');
      }

      var match = 0;
      var isDisconnected = false;
      for (var i = 0; i < logs[id].length; i++) {
        if (logs[id][i].type === 'user') match++;
        else if (logs[id][i].type === 'admin') match--;

        if (logs[id][i].type === 'system') isDisconnected = true;
      }
      if (match !== 0) {
        $userMenuItem.addClass('has-new-data');
      }
      if (isDisconnected) {
        $userMenuItem.css('background-color', 'rgba(255, 0, 0, 0.1)');
      }

      $('#users').append($userMenuItem);
    });
    renderLog(currentSocketId);
  }

  function renderLog(socketId) {
    var $chat = $('#chat');
    $chat.html('');

    $('li[data-id="' + socketId + '"]')
      .addClass('active')
      .siblings()
      .removeClass('active');

    logs[socketId].forEach(function(entry) {
      var $chatEntryTemplate = $('#chat-entry');
      var $chatEntry =
        $($chatEntryTemplate
          .html()
          .replace('`userType`', entry.type))
        .html(entry.text);

      $chat.append($chatEntry);
    });
  }

  socket.on('socketId', function(id) {
    adminSocketId = id;

    socket.emit('adminConnected', adminSocketId);
  });

  socket.on('question', function(questionData) {
    currentSocketId = questionData.socketId;

    var $userMenuItemTemplate = $('#user-menu-item');
    var $userMenuItem;

    if (currentSocketId in logs) {
      $('li[data-id="' + currentSocketId + '"]')
        .addClass('has-new-data')
        .addClass('active')
        .siblings()
        .removeClass('active');

      logs[currentSocketId].push({ text: questionData.question, type: 'user' });
    } else {
      $userMenuItem =
        $($userMenuItemTemplate
          .html()
          .replace(/`socketId`/g, currentSocketId));

      $('#users').append($userMenuItem);

      $userMenuItem
        .addClass('has-new-data')
        .addClass('active')
        .siblings()
        .removeClass('active');

      logs[currentSocketId] = [{ text: questionData.question, type: 'user' }];
    }

    localStorage.setItem('WhatSayAdminLogs', JSON.stringify(logs));
    renderLog(currentSocketId);
  });

  socket.on('userDisconnected', function(id) {
    console.log('userDisconnected: ' + id);
    if (id in logs) {
      $('li[data-id="' + id + '"').css('background-color', 'rgba(255, 0, 0, 0.1)');
      logs[id].push({ text: 'USER DISCONNECTED', type: 'system' });
      localStorage.setItem('WhatSayAdminLogs', JSON.stringify(logs));
      renderLog(id);
    }
  });

  $socketIdMenu.on('click', 'li', function(event) {
    currentSocketId = $(event.currentTarget).attr('data-id');
    renderLog(currentSocketId);
  });

  $answerBtn.on('click', function(event) {
    if (currentSocketId) {
      logs[currentSocketId].push({ text: $textarea.val(), type: 'admin' });
      localStorage.setItem('WhatSayAdminLogs', JSON.stringify(logs));
      $('li[data-id="' + currentSocketId + '"').removeClass('has-new-data');
      renderLog(currentSocketId);
      socket.emit('adminAnswer', currentSocketId, $textarea.val());
      $textarea.val('');
    }
  })
});
