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
    function(){ view.dispatch( view.state.replaceSelection(symbol) ); return(true); }
  );
};

// Bind a command, like \srqt{}, separating left-right at the first { } or [ ] automatically.
function bind_command( shortcut, command ){
  
  let insert_pos = command.indexOf('%.%');
  // If selection insertion point unmarked, mark by searching for first empty (i.e only whitespaces) curly or square brackets
  if (insert_pos == -1){ 
    curly = command.search( /(?<!\\){\s*(?<!\\)}/ );
    square = command.search( /(?<!\\)\[\s*(?<!\\)\]/ );
    if( curly != -1 ){
      if( square != -1 ){ insert_pos = Math.min( curly, square ) + 1 }
      else{ insert_pos = curly + 1};
    } else{
      if( square != -1 ){ insert_pos = square + 1 }
      else{ insert_pos = command.length };
    };
    // Should probably come back to this treatment of whitespaces and adjust for tabs in multiline commands
    whitespace_count = command.substring(insert_pos).match( /^\s*/ )[0].length
    insert_pos = insert_pos + Math.trunc( whitespace_count / 2 )
    command = command.substring( 0, insert_pos ) + '%.%' + command.substring( insert_pos );
  }
  
  let keep_selection, selection_is_cursor, selection_from, selection_to;
  
  selection_from = command.indexOf('%|%');
  keep_selection = (selection_from == -1);
  
  if( !keep_selection ){
    selection_to = command.indexOf('%|%', selection_from+3);
    selection_is_cursor = ( selection_to == -1 );
    
    if (!selection_is_cursor){
      if( selection_to < insert_pos ){
        insert_pos -= 3;
      } else{ // selection_to > insert_pos ( == case never happens )
        selection_to -= 3
      }
      selection_to -= 3 // Since selection_from always comes before it.
    }
    
    if ( selection_from < insert_pos ){
      insert_pos -= 3;

    } else{ // selection_from > insert_pos ( == case never happens )
      selection_from -= 3;
    }
  };

  command = command.replaceAll('%|%', '').replace('%.%', '')
  
  bind_function( 
    shortcut,
    function(){
      changes = view.state.changeByRange(
        (range)=>{
          let selected_text = view.state.sliceDoc( range.from, range.to );
          
          let end_range = range.extend( range.from, range.to ); // Initialize new range object
          if( keep_selection ){
            end_range.from += insert_pos;
            end_range.to += insert_pos;
          } else if (selection_is_cursor){
            end_range.from += selection_from + ( insert_pos < selection_from ? selected_text.length : 0 );
            end_range.to = end_range.from;
          } else{
            end_range.to = end_range.from + selection_to + ( insert_pos <= selection_to ? selected_text.length : 0 );
            end_range.from += selection_from + ( insert_pos < selection_from ? selected_text.length : 0 );
          }
          return{
            range: end_range, 
            changes: [{from: range.from, insert: command.substring(0,insert_pos)}, {from: range.to, insert: command.substring(insert_pos)}]
          }
        }
      );
      view.dispatch( changes );
      return(true);
    }
  )
};

function bind_environment( shortcut, environment){
  bind_command( shortcut, "\\begin{"+environment+"}\n\t%.%\n\\end{"+environment+"}\n" );
};


function load_symbols( symbols ){
  for (s of symbols){
    bind_symbol( s.shortcut, s.command );
  };
};

// function load_left_rights( left_rights ){
  // for (lr of left_rights){
    // bind_left_right( lr.shortcut, lr.left, lr.right );
  // };
// };

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
  shortcuts = [];
	load_symbols( shortleaf_config.symbols );
	// load_left_rights( shortleaf_config.left_rights );
	load_commands( shortleaf_config.commands );
	load_envs( shortleaf_config.environments );
	
	view.dispatch({effects: kb_compartment.reconfigure( keymap.of(shortcuts) )})
};

document.addEventListener('shortleaf_config_send', function (e) {
  let shortleaf_config = e.detail.shortleaf_config;
  
  load_config( shortleaf_config );
}); 

document.dispatchEvent(new CustomEvent('shortleaf_config_listen'));