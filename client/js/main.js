var instafeed = {};
//Check URL for search parameter.
query = (window.location.search.length ? window.location.search.slice(1) : 'dribbble');

 //Infinite Scroll Window Bindings.
var infiniteScrollBinding = function(){
  $(window).scroll(function(evt){
    //Load more posts as needed.
    if(window.scrollY <= 0){
      insta.load('after');
    } else if($(window).scrollTop() + $(window).height() == $(document).height()) {
      insta.load('before');
    }
  });
}

/**
 * Get the Ractive Template
 */
$.get( 'templates/twitter-feed.rac').then( function ( template ) {
  /**
   * Initialize our Template
   */
    insta = new bakfyFeed({
      el: 'template-target',
      template: template,
      clientID: 'fd88310566744275a3d68092d9c175d1',
      search: query,
      complete: infiniteScrollBinding
    });//Ractive init
});//Get Template
