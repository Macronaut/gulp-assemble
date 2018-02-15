window.Tether = {};

$(window).ready(function(){
    $('[data-toggle="modal"]').bind('click',function(){        
        strSrc = $(this).find('.card-img').attr('src').replace('/thumbs','');
        strTitle = $(this).find('.card-title').html();        
        $('.modal-image').attr('src',strSrc);
        $('.modal-image-title').html(strTitle);
    })
})