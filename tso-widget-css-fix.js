/**
 * tso-widget-css-fix.js — Removes rogue widget <style> rules that break table layouts.
 */
( function () {
	'use strict';

	function fixWidgetCss() {
		var styles = document.querySelectorAll( 'style' );
		styles.forEach( function ( s ) {
			if (
				s.textContent
				&& s.textContent.indexOf( '291' ) !== -1
				&& s.textContent.indexOf( 'max-width' ) !== -1
			) {
				s.parentNode.removeChild( s );
			}
		} );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', fixWidgetCss );
	} else {
		fixWidgetCss();
	}
	setTimeout( fixWidgetCss, 500 );
	setTimeout( fixWidgetCss, 1500 );
}() );
