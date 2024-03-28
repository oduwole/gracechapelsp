
(function ($) {
    "use strict";

    /*==================================================================
    [ Validate after type ]*/
    $('.validate-input .input100').each(function(){
        $(this).on('blur', function(){
            if(validate(this) == false){
                showValidate(this);
            }
            else {
                $(this).parent().addClass('true-validate');
            }
        })    
    })
  
  
    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    //$('.validate-form').on('click',function(){booknow
    $('#booknow').on('click', function () {
        
        var check = true;

        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }

        if(check){
            $('#ldgif').toggle('hidden');
            $(this).toggle('hidden');
            const data ={
                product: $('#product').val().trim(),
                profileId: $('#profileId').val().trim(),
                email: $('#email').val().trim(),
                name: $('#name').val().trim(),
                phoneNumber: $('#phoneno').val(),
                sex: $('#sex').val(),
                location: $('#location').val(),
                details: $('#message').val()
            };
            console.log(data);
            $.post('bookings',data,function(result){
                window.location.href ='/listBookings';
            });
            console.log('log');
        }
        

        return check;
    });


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
           $(this).parent().removeClass('true-validate');
        });
    });

     function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        } else if ($(input).attr('type') == 'text' && $(input).attr('name') == 'product'){
            console.log($(input).val().trim());
            if (!($(input).val().trim() =='poetry premium pack' ||
                $(input).val().trim() == 'poetry starter pack' ||
                $(input).val().trim() == 'poetry value pack' ||
                $(input).val().trim() == 'book review starter pack' ||
                $(input).val().trim() == 'book review value pack' ||
                $(input).val().trim() == 'book review premium pack' )){
                return false;
            }
        } else if ($(input).attr('type') == 'text' && $(input).attr('name') == 'sex') {
            if (!($(input).val().trim() == 'male' || 
            $(input).val().trim() == 'female' )){
                return false;
            }
        }else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');

        $(thisAlert).append('<span class="btn-hide-validate">&#xf136;</span>')
        $('.btn-hide-validate').each(function(){
            $(this).on('click',function(){
               hideValidate(this);
            });
        });
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();
        $(thisAlert).removeClass('alert-validate');
        $(thisAlert).find('.btn-hide-validate').remove();
    }
    

    /*==================================================================
    [ Show / hide contact ]*/
    $('.btn-hide-contact100').on('click', function(){
        $('.container-contact100').fadeOut(300);
    });

    $('.btn-show-contact100').on('click', function(){
        $('.container-contact100').fadeIn(300);
    });

})(jQuery);