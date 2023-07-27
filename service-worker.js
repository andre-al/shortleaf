// Set config variable to this if just installed, and open config page
chrome.runtime.onInstalled.addListener(function (e){
    if(e.reason === 'install'){
		chrome.storage.sync.set( { 'shortleaf_config': shortleaf_default_config } );
		chrome.tabs.create({url: '/options.html'});
	};
});

/*
// Keeps connections to instances of the addon on overleaf tabs.
var ports = [];

// Listen to new or closed instances
chrome.runtime.onConnect.addListener( 
  (port)=>{ 
    ports.push(port); 
    port.onDisconnect.addListener( (p)=>{ports.pop(p);} ) 
  }); 
  */