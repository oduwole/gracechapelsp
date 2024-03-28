$(document).ready(function () {
    var username;
    var $window = $(window);
    var $usernameInput = $('.usernameInput'); // Input for username
    var $loginPage = $('.login.page'); // The login page
    var $chatPage1 = $('.msg_body'); // The chatroom page
    var $chatPage = $('.msg_footer'); // The chatroom page

    var connected = false;
    var typing = false;
    var lastTypingTime;
    var $currentInput = $usernameInput.focus();
    var socket = io.connect({
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 99999
    });

    $('.icons-box').on("click", function (e) {
        

        $('.msg_wrap').show();
        $('.msg_box').show();

    });

    function showChatBar(){
        obj = $('#desktop-assistance-bar');
        //$('body').animate({'marginLeft':'-220px'}, 1000, function(){
        $('#full-page-overlay').show();

        obj.animate({ 'right': '0px' }, 800);
        supportNotifierOn = true;
        // });
    }

    function hideChatSideBar(){
        obj.animate({ 'right': '-190px' }, 800, function () {
            if (!$('.dialog').is(':visible')) { $('#full-page-overlay').hide(); }
        });
    }
    /*$('.pop-out-close-button, #full-page-overlay').on("click", function (e) {

        obj = $('#desktop-assistance-bar');
        //$('body').animate({'marginLeft':'-220px'}, 1000, function(){
        obj.animate({ 'right': '-190px' }, 800, function () {
            if (!$('.dialog').is(':visible')) { $('#full-page-overlay').hide(); }
        });
        supportNotifierOn = false;
        // });

    });*/

    $('.msg_box').hide();
    $chatPage.hide();
    $chatPage1.hide();
    $('.chat_head').click(function () {
        $('.chat_body').slideToggle('slow');
    });
    $('.msg_head').click(function () {
        $('.msg_wrap').slideToggle('slow');
    });

    $('.close').click(function () {
        $('.msg_box').hide();
    });

    $('.user').click(function () {

        $('.msg_wrap').show();
        $('.msg_box').show();
    });

    checkIsNew();
    function checkIsNew(){
        var muser= localStorage.getItem('user');
        console.log(muser);
        if(muser == '' || muser == null){

        }else{
         $loginPage.fadeOut();
         $chatPage.show();
         $chatPage1.show();
         $loginPage.off('click');
         getChats(muser);
         username = muser;
          $('.msg_wrap').show();
          $('.msg_box').show();
        }
    }

    function setUsername() {
        username = cleanInput($usernameInput.val().trim());

        // If the username is valid
        if (username) {
            if (username.trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
               // return false;
               console.error('invalid username');
            }else{
            var id = username.replace(/@/g, '').replace(/\./g, '');
                getChats(id);
            //$currentInput = $inputMessage.focus();

            // Tell the server your username
            //socket.emit('add user', username);
            socket.emit('add-user', {
                username:id, //username,
                message: 'welcome'
            });
            localStorage.setItem('user', id);
                $loginPage.fadeOut();
                $chatPage.show();
                $chatPage1.show();
                $loginPage.off('click');
            }
        }
    }
    function cleanInput(input) {
        return $('<div/>').text(input).html();
    }

    
    $('textarea').keypress(
        function (e) {
            if (e.keyCode == 13) {
                e.preventDefault();
                var msg = $(this).val();
                var id = username.replace(/@/g, '').replace(/\./g, '');
                console.log(id);
                var message={
                    username: id,//username,
                    message: msg,
                    to:'adminseekerslocuscom',
                    contid: 'msgpush' + id
                };
                socket.emit('chat message', message);
                $(this).val('');
                if (msg != '')
                    $('<div class="msg_b">' + msg + '</div>').insertBefore('.msg_push');
                $('.msg_body').scrollTop($('.msg_body')[0].scrollHeight);
            }
        });

    function getChats(id) {
        $.get('/chatmessage?id=' + id + '&author=adminseekerslocuscom', function(chats){
            chats.forEach(addChat);
        });
        /*$.get('/chatmessage?id=' + id + '&author=adminseekerslocuscom', (chats) => {
            chats.forEach(addChat);
        });*/
    }
    function addChat(msg) {
        if (msg.author == 'adminseekerslocuscom'){
            $('<div class="msg_a">' + msg.body + '</div>').insertBefore('.msg_push');
        $('.msg_body').scrollTop($('.msg_body')[0].scrollHeight);
        }else{
            $('<div class="msg_b">' + msg.body + '</div>').insertBefore('.msg_push');
        $('.msg_body').scrollTop($('.msg_body')[0].scrollHeight);
        }
        
    }

    socket.on('chat message', function (msg) {
        /*var li = document.createElement("li");
        li.appendChild(document.createTextNode(msg));
        document.getElementById("messages").appendChild(li);*/

        $(this).val('');
        console.log(msg);
        msg = cleanInput(msg.message);
        console.log(msg);
        if (msg != '')
            $('<div class="msg_a">' + msg + '</div>').insertBefore('.msg_push');
        $('.msg_body').scrollTop($('.msg_body')[0].scrollHeight);
    });

    
    $window.keydown(function (event) {
        // Auto-focus the current input when a key is typed
        if (!(event.ctrlKey || event.metaKey || event.altKey)) {
            //$currentInput.focus();
        }
        // When the client hits ENTER on their keyboard
        if (event.which === 13) {
            alert(username);
            if (username) {
                /*sendMessage();
                socket.emit('stop typing');
                typing = false;*/
            } else {
                setUsername();
            }
        }
    });

});