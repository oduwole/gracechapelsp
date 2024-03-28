/*!
* Start Bootstrap - Coming Soon v6.0.7 (https://startbootstrap.com/theme/coming-soon)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-coming-soon/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

$(function(e){
    loadReadLanding();
})

function loadReadLanding() {
    var myModal = new bootstrap.Modal(document.getElementById('rccgspModal'));
    var title = '<i class="fa fa-info" style="color:#eb3d5d; background-color:#fff2f5; border-radius: 60px; box-shadow: 0 0 2px #888;padding: 0.5em 0.6em;"></i>' +
        ' <b><span style="font-size:15px;"> PLEASE READ</span></b>';
    var body = `
    <img src="assets/img/innaugural.jpg" style="width:400px; height:565px" />
    `;
    //$('.modal-body').html(body);
    $('#prembd').html(body);
    //$('.modal-title').html(title);
    /*myModal.show({
        keyboard: false,
        backdrop: 'static'
    });*/
}