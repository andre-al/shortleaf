// Injects 'shortleaf.js' and configs into the page
// Necessary because a content script has no access to the page environment, with the Code Mirror editor instance.

window.addEventListener('load', function(){
  if ( location == 'https://www.overleaf.com/project' ) return; // Don't load on the project selection page
  if ( location.toString().search( /detached$/ ) != -1 ) return; // Don't load on detached PDF tab
  
  // console.log("Loading Shortleaf")
  var s = document.createElement('script');
  s.src = chrome.runtime.getURL('shortleaf.js');
  s.onload = function() {
    this.remove();
  };
  (document.head || document.documentElement).appendChild(s);
});


// Function to send current extension configuration to the injected script
function send_config(){
  chrome.storage.sync.get( { 'shortleaf_config': {} }, 
    function(data){
      document.dispatchEvent(new CustomEvent('shortleaf_config_send', { detail: data } ));
    } 
  );
};

// When the injected instance messages that it is ready to listen for the configuration, send it
document.addEventListener( 'shortleaf_config_listen', 
  () => { send_config();}
);

// Listen for changes to configurations
chrome.storage.onChanged.addListener(
  function( changes, area ){
    if( area == 'sync' & changes.shortleaf_config.newValue !== null ){
      send_config();
    }
  }
)


/* // Opens connection to main service worker
var port = chrome.runtime.connect();
port.onMessage.addListener( 
  (msg)=>{} 
); */
