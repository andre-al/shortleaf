// Note to self: use this when the API changes to explore the new one
// const dispatchEvent_original = EventTarget.prototype.dispatchEvent;
// EventTarget.prototype.dispatchEvent = function (event) {
    // console.log('Event type: ', event.type);
    // console.log('Event detail: ', event.detail);
    // dispatchEvent_original.apply(this, arguments);
// };

let cm, view, keymap;

let get_editor = new Promise( 
  (resolve) => { 
    window.addEventListener( 'UNSTABLE_editor:extensions',
      (e)=>{ 
        cm = e.detail.CodeMirror;
        view = cm.EditorView.findFromDOM(document);
        keymap = cm.keymap;
        resolve();
    });
  }
)

let shortcuts = [];

// Prebinds (pending dispatch) a function to a key shortcut. 
// General function to be used by other specialized binding functions.
function bind_function(shortcut, func){
  shortcuts.push( {key: shortcut.replace( /(ctrl|cmd)/i, 'mod' ), run: func} )
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
  
  // ** Smart insertion: **
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
    // command = command.substring( 0, insert_pos ) + '%.%' + command.substring( insert_pos );
  }
  command = command.replace('%.%', '');
  // Pre-calculate halves
  let command_left = command.substring( 0, insert_pos ).replaceAll( '%|%', '' );
  let command_right = command.substring( insert_pos ).replaceAll( '%|%', '' );
  
  // ** Smart selection: **
  // To-do: change to relative-to-insertion positions
  function copy_range(r){ 
    let r_ = new r.constructor; 
    Object.assign( r_, r ); 
    return r_; 
  }
  
  let end_range; // Function that takes a selection range in the original document and returns the end selection with command changes applied
  let move_range; // Edit end range according to smart selection. Does this in place, returns void.
  {
    let selection_from, selection_to, keep_selection, selection_is_cursor;
    
    selection_from = command.indexOf('%|%');
    selection_to = command.indexOf('%|%', selection_from+3);
    keep_selection = (selection_from == -1);
    selection_is_cursor = (!keep_selection) & (selection_to == -1);
    
    if(keep_selection){
      move_range = (r)=>{return};
    } else if(selection_is_cursor){
      move_range = (r)=>{ 
        if( selection_from < insert_pos ){ r.from -= (insert_pos - selection_from - 3) }
        else{ r.from = r.to + (selection_from - insert_pos) }
        r.to = r.from;
        return;
      }
    } else{
      move_range = (r)=>{
        if( selection_from < insert_pos ){
          if( selection_to < insert_pos ){
            
          }
        }
        return;
      }
    }
    
    // if( keep_selection ){
      // selection_from_func = (r) => { return r.from }
      // selection_to_func = (r) => { return r.to }
    // } else{
      
    // }
    
    
    // if(selection_from > insert_pos ){
      // selection_from_func = (r) => { return r.to + ( selection_from - insert_pos ) }
    // } else{
      // selection_from_func = (r) => { return r.from - ( selection_from + 3 - insert_pos ) };
    // }
    
    
    // if( !keep_selection ){
      // selection_to = command.indexOf('%|%', selection_from+3);
      // selection_is_cursor = ( selection_to == -1 );
      
      // if (!selection_is_cursor){
        // if( selection_to < insert_pos ){
          // insert_pos -= 3;
        // } else{ // selection_to > insert_pos ( == case never happens )
          // selection_to -= 3
        // }
        // selection_to -= 3 // Since selection_from always comes before it.
      // } else{
        
      // }
      
      // if ( selection_from < insert_pos ){
        // insert_pos -= 3;

      // } else{ // selection_from > insert_pos ( == case never happens )
        // selection_from -= 3;
      // }
    // } else {
      // end_range = (r)=>{return r};
    // };
    
    end_range = (range)=>{
      selection_length = range.to - range.from;
      let r = copy_range( range ); // Copy original selection range (enumerable) properties
      
      if( keep_selection ){
        r.from += insert_pos;
        r.to += insert_pos;
      } else if (selection_is_cursor){
        r.from += selection_from + ( insert_pos < selection_from ? selection_length : 0 );
        r.to = r.from;
      } else{
        r.to = r.from + selection_to + ( insert_pos <= selection_to ? selection_length : 0 );
        r.from += selection_from + ( insert_pos < selection_from ? selection_length : 0 );
      }
      return r;
    };
  }
  
  // ** Clean-up markers and bind key: **
  command = command.replaceAll('%|%', '').replace('%.%', '')
  
  bind_function( 
    shortcut,
    function(){
      changes = view.state.changeByRange(
        (range)=>{
          let selected_text = view.state.sliceDoc( range.from, range.to );
          
          let indent_string = view.state.doc.lineAt( range.from ).text.match( /^(\s*)/ );
          // console.log(indent_string[0]);
          
          // let chgs = view.state.changes( {from: range.from, insert: command.substring(0,insert_pos)} );
          let chgs = view.state.changes( {from: range.from, insert: command_left} );
          let end_range = range.map( chgs.desc, assoc=1 )
          // chgs = [ chgs, view.state.changes( {from: range.to, insert: command.substring(insert_pos)} ) ];
          chgs = [ chgs, view.state.changes( {from: range.to, insert: command_right} ) ];
          
          move_range(end_range);
          
          return{
            range: end_range, //(range), 
            changes: chgs
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

// Wait until editor configuration is loaded to bind to it
let configured = new Promise( async (resolve)=>{ 
  await get_editor;
  conf_interval = setInterval( 
    () =>{ if( view.state.config.base.length > 0 ) resolve(true); clearInterval(conf_interval); }
    , 100);
});

let prepare = configured.then( ()=>{
  // Define new compartment to hold keybindings by finding an old compartment,
  let old_compartment = view.state.config.compartments.keys().next();
  // Compartmenting an empty set of keymaps using the .of method of the old compartment
  let kb_compartment = old_compartment.value.of( keymap.of([]) );
  // And using the compartment constructor method to assign this task to a new compartment
  kb_compartment.compartment =  new old_compartment.value.constructor;
  
  view.dispatch( {effects: cm.StateEffect.appendConfig.of( [ kb_compartment ] ) });
  // view.state.config.base.push( kb_compartment );
  kb_compartment = kb_compartment.compartment
  // view.dispatch( { effects: [ kb_compartment.reconfigure( keymap.of([]) ) ] } );
  
  document.addEventListener('shortleaf_config_send', (e)=>{   
    let shortleaf_config = e.detail.shortleaf_config;
    shortcuts = [];
    load_symbols( shortleaf_config.symbols );
    load_commands( shortleaf_config.commands );
    load_envs( shortleaf_config.environments );
    
    view.dispatch({effects: kb_compartment.reconfigure( keymap.of(shortcuts) )})   
  });

  document.dispatchEvent(new CustomEvent('shortleaf_config_listen'));
}); 