/*******
 *
 * Instagram Infinite Scroll Loader
 *
 * by Dugan Knoll
 */

var bakfyFeed = Ractive.extend({
  lazy:true,

  makeQuery: function(method) {
    var base, endpoint, final, callback;
    base = "http://localhost:8000/feeds/list";
    switch (this.data.method) {
      case "popular":
        endpoint = "media/popular";
        break;
      case "tags":
        if (typeof this.data.search !== 'string') {
          throw new Error("No tag name specified. Use the 'tagName' option.");
        }
        endpoint = "tags/" + this.data.search + "/media/recent";
        break;
      case "location":
        if (typeof this.data.location !== 'number') {
          throw new Error("No location specified. Use the 'locationId' option.");
        }
        endpoint = "locations/" + this.data.search + "/media/recent";
        break;
      case "user":
        if (typeof this.data.userId !== 'number') {
          throw new Error("No user specified. Use the 'userId' option.");
        }
        if (typeof this.data.accessToken !== 'string') {
          throw new Error("No access token. Use the 'accessToken' option.");
        }
        endpoint = "users/" + this.data.search + "/media/recent";
        break;
      default:
        throw new Error("Invalid option for get: '" + this.data.get + "'.");
    }    
    final=base+"?clientID=1";      
    switch(method){
      case 'before':        
        final += "&action=before&min_id="+this.data.instagramData.nextPage;
        callback = "&amp;callback=instagramReceiverRearAppend&amp;min_id="+this.data.instagramData.nextPage;
        break;
      case 'after':
        //final=base+"/after?clientID=1";
        final += "&action=after&max_id="+this.data.instagramData.prevPage;
        callback = "&amp;callback=instagramReceiverFrontAppend&amp;max_id="+this.data.instagramData.prevPage;
        break;
      case 'replace':
        callback = "&amp;callback=instagramReceiverReplace";
        break;
    }
    console.log(final+callback);
    return final+callback;
  },

 /**
  * Load('replace' / 'before' / 'after')
  *
  * Loads more instagram data.  Either replaces current data, appends data before feed, or appends data after feed
  */
  load: function(method){
    //No older data to load. stop now.
    if(method == 'after' && this.data.endOfFeed){
      return false;
    }
    //We're already searching for something... Patience
    if(this.data.loading == true) {
      return false;
    }
    else {
      this.set('loading', true);
    }  
    var tag = document.createElement('script');
    tag.id = 'instagram-script-loader';
    tag.onerror = function(){console.log('unable to reach IG API');};
    tag.src = this.makeQuery(method);    
    var firstScriptTag = document.getElementsByTagName('script')[0];
    console.log(method);
    console.log(this.makeQuery(method));
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  },

  /**
   * Endpoint for loading newer photos
   */
  getNewer: function(){    
    this.load('after');
  },
  /**
   * Endpoint for loading older photos
   */
  getOlder: function(){
    this.load('before');
  },


  /********
   * INIT FUNCTION.
   *

   * Make sure ClientID and hashtag are provided.

   * Bind Instagram Data Callbacks to window
     - replaceData(data)
     - frontAppend(data)
     - rearAppend(data)

   */
  init: function(options){
    // Initialize Parameters
    this.data.instagramData = [];
    this.data.current = -1;
    this.data.min = 0;
    this.data.max = 0,
    this.data.lightbox = false;
    this.data.endOfFeed = false;
    this.data.postsPerPage = 6;
    this.data.method = 'tags';
    this.data.message = '';


    //Init Client ID
    if(options.clientID == undefined){
      console.log('No Client ID Provided');
      this.success = false;
      return false;
    } else{
      this.data.clientID = options.clientID;
    }
    if(options.dataCallback != undefined){
      this.dataCallback = options.dataCallback;
    } else {
      this.dataCallback = function(){};
    }

    //Init search
    if(options.search == undefined){
      console.log('No Hashtag Provided');
      this.success = false;
      return false;
    } else{
      this.data.search = this.data.searched  = options.search;
    }

    this.validateData = function(data){
      this.set('loading', false);
      this.dataCallback(data);
      return true;
    }

    //Replace data.
    this.replaceData = function(newData){      
      if(newData.response.feeds == undefined){
        this.set('message', 'Sorry no results for #'+this.data.search+" :[");
      } else{        
        this.set('instagramData', newData.response);    
        this.set('message', '');
        this.set('endOfFeed', false);
        this.data.instagramData.prevPage = newData.response.prevPage;
        this.data.instagramData.nextPage = newData.response.nextPage;
      }      
      this.dataCallback(newData);
    }
    window.instagramReceiverReplace = (function(obj){
      return function (data) {        
        console.log(data);
        if(obj.validateData(data)){          
          obj.replaceData(data);
        }
      }
    })(this);

    //Append data to front of array and update data structure.
    this.frontAppend = function(newData){
      //console.log(newData);
      if(newData.response.feeds.length==0){
        console.log('Nothing to append');
      } else{
        console.log('front Append');
        this.set('instagramData.feeds', newData.response.feeds.concat(this.data.instagramData.feeds));
        this.data.instagramData.prevPage = newData.response.prevPage;
      }
      this.dataCallback(newData);
    }
    window.instagramReceiverFrontAppend = (function(obj){
      return function (data) {
        console.log(data);
        if(obj.validateData(data)){
          obj.frontAppend(data);
        }
      }
    })(this);

    //Append data to rear and update data structure.
    this.rearAppend = function(newData){
      console.log('rear Append')      
      this.set('instagramData.feeds', this.data.instagramData.feeds.concat(newData.response.feeds));
      //Set the pagination
      if(newData.response.nextPage === undefined){
        this.set('endOfFeed', true);
      } else{
        this.data.instagramData.nextPage = newData.response.nextPage;
      }
      this.dataCallback(newData);
    }
    window.instagramReceiverRearAppend = (function(obj){
      return function (data) {
        console.log(data);
        if(obj.validateData(data)){
          obj.rearAppend(data);
        }
      }
    })(this);

    this.observe('search', function(oldVal, newVal){this.load('replace');});
    this.load('replace');
  }

});
