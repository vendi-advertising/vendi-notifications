(function()
{
    "use strict";

    var

        addEvent = window.addEventListener ?
                  function (elem, type, method)
                  {
                     elem.addEventListener(type, method, false);
                  }
                  :
                  function (elem, type, method)
                  {
                     elem.attachEvent('on' + type, method);
                  },

        hasClass = function( element, className )
        {
            if( ! element || ! element.className )
            {
                return false;
            }

            //Trick for handling missing classes or just single classes, just surround everything with whitespace
            return ( ' ' + element.className + ' ' ).indexOf( ' ' + className + ' ' ) > -1;
        },

        addClass = function( element, className )
        {
            if( ! element || hasClass( element, className ) )
            {
                return;
            }

            //Append the class and remove any extra whitespace
            element.className += ' ' + className;
            element.className = element.className.replace( /\s+/g, ' ' );
        },

        createOnReadyEvent = function( fn, win  )
        {
            win = win || window;

            var
                done = false,
                top = true,

                doc = win.document,
                root = doc.documentElement,
                modern = doc.addEventListener,

                add = modern ? 'addEventListener' : 'attachEvent',
                rem = modern ? 'removeEventListener' : 'detachEvent',
                pre = modern ? '' : 'on',

                init = function( e )
                {
                    if ( e.type == 'readystatechange' && doc.readyState != 'complete' )
                    {
                        return;
                    }

                    (e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);

                    if (!done && (done = true)) fn.call(win, e.type || e);
                },

                poll = function()
                {
                    try
                    {
                        root.doScroll( 'left' );
                    }
                    catch( e )
                    {
                        setTimeout( poll, 50 );
                        return;
                    }

                    init( 'poll' );
                }
            ;

            if ( doc.readyState == 'complete' )
            {
                fn.call( win, 'lazy' );
            }
            else
            {
                if ( ! modern && root.doScroll )
                {
                    try
                    {
                        top = ! win.frameElement;
                    }
                    catch( e )
                    {
                        //NOOP
                    }

                    if (top)
                    {
                        poll();
                    }
                }

                doc[add](pre + 'DOMContentLoaded', init, false);
                doc[add](pre + 'readystatechange', init, false);
                win[add](pre + 'load', init, false);
            }
        },

        findParentNodeByClassName = function( obj, className )
        {
            if( hasClass( obj, className ) )
            {
                return obj;
            }

            if( ! obj.parentNode )
            {
                return null;
            }

            return findParentNodeByClassName( obj.parentNode, className );
        },

        getEventTarget = function( e )
        {
            var targ;

            if( ! e )
            {
                e = window.event;
            }

            if( e.target )
            {
                targ = e.target;
            }
            else if( e.srcElement )
            {
                targ = e.srcElement;
            }

            return targ;
        },

        removeNode = function( node )
        {
            node.parentNode.removeChild( node );
        },

        makeRemoveNodeFunction = function( node )
        {
            return  function()
                    {
                        removeNode( node );
                    };
        },

        closeBox = function( e )
        {
            e = getEventTarget( e );

            var
                parent = findParentNodeByClassName( e, 'notice' )
            ;

            if( parent )
            {
                addClass( e, 'dismissing' );
                addClass( parent, 'dismissing' );
                setTimeout( makeRemoveNodeFunction( parent ), 250 );
            }
        },

        load = function()
        {
            var
                buttons = document.querySelectorAll( '.notice-dismiss' ),
                i
            ;

            for( i = 0; i < buttons.length; i++ )
            {
                addClass( buttons[ i ], 'visible' );
                addEvent( buttons[ i ], 'click', closeBox );
            }
        },

        init = function()
        {
            if( ! document.querySelectorAll )
            {
                return;
            }

            createOnReadyEvent( load );
        }
    ;

    init();
}());