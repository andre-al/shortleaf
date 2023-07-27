function symb_form( s ){
	let f = document.createElement('form');
	
	let blank = document.createElement('span');
	blank.className = 'blank';
	f.appendChild(blank);
	
	let fname = document.createElement('input');
	fname.className = 'name';
	fname.type = 'text';
	fname.defaultValue = s.name;
	f.appendChild(fname);
	
	let fcommand = document.createElement('input');
	fcommand.className = 'command';	
	fcommand.type = 'text';
	fcommand.defaultValue = s.command;
	f.appendChild(fcommand);
	
	let fshortcut = document.createElement('input');
	fshortcut.className = 'shortcut';	
	fshortcut.type = 'text';
	fshortcut.defaultValue = s.shortcut;
	f.appendChild(fshortcut);
	
	f.oninput = function(e){ update_shortleaf_config(); };
	
	let fremove = document.createElement('span')
	fremove.className = 'remover';
	fremove.innerHTML = 'X';
	fremove.addEventListener( 'click', function(e){
		this.parentElement.remove();
		update_shortleaf_config();
	} );
	f.appendChild(fremove);
	
	return( f );
};

function comm_form( s ){
	let f = document.createElement('form');
		
	let blank = document.createElement('span');
	blank.className = 'blank';
	f.appendChild(blank);
	
	let fname = document.createElement('input');
	fname.className = 'name';
	fname.type = 'text';
	fname.defaultValue = s.name;
	f.appendChild(fname);
	
	let fcommand = document.createElement('input');
	fcommand.className = 'command';	
	fcommand.type = 'text';
	fcommand.defaultValue = s.command;
	f.appendChild(fcommand);
	
	let fshortcut = document.createElement('input');
	fshortcut.className = 'shortcut';	
	fshortcut.type = 'text';
	fshortcut.defaultValue = s.shortcut;
	f.appendChild(fshortcut);
	
	f.oninput = function(e){ update_shortleaf_config(); };
	
	let fremove = document.createElement('span')
	fremove.className = 'remover';
	fremove.innerHTML = 'X';
	fremove.style = 'margin-left: 20px; margin-right: 20px;'
	fremove.addEventListener( 'click', function(e){
		this.parentElement.remove();
		update_shortleaf_config();
	} );
	f.appendChild(fremove);
	
	return( f );
};

function env_form( s ){
	let f = document.createElement('form');
		
	let blank = document.createElement('span');
	blank.className = 'blank';
	f.appendChild(blank);
	
	let fname = document.createElement('input');
	fname.className = 'name';
	fname.type = 'text';
	fname.defaultValue = s.name;
	f.appendChild(fname);
	
	let fenv = document.createElement('input');
	fenv.className = 'env';	
	fenv.type = 'text';
	fenv.defaultValue = s.env;
	f.appendChild(fenv);
	
	let fshortcut = document.createElement('input');
	fshortcut.className = 'shortcut';	
	fshortcut.type = 'text';
	fshortcut.defaultValue = s.shortcut;
	f.appendChild(fshortcut);
	
	f.oninput = function(e){ update_shortleaf_config(); };
	
	let fremove = document.createElement('span')
	fremove.className = 'remover';
	fremove.innerHTML = 'X';
	fremove.style = 'margin-left: 20px; margin-right: 20px;'
	fremove.addEventListener( 'click', function(e){
		this.parentElement.remove();
		update_shortleaf_config();
	} );
	f.appendChild(fremove);
	
	return( f );
};

function read_div_forms(div){
	let obj = []; // Create empty array
	for ( f of div.getElementsByTagName('form') ) { // Loop over forms
		let aux = {}; // Auxiliary object
		for ( i of f ){ // Loop over input fields
			if(i.type = 'input'){
				aux[i.className] = i.value; // Add input entry to auxiliary object
			};
		};
		obj.push( aux ); // Commit auxiliary object to array
	};
	
	return( obj );
};

function update_shortleaf_config(){
	let symbols = read_div_forms( document.getElementById('symbols') );
	let commands = read_div_forms( document.getElementById('commands') );
	let envs = read_div_forms( document.getElementById('envs') );
	
	chrome.storage.sync.set( { 
		'shortleaf_config':
			{
				'symbols': symbols,
				'commands': commands,
				'environments': envs
			}
	} );
  
  chrome.runtime.sendMessage( { update_config: true } );
};

function hide_toggle(e){
	let right_tri = String.fromCharCode( 9654 );
	let down_tri = String.fromCharCode( 9660 );
	
	if( this.nextElementSibling.style.display === 'none' ){
		this.innerHTML = this.innerHTML.replace( right_tri, down_tri );
		this.nextElementSibling.style.display = 'flex';
	} else {
		this.innerHTML = this.innerHTML.replace( down_tri, right_tri );
		this.nextElementSibling.style.display = 'none';
	};
};


window.addEventListener('load', () => {
	let shortleaf_config  = {};
	
	// Load configs from sync storage or default
	chrome.storage.sync.get( 
	  { 'shortleaf_config': {} }, 
	  function(data){
		shortleaf_config = data.shortleaf_config;
		
		let br = document.createElement('br');
		
		// Symbols menu
		{
			let symbols_div = document.getElementById('symbols');
			
			for (s of shortleaf_config.symbols){
				symbols_div.appendChild( symb_form(s) );
			};
			let add = document.createElement('button')
			add.innerHTML = 'Add new'
			add.addEventListener("click", 
				function(e){
					this.parentElement.insertBefore( symb_form( {name: '', command: '', shortcut: ''} ), this );
				}
			);
			symbols_div.appendChild( add );
			
			symbols_div.appendChild( document.createElement('br') );
			symbols_div.appendChild( document.createElement('hr') );
			symbols_div.appendChild( document.createElement('br') );
		}
		
		// Commands menu
		{
			let commands_div = document.getElementById('commands');
			for (c of shortleaf_config.commands){
				commands_div.appendChild( comm_form(c) );
			};
			let add = document.createElement('button')
			add.innerHTML = 'Add new'
			add.addEventListener("click", 
				function(e){
					this.parentElement.insertBefore( comm_form( {name: '', command: '', shortcut: ''} ), this );
				}
			);
			commands_div.appendChild( add );
			
			commands_div.appendChild( document.createElement('br') );
			commands_div.appendChild( document.createElement('hr') );
			commands_div.appendChild( document.createElement('br') );
		}
		
		// Environments menu
		{
			let env_div = document.getElementById('envs');
			for (e of shortleaf_config.environments){
				env_div.appendChild( env_form(e) );
			};
			let add = document.createElement('button')
			add.innerHTML = 'Add new'
			add.addEventListener("click", 
				function(e){
					this.parentElement.insertBefore( env_form( {name: '', env: '', shortcut: ''} ), this );
				}
			);
			env_div.appendChild( add );
			
			env_div.appendChild( document.createElement('br') );
			env_div.appendChild( document.createElement('hr') );
			env_div.appendChild( document.createElement('br') );
		}
		
	  } );
	  
	// Add functionality to reset config button
	document.getElementById('reset_config').addEventListener("click",
		function(){
			chrome.storage.sync.set( { shortleaf_config: shortleaf_default_config } );
			window.location.reload();
			return false;
		}
	);
	
	document.getElementById('symbols_toggle').addEventListener( 'click', hide_toggle );
	document.getElementById('commands_toggle').addEventListener( 'click', hide_toggle );
	document.getElementById('envs_toggle').addEventListener( 'click', hide_toggle );
});