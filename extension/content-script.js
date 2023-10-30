// Handles communication between the extension proper and the injected script, 
// Necessary because it does not have access to the extension's resources or chrome.[...] functions.

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

// Listen for changes to configurations and relays them
chrome.storage.onChanged.addListener(
  function( changes, area ){
    if( area == 'sync' & changes.shortleaf_config.newValue !== null ){
      send_config();
    }
  }
);


window.addEventListener('load', function(){
  if ( location == 'https://www.overleaf.com/project' ) return; // Don't load on the project selection page
  if ( location.toString().search( /detached$/ ) != -1 ) return; // Don't load on detached PDF tab

  // Add shortleaf config menu page
  // Fetch shortleaf icon from storage and make it an URI
  new Promise( (resolve)=>{
    fetch( chrome.runtime.getURL('/icon128.png' ) )
    .then( (r)=>{ return r.blob() } )
    .then( (r)=>{ 
        const reader = new FileReader()
        reader.onloadend = ()=>{
          icon_uri = reader.result;
          resolve(icon_uri)
        }
        reader.readAsDataURL(r)
      })
  } ).then( (icon_uri)=>{ // Create item in menu to access shortleaf config
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
      
      i.style.background = 'url(' + icon_uri + ') 50%/contain no-repeat';
      
      btn.appendChild(i);    
      btn.innerHTML += '<p class="toolbar-label">Shortleaf</p>'

      div.appendChild(btn)
    }
    toolbar_left.appendChild( div );
  })
  
  // Fix shortcuts with dead keys, by intercepting when pressed and relaying if space is pressed.
  document.addEventListener( 'keydown', (e) => {
    if(e.key=='Dead'){
      document.addEventListener( 'keydown',
        e2=>{
          if(e2.code == 'Space'){
            const init = { code: e.code, key: e2.key, altKey: e.altKey, cancelable: true }
            let new_e = new KeyboardEvent( 'keydown', init );
            if( ! e2.target.dispatchEvent( new_e ) ) // Launch event with dead key replaced by its value.  
              e2.preventDefault() // If event was handled, cancel further processing of keybind. Otherwise, revert to default.
          }
        },
        {once: true} )
    }
  })
});

/* // Opens connection to main service worker
var port = chrome.runtime.connect();
port.onMessage.addListener( 
  (msg)=>{} 
); */