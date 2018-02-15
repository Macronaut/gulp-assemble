window.Tether = {};

$(window).ready(function(){

    var arrPreload = $('[data-toggle="modal"]').find('.card-img');
    
    preloadImages(arrPreload);

    $('[data-toggle="modal"]').bind('click',function(){        
        strSrc = $(this).find('.card-img').attr('src').replace('/thumbs','');
        strTitle = $(this).find('.card-title').text().replace(/[^a-zA-Z ]/g, "").trim();        
        strDescription = $(this).find('.card-title').attr('data-description');        
        $('.modal-image').attr('src',strSrc);
        $('.modal-image-title').text(strTitle);
        $('.modal-image-description').html(strDescription);
    })
})