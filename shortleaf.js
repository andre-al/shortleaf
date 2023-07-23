// Get loaded Ace Editor
// var editor = (document.querySelectorAll(".ace_editor")[0]).env.editor;
//let editor = document.getElementsByClassName("ace_editor")[0].env.editor;


// Get loaded CodeMirror editor view
let view = document.querySelector('.cm-editor').querySelector(".cm-content").cmView.view

// Identify object corresponding to keymap from config facets by the 'key' property
let keymap;
let facets = view.state.config.facets;
facets_loop:
  for (i of Object.keys(facets)){
    let fcts = facets[i];
    for (fct of fcts.values()){
      if( Array.isArray( fct.value )){
        for ( ff of fct.value ){
          if( Object.keys( ff ).includes('key') ){
            keymap = fct.facet;
            break facets_loop;
          };
        };
      };
    };
  };


// Define new compartment to hold keybindings by finding an old compartment,
let old_compartment = view.state.config.compartments.keys().next();
// Compartmenting an empty set of keymaps using the .of method of the old compartment
let kb_compartment = old_compartment.value.of( keymap.of([]) );
// And using the compartment constructor method to assign this task to a new compartment
kb_compartment.compartment =  new old_compartment.value.constructor;
delete old_compartment

view.state.config.base.push( kb_compartment );
kb_compartment = kb_compartment.compartment
view.dispatch( { effects: [ kb_compartment.reconfigure( keymap.of([]) ) ] } );

let shortcuts = []

// Prebinds a function to a key shortcut. General function to be used by other specialized binding functions.
function bind_function(shortcut, func){
  shortcuts.push( {key: shortcut, mac: shortcut.replace("Ctrl","Mod"), run: func} )
};

// Bind a symbol
function bind_symbol(shortcut, symbol){
  bind_function( 
    shortcut,
	function(){ view.dispatch( view.state.replaceSelection(symbol) ); }
  );
};
//

// Bind an expression with left and right half, aware of selected content in the middle.
function bind_left_right(shortcut, left, right){
  bind_function( 
	shortcut,
    function(){
	  let selected_text = view.state.sliceDoc( view.state.selection.main.from, view.state.selection.main.to );
	  
	  view.dispatch( view.state.replaceSelection( left + selected_text + right ) );
	  
	  
/* 	  let cursor_pos = editor.getCursorPosition();
	  
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
	  // }; */
	}
  );
};

// Bind a LaTeX command, like \srqt{}, separating left-right at the first { } or [ ] automatically.
function bind_command( shortcut, command ){
  // Regular expression to find the position of the first [ or { in command
  let argpos = command.search("[\[{]");
  let left = command.substring(0,argpos+1);
  let right = command.substring(argpos+1);
  bind_left_right(shortcut,left, right);
};

function bind_environment( shortcut, environment){
  bind_left_right( shortcut, "\\begin{"+environment+"}\n\t", "\n\\end{"+environment+"}\n" );
};


function load_symbols( symbols ){
  for (s of symbols){
    bind_symbol( s.shortcut, s.command );
  };
};

function load_left_rights( left_rights ){
  for (lr of left_rights){
    bind_left_right( lr.shortcut, lr.left, lr.right );
  };
};

function load_commands( commands ){
  for (c of commands){
    bind_command( c.shortcut, c.command );
  };
};

function load_envs( environments ){
  for (e of environments){
    bind_environment( e.shortcut, e.env );
  };
};

function load_config( shortleaf_config ){
	load_symbols( shortleaf_config.symbols );
	load_left_rights( shortleaf_config.left_rights );
	load_commands( shortleaf_config.commands );
	load_envs( shortleaf_config.environments );
	
	view.dispatch({effects: kb_compartment.reconfigure( keymap.of(shortcuts) )})
};

document.addEventListener('shortleaf_config_send', function (e) {
  let shortleaf_config = e.detail.shortleaf_config;
  
  load_config( shortleaf_config );
}); 

document.dispatchEvent(new CustomEvent('shortleaf_config_listen'));