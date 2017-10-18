/* To avoid CSS expressions while still supporting IE 7 and IE 6, use this script */
/* The script tag referencing this file must be placed before the ending body tag. */

/* Use conditional comments in order to target IE 7 and older:
	<!--[if lt IE 8]><!-->
	<script src="ie7/ie7.js"></script>
	<!--<![endif]-->
*/

(function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'oscar\'">' + entity + '</span>' + html;
	}
	var icons = {
		'icon-hat': '&#xe800;',
		'icon-phone': '&#xe801;',
		'icon-email': '&#xe802;',
		'icon-facebook': '&#xe803;',
		'icon-google': '&#xe804;',
		'icon-twitter': '&#xe805;',
		'icon-linkedin': '&#xe806;',
		'icon-github': '&#xe807;',
		'icon-skype': '&#xe808;',
		'0': 0
		},
		els = document.getElementsByTagName('*'),
		i, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
}());
