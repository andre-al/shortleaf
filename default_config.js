var shortleaf_default_config = { 
	"symbols": [ 
		{ "command": "\\alpha"		, "shortcut": "Alt-a" },
		{"command": "\\beta"		, "shortcut": "Alt-b" },
		{"command": "\\gamma"		, "shortcut": "Alt-g" },
		{"command": "\\Gamma"		, "shortcut": "Shift-Alt-g" },
		{"command": "\\delta"		, "shortcut": "Alt-d" },
		{"command": "\\Delta"		, "shortcut": "Shift-d" },
		{"command": "\\epsilon"		, "shortcut": "Alt-e" },
		{"command": "\\Epsilon"		, "shortcut": "Shift-Alt-e" },
		{"command": "\\zeta"		, "shortcut": "Alt-z" },
		{"command": "\\Zeta"		, "shortcut": "Shift-Alt-z" },
		{"command": "\\eta"			, "shortcut": "Alt-h" },
		{"command": "\\theta"		, "shortcut": "Alt-o" },
		{"command": "\\Theta"		, "shortcut": "Shift-Alt-o" },
		{"command": "\\iota"		, "shortcut": "Alt-i" },
		{"command": "\\kappa"		, "shortcut": "Alt-k" },
		{"command": "\\lambda"		, "shortcut": "Alt-l" },
		{"command": "\\Lambda"		, "shortcut": "Shift-Alt-l" },
		{"command": "\\mu"			, "shortcut": "Alt-m" },
		{"command": "\\nu"			, "shortcut": "Alt-n" },
		{"command": "\\xi"			, "shortcut": "Alt-x" },
		{"command": "\\Xi"			, "shortcut": "Shift-Alt-x" },
		{"command": "\\pi"			, "shortcut": "Alt-p" },
		{"command": "\\Pi"			, "shortcut": "Shift-Alt-p" },
		{"command": "\\rho"			, "shortcut": "Alt-r" },
		{"command": "\\sigma"		, "shortcut": "Alt-s" },
		{"command": "\\Sigma"		, "shortcut": "Shift-Alt-s" },
		{"command": "\\tau"			, "shortcut": "Alt-t" },
		{"command": "\\upsilon"		, "shortcut": "Alt-u" },
		{"command": "\\Upsilon"		, "shortcut": "Shift-Alt-u" },
		{"command": "\\phi"			, "shortcut": "Alt-f" },
		{"command": "\\Phi"			, "shortcut": "Shift-Alt-f" },
		{"command": "\\chi"			, "shortcut": "Alt-c" },
		{"command": "\\psi"			, "shortcut": "Alt-q" },
		{"command": "\\Psi"			, "shortcut": "Shift-Alt-q" },
		{"command": "\\omega"		, "shortcut": "Alt-w" },
		{"command": "\\Omega"		, "shortcut": "Shift-Alt-w" },
		{"command": "\\cdot"		, "shortcut": "Alt-." },
		{"command": "\\approx"		, "shortcut": "Alt-~" },
		{"command": "\\infty"		, "shortcut": "Alt-8" }
	],
	"commands": [
		{"name": "Square root"	, "command": "\\sqrt{}"		, "shortcut": "Ctrl-2" },
		{"name": "Fraction"		, "command": "\\frac{}{}"	, "shortcut": "Ctrl-\\" },
		{"name": "Subscript"	, "command": "_{}"			, "shortcut": "Ctrl--" },
		{"name": "Superscript"	, "command": "^{}"			, "shortcut": "Ctrl-6" },
		{"name": "Dot"			, "command": "\\dot{}"		, "shortcut": "Ctrl-Shift-." },
		{"name": "Hat"			, "command": "\\hat{}"		, "shortcut": "Ctrl-Shift-6" }
	],
	"left_rights": [
		{"name": "Parenthesis"		, "left": "("		, "right": ")"			, "shortcut": "(" },
		{"name": "\\ parenthesis"	, "left": "\\left("	, "right": "\\right)"	, "shortcut": "Ctrl-9" },
		{"name": "Single quotes"	, "left": "'"		, "right": "'" 			, "shortcut": "'" },
		{"name": "Double quotes"	, "left": "``"		, "right": "''"			, "shortcut": "\"" },

		{"name": "Derivative"			, "left": "\\frac{ \\mathrm{d} \\, "	, "right": " }{\\mathrm{d} \\, }"	, "shortcut": "Ctrl-;" },
		{"name": "Partial derivative"	, "left": "\\frac{ \\partial \\, "		, "right": " }{\\partial \\, }"		, "shortcut": "Ctrl-," },
	],
	"environments": [
		{"name": "Equation" 		, "env": "equation"		, "shortcut": "Ctrl-Shift-e"}
	]
} 

// Set config variable to this if just installed, and open config page
chrome.runtime.onInstalled.addListener(function (e){
    if(e.reason === 'install'){
		chrome.storage.sync.set( { 'shortleaf_config': shortleaf_default_config } );
		chrome.tabs.create({url: '/options.html'});
	};
});