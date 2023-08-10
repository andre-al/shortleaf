// Injects 'shortleaf.js' and configs into the page
// Necessary because a content script has no access to the page environment, with the Code Mirror editor instance.

// Shortleaf icon
let icon_uri;
let get_icon = new Promise( (resolve)=>{
  fetch( chrome.runtime.getURL('/icon128.png' ) )
  .then( (r)=>{ return r.blob() } )
  .then( (r)=>{ 
      const reader = new FileReader()
      reader.onloadend = ()=>{
        icon_uri = reader.result;
        resolve()
      }
      reader.readAsDataURL(r)
    })
} )

window.addEventListener('load', async function(){
  if ( location == 'https://www.overleaf.com/project' ) return; // Don't load on the project selection page
  if ( location.toString().search( /detached$/ ) != -1 ) return; // Don't load on detached PDF tab
  
  // console.log("Loading Shortleaf")
  var s = document.createElement('script');
  s.src = chrome.runtime.getURL('shortleaf.js');
  s.onload = function() {
    this.remove();
  };
  (document.head || document.documentElement).appendChild(s);
  
  // Add shortleaf config menu page
  let toolbar_left = document.querySelector('.toolbar-left');
  let div = document.createElement('div');
  div.className = 'toolbar-item'
  {
    let btn = document.createElement('button')
    btn.className = 'btn btn-full-height'
    btn.addEventListener( 'click', ()=>{ chrome.runtime.sendMessage({open_options: true}) } )
    
    let i = document.createElement('i')
    i.className = 'fa'
    i.style.height = '18px';
    i.style.width = '18px';
    
    await get_icon;
    i.style.background = 'url(' + icon_uri + ') 50%/contain no-repeat';
    
    btn.appendChild(i);    
    btn.innerHTML += '<p class="toolbar-label">Shortleaf</p>'

    div.appendChild(btn)
  }
  toolbar_left.appendChild( div );
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

// 
 document.addEventListener( 'keydown', (e) => {
  if(e.key=='Dead'){
    document.addEventListener( 'keydown',
      e2=>{
        if(e2.code == 'Space'){
          const init = { code: e.code, key: e2.key, altKey: e.altKey, cancelable: true }
          let newe = new KeyboardEvent( 'keydown', init );
          if( ! e2.target.dispatchEvent( newe ) ) // Launch event with dead key replaced by its value.  
            e2.preventDefault() // If event was handled, cancel further processing of keybind. Otherwise, revert to default.
        }
      },
      {once: true} )
  }
})

/* // Opens connection to main service worker
var port = chrome.runtime.connect();
port.onMessage.addListener( 
  (msg)=>{} 
); */