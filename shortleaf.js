// Get loaded Ace Editor
// var editor = (document.querySelectorAll(".ace_editor")[0]).env.editor;
let editor = document.getElementsByClassName("ace_editor")[0].env.editor;

// Binds a function to a key shortcut. General function to be used by other specialized binding functions.
function bind_function(func, shortcut, name){
  editor.commands.addCommand({
    name: name,
    bindKey: {win: shortcut, mac: shortcut.replace("Ctrl","Command") },
    exec: func,
    readOnly: false
  });
};

// Bind a symbol
function bind_symbol(symbol, shortcut, name){
  bind_function( 
    function(){ editor.insert(symbol) } ,
    shortcut, name
  );
};

// Bind an expression with left and right half, aware of selected content in the middle.
function bind_left_right(left, right, shortcut, name){
  bind_function( 
    function(){
	  let cursor_pos = editor.getCursorPosition();
	  
	  let empty_selection = editor.selection.isEmpty();
	  if ( empty_selection ){ // If selection is empty, (...)
        editor.selection.selectWordRight(); // Try to select a word to the right. (...)
		if (editor.getSelectedText().trim() == ''){ // If that fails (i.e., selected whitespace), (...)
		  editor.moveCursorToPosition( cursor_pos ); // then reset cursor position and deselect.
		  editor.selection.clearSelection();
	    } 
		else{
		  empty_selection = false;
		}
	  }
	  
	  editor.insert( left + editor.getSelectedText() );
	  cursor_pos = editor.getCursorPosition();
	  editor.insert( right );
	  // // Restore cursor position to between left and right content if there was no selection.
	  // if( empty_selection ) { 
	  editor.moveCursorToPosition( cursor_pos ); 
	  // };
	}, 
    shortcut, name
  );
};

// Bind a LaTeX command, like \srqt{}, separating left-right at the first { } or [ ] automatically.
function bind_command(command, shortcut, name){
  // Regular expression to find the position of the first [ or { in command
  let argpos = command.search("[\[{]");
  let left = command.substring(0,argpos+1);
  let right = command.substring(argpos+1);
  bind_left_right(left, right, shortcut, name);
};

function bind_environment(environment, shortcut, name){
  bind_left_right("\\begin{"+environment+"}\n\t", "\n\\end{"+environment+"}\n", shortcut, name);
};


function load_symbols( symbols ){
  for (s of symbols){
    bind_symbol( s.command, s.shortcut, s.name );
  };
};

function load_left_rights( left_rights ){
  for (lr of left_rights){
    bind_left_right( lr.left, lr.right, lr.shortcut, lr.name );
  };
};

function load_commands( commands ){
  for (c of commands){
    bind_command( c.command, c.shortcut, c.name );
  };
};

function load_envs( environments ){
  for (e of environments){
    bind_environment( e.env, e.shortcut, e.name );
  };
};

function load_config( shortleaf_config ){
	load_symbols( shortleaf_config.symbols );
	load_left_rights( shortleaf_config.left_rights );
	load_commands( shortleaf_config.commands );
	load_envs( shortleaf_config.environments );
};

document.addEventListener('shortleaf_config_send', function (e) {
  let shortleaf_config = e.detail.shortleaf_config;
  
  load_config( shortleaf_config );
}); 

document.dispatchEvent(new CustomEvent('shortleaf_config_listen'));