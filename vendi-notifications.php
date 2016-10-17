<?php
/*
Plugin Name: Vendi Theme-Level Notifications
Description: Adds notification support to themes.
Version: 1.0.0
Author: Vendi Advertising (Chris Haas)
Author URI: http://www.vendiadvertising.com/
*/

global $vendi_theme_notifications;
$vendi_theme_notifications = array();

define( 'VENDI_NOTIFICATIONS_FILE', __FILE__ );
define( 'VENDI_NOTIFICATIONS_PATH', dirname( __FILE__ ) );
define( 'VENDI_NOTIFICATIONS_URL',  plugin_dir_url( __FILE__ ) );

/**
 * Register a page-level notice for display later.
 * 
 * @param  string  $message            The message to display.
 * @param  string  $type               One of success, warning, error, info.
 * @param  boolean $dismissable        If true, show an "x" that users can click to hide the notice. Default true.
 * @param  boolean $enqueue_css_and_js If true, enqueue the CSS and JS required to show the notices. Default true.
 */
function vendi_notifications_register_notice( string $message, string $type, bool $dismissable = true, bool $enqueue_css_and_js = true )
{
    if( $enqueue_css_and_js )
    {
        $t = VENDI_NOTIFICATIONS_PATH . '/css/notices.css';
        wp_enqueue_style(
                            basename( $t, '.css' ) . '-style',
                            VENDI_NOTIFICATIONS_URL . '/css/' . basename( $t ),
                            null,
                            filemtime( VENDI_NOTIFICATIONS_PATH . '/css/' . basename( $t ) ),
                            'screen'
                        );

        $t = VENDI_NOTIFICATIONS_PATH . '/css/notices.js';
        wp_enqueue_script(
                            basename( $t, '.js' ) . '-style',
                            VENDI_NOTIFICATIONS_URL . '/js/' . basename( $t ),
                            false,
                            filemtime( VENDI_NOTIFICATIONS_PATH . '/js/' . basename( $t ) ),
                            true
                        );
    }

    global $vendi_theme_notifications;

    if( ! array_key_exists( $type, $vendi_theme_notifications ) )
    {
        $vendi_theme_notifications[ $type ] = array();
    }

    $vendi_theme_notifications[ $type ][] = array(
                                                    'message'       => $message,
                                                    'dismissable'   => $dismissable,
                                            );
}


/**
 * Convert the notices to HTML and optionally echo them.
 * 
 * @param  boolean $echo  If true, echo the notices, otherwise only return them. Default true.
 * @param  boolean $reset If true, reset the internal notice array. Default true.
 * @return string         The HTML for the notices or an empty string.
 */
function vendi_notifications_show_notices( bool $echo = true, bool $reset = true )
{
    $buf = array();

    global $vendi_theme_notifications;
    foreach( $vendi_theme_notifications as $type => $notices )
    {
        foreach( $notices as $notice )
        {
            $buf[] = "<div class=\"notice notice-${type} no-print\">";
            $buf[] = "<p>${notice['message']}</p>";
            if( true === $notice[ 'dismissable' ] )
            {
                $buf[] = '<button type="button" class="notice-dismiss"><span class="screen-reader-text">Dismiss this notice.</span></button>';
            }
            $buf[] = '</div>';
        }
    }

    $ret = implode( '', $buf );

    if( $echo )
    {
        echo $ret;
    }

    if( $reset )
    {
        $vendi_theme_notifications = array();
    }

    return $ret;

}
