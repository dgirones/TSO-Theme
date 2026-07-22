/**
 * tso-tiled-gallery-fix.js
 * Corregeix el bug TypeError de jetpack/tiled-gallery quan es
 * transforma cap a core/gallery i es torna enrere a l'editor Gutenberg.
 * El bug: attributes.images pot ser undefined i .filter() falla.
 */
( function() {
    'use strict';

    function applyFix() {
        if ( ! window.wp || ! window.wp.blocks ) return;

        var blockType = window.wp.blocks.getBlockType( 'jetpack/tiled-gallery' );
        if ( ! blockType ) return;

        var transforms = blockType.transforms;
        if ( ! transforms ) return;

        // Fix transformacions FROM (altres blocs → jetpack/tiled-gallery)
        if ( Array.isArray( transforms.from ) ) {
            transforms.from = transforms.from.map( function( t ) {
                if ( typeof t.transform !== 'function' ) return t;
                var orig = t.transform;
                t.transform = function( attributes, innerBlocks ) {
                    try {
                        if ( ! attributes ) attributes = {};
                        if ( ! Array.isArray( attributes.images ) ) attributes.images = [];
                        if ( ! Array.isArray( attributes.ids ) ) attributes.ids = [];
                        return orig.call( this, attributes, innerBlocks );
                    } catch ( e ) {
                        console.warn( '[TSO] jetpack/tiled-gallery from-transform error:', e.message );
                        return window.wp.blocks.createBlock( 'jetpack/tiled-gallery', { images: [], ids: [] } );
                    }
                };
                return t;
            } );
        }

        // Fix transformacions TO (jetpack/tiled-gallery → altres blocs)
        if ( Array.isArray( transforms.to ) ) {
            transforms.to = transforms.to.map( function( t ) {
                if ( typeof t.transform !== 'function' ) return t;
                var orig = t.transform;
                t.transform = function( attributes, innerBlocks ) {
                    try {
                        if ( ! attributes ) attributes = {};
                        if ( ! Array.isArray( attributes.images ) ) attributes.images = [];
                        if ( ! Array.isArray( attributes.ids ) ) attributes.ids = [];
                        return orig.call( this, attributes, innerBlocks );
                    } catch ( e ) {
                        console.warn( '[TSO] jetpack/tiled-gallery to-transform error:', e.message );
                        return window.wp.blocks.createBlock( 'core/gallery', {}, innerBlocks || [] );
                    }
                };
                return t;
            } );
        }

        console.log( '[TSO] jetpack/tiled-gallery transform fix applied.' );
    }

    // Intentar aplicar el fix quan wp.domReady estigui disponible
    if ( window.wp && window.wp.domReady ) {
        window.wp.domReady( applyFix );
    } else {
        // Fallback: esperar que tot carregui
        window.addEventListener( 'load', applyFix );
    }

}() );
