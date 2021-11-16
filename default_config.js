var shortleaf_default_config = { 
	"symbols": [ 
		{"name": "alpha"	, "command": "\\alpha"		, "shortcut": "Alt+a" }, 
		{"name": "beta"		, "command": "\\beta"		, "shortcut": "Alt+b" },
		{"name": "gamma"	, "command": "\\gamma"		, "shortcut": "Alt+g" },
		{"name": "Gamma"	, "command": "\\Gamma"		, "shortcut": "Shift+Alt+g" },
		{"name": "delta"	, "command": "\\delta"		, "shortcut": "Alt+d" },
		{"name": "Delta"	, "command": "\\Delta"		, "shortcut": "Shift+d" },
		{"name": "epsilon"	, "command": "\\epsilon"	, "shortcut": "Alt+e" },
		{"name": "Epsilon"	, "command": "\\Epsilon"	, "shortcut": "Shift+Alt+e" },
		{"name": "zeta"		, "command": "\\zeta"		, "shortcut": "Alt+z" },
		{"name": "Zeta"		, "command": "\\Zeta"		, "shortcut": "Shift+Alt+z" },
		{"name": "eta"		, "command": "\\eta"		, "shortcut": "Alt+h" },
		{"name": "theta"	, "command": "\\theta"		, "shortcut": "Alt+o" },
		{"name": "Theta"	, "command": "\\Theta"		, "shortcut": "Shift+Alt+o" },
		{"name": "iota"		, "command": "\\iota"		, "shortcut": "Alt+i" },
		{"name": "kappa"	, "command": "\\kappa"		, "shortcut": "Alt+k" },
		{"name": "lambda"	, "command": "\\lambda"		, "shortcut": "Alt+l" },
		{"name": "Lambda"	, "command": "\\Lambda"		, "shortcut": "Shift+Alt+l" },
		{"name": "mu"		, "command": "\\mu"			, "shortcut": "Alt+m" },
		{"name": "nu"		, "command": "\\nu"			, "shortcut": "Alt+n" },
		{"name": "xi"		, "command": "\\xi"			, "shortcut": "Alt+x" },
		{"name": "Xi"		, "command": "\\Xi"			, "shortcut": "Shift+Alt+x" },
		{"name": "pi"		, "command": "\\pi"			, "shortcut": "Alt+p" },
		{"name": "Pi"		, "command": "\\Pi"			, "shortcut": "Shift+Alt+p" },
		{"name": "rho"		, "command": "\\rho"		, "shortcut": "Alt+r" },
		{"name": "sigma"	, "command": "\\sigma"		, "shortcut": "Alt+s" },
		{"name": "Sigma"	, "command": "\\Sigma"		, "shortcut": "Shift+Alt+s" },
		{"name": "tau"		, "command": "\\tau"		, "shortcut": "Alt+t" },
		{"name": "upsilon"	, "command": "\\upsilon"	, "shortcut": "Alt+u" },
		{"name": "Upsilon"	, "command": "\\Upsilon"	, "shortcut": "Shift+Alt+u" },
		{"name": "phi"		, "command": "\\phi"		, "shortcut": "Alt+f" },
		{"name": "Phi"		, "command": "\\Phi"		, "shortcut": "Shift+Alt+f" },
		{"name": "chi"		, "command": "\\chi"		, "shortcut": "Alt+c" },
		{"name": "psi"		, "command": "\\psi"		, "shortcut": "Alt+q" },
		{"name": "Psi"		, "command": "\\Psi"		, "shortcut": "Shift+Alt+q" },
		{"name": "omega"	, "command": "\\omega"		, "shortcut": "Alt+w" },
		{"name": "Omega"	, "command": "\\Omega"		, "shortcut": "Shift+Alt+w" },
		
		{"name": "Center dot"		, "command": "\\cdot"	, "shortcut": "Alt+." },
		{"name": "Approximately"	, "command": "\\approx"	, "shortcut": "Alt+Shift+`" },
		{"name": "Infinity"			, "command": "\\infty"	, "shortcut": "Alt+8" }
	],
	"commands": [
		{"name": "Square root"	, "command": "\\sqrt{}"		, "shortcut": "Ctrl+2" },
		{"name": "Fraction"		, "command": "\\frac{}{}"	, "shortcut": "Ctrl+\\" },
		{"name": "Subscript"	, "command": "_{}"			, "shortcut": "Ctrl+-" },
		{"name": "Superscript"	, "command": "^{}"			, "shortcut": "Ctrl+6" },
		{"name": "Dot"			, "command": "\\dot{}"		, "shortcut": "Ctrl+Shift+." },
		{"name": "Hat"			, "command": "\\hat{}"		, "shortcut": "Ctrl+Shift+6" }
	],
	"left_rights": [
		{"name": "Parenthesis"		, "left": "("		, "right": ")"			, "shortcut": "(" },
		{"name": "\\ parenthesis"	, "left": "\\left("	, "right": "\\right)"	, "shortcut": "Ctrl+9" },
		{"name": "Single quotes"	, "left": "'"		, "right": "'" 			, "shortcut": "'" },
		{"name": "Double quotes"	, "left": "``"		, "right": "''"			, "shortcut": "\"" },

		{"name": "Derivative"			, "left": "\\frac{ \\mathrm{d} \\, "	, "right": " }{\\mathrm{d} \\, }"	, "shortcut": "Ctrl+;" },
		{"name": "Partial derivative"	, "left": "\\frac{ \\partial \\, "		, "right": " }{\\partial \\, }"		, "shortcut": "Ctrl+," },
	],
	"environments": [
		{"name": "Equation" 		, "env": "equation"		, "shortcut": "Ctrl+Shift+e"}
	]
} 

// Set config variable to this if just installed, and open config page
chrome.runtime.onInstalled.addListener(function (e){
    if(e.reason === 'install'){
		chrome.storage.sync.set( { 'shortleaf_config': shortleaf_default_config } );
		chrome.tabs.create({url: '/options.html'});
	};
});