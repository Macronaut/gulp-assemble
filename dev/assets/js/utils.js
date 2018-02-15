function preloadImages(arrImages) {
    for (i = 0; i < arrImages.length; i++){
        var srcPath = $(arrImages[i]).attr('src').replace('/thumbs','');        
        arrImages[i] = new Image();
        arrImages[i].src = srcPath;        
    }    
}