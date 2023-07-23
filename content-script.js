// Injects 'shortleaf.js' and configs into the page
// Necessary because a content script has no access to the page environment, with the Ace Editor instance.

window.addEventListener('load', function(){
  if (location=='https://www.overleaf.com/project') return; // Don't load on the project selection page
  
  let load_func; 
  
  load_func = function(){
    if( document.querySelector('.loading-screen') === null ){
	  console.log("Loading Shortleaf")
      var s = document.createElement('script');
      s.src = chrome.runtime.getURL('shortleaf.js');
      s.onload = function() {
        this.remove();
      };
      (document.head || document.documentElement).appendChild(s);
	} else {
      setTimeout( load_func, 1000 )
	}
  }
  
  load_func();
});


// Messages the injected script with the shortcuts to be registered, when it's ready to listen.
document.addEventListener('shortleaf_config_listen', () => {
  chrome.storage.sync.get( { 'shortleaf_config': {} }, function(data){
    document.dispatchEvent(new CustomEvent('shortleaf_config_send', { detail: data } ));
  } );
});