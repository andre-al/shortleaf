// Open config page if just installed or updated from 0.1.
chrome.runtime.onInstalled.addListener(function (e){
  if(e.reason === 'install'){
    chrome.tabs.create({url: '/options.html'});
	};
  if(e.reason === 'update'){
    if( e.previousVersion == '0.1' | e.previousVersion == '0.1.1' ){
      chrome.storage.sync.remove( 'shortleaf_config' )
      chrome.tabs.create({url: '/options.html'});
    }
  }
});

chrome.runtime.onMessage.addListener(
  (msg)=>{
    if(msg.open_options) chrome.tabs.create({url: '/options.html'});
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