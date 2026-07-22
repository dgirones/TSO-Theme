/**
 * tso-mobile-menu.js — Hamburger toggle with Escape, focus trap, ARIA.
 */
( function () {
	'use strict';

	var toggle = document.getElementById( 'tso-menu-toggle' );
	var nav    = document.getElementById( 'site-navigation' );

	if ( ! toggle || ! nav ) {
		return;
	}

	var mq = window.matchMedia( '(max-width: 768px)' );
	var lastFocus = null;

	function isOpen() {
		return nav.classList.contains( 'is-open' );
	}

	function getFocusable() {
		return Array.prototype.slice.call(
			nav.querySelectorAll(
				'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
			)
		).filter( function ( el ) {
			return el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement;
		} );
	}

	function openMenu() {
		if ( ! mq.matches || isOpen() ) {
			return;
		}
		lastFocus = document.activeElement;
		nav.classList.add( 'is-open' );
		toggle.setAttribute( 'aria-expanded', 'true' );
		document.body.classList.add( 'tso-nav-open' );

		var items = getFocusable();
		if ( items.length ) {
			items[0].focus();
		}
	}

	function closeMenu( opts ) {
		if ( ! isOpen() ) {
			return;
		}
		opts = opts || {};
		nav.classList.remove( 'is-open' );
		toggle.setAttribute( 'aria-expanded', 'false' );
		document.body.classList.remove( 'tso-nav-open' );

		if ( opts.restoreFocus === false ) {
			lastFocus = null;
			return;
		}

		if ( lastFocus && typeof lastFocus.focus === 'function' ) {
			lastFocus.focus();
		} else {
			toggle.focus();
		}
		lastFocus = null;
	}

	function toggleMenu() {
		if ( isOpen() ) {
			closeMenu();
		} else {
			openMenu();
		}
	}

	toggle.addEventListener( 'click', function ( e ) {
		e.preventDefault();
		if ( ! mq.matches ) {
			return;
		}
		toggleMenu();
	} );

	document.addEventListener( 'keydown', function ( e ) {
		if ( ! isOpen() ) {
			return;
		}

		if ( e.key === 'Escape' ) {
			e.preventDefault();
			closeMenu();
			return;
		}

		if ( e.key !== 'Tab' ) {
			return;
		}

		var items = getFocusable();
		if ( ! items.length ) {
			return;
		}

		var first = items[0];
		var last  = items[items.length - 1];

		if ( e.shiftKey ) {
			if ( document.activeElement === first || document.activeElement === toggle ) {
				e.preventDefault();
				last.focus();
			}
		} else if ( document.activeElement === last ) {
			e.preventDefault();
			toggle.focus();
		} else if ( document.activeElement === toggle ) {
			e.preventDefault();
			first.focus();
		}
	} );

	document.addEventListener( 'click', function ( e ) {
		if ( ! isOpen() ) {
			return;
		}
		if ( e.target.closest( '#site-navigation' ) || e.target.closest( '#tso-menu-toggle' ) ) {
			return;
		}
		closeMenu();
	} );

	nav.addEventListener( 'click', function ( e ) {
		var link = e.target.closest( 'a' );
		if ( ! link || ! mq.matches ) {
			return;
		}
		var href = link.getAttribute( 'href' ) || '';
		if ( href && href !== '#' ) {
			// Avoid focus restore flash before navigation.
			closeMenu( { restoreFocus: false } );
		}
	} );

	function onViewportChange() {
		if ( ! mq.matches ) {
			closeMenu( { restoreFocus: false } );
		}
	}

	if ( typeof mq.addEventListener === 'function' ) {
		mq.addEventListener( 'change', onViewportChange );
	} else if ( typeof mq.addListener === 'function' ) {
		mq.addListener( onViewportChange );
	}
}() );
