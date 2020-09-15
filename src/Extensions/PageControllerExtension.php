<?php

namespace BucklesHusky\FontAwesomeIconPicker\Extensions;

use SilverStripe\Core\Config\Config;
use SilverStripe\Core\Extension;
use SilverStripe\View\Requirements;

class PageControllerExtension extends Extension
{

    /**
     * method to quicly add the version of fontawesome from this module
     *
     */
    public function fontAwesome()
    {
        //should we disable the built in fontawesome
        if (!$extraCSSClasses = Config::inst()->get('FontawesomeIcons', 'disable_builtin_fontawesome')) {
            Requirements::css("buckleshusky/fontawesomeiconpicker:external/css/all.min.css");
        }

        //add the extra requirements if need be
        if ($extraCSSClasses = Config::inst()->get('FontawesomeIcons', 'extra_requirements_css')) {
            foreach ($extraCSSClasses as $css) {
                Requirements::css($css);
            }
        }
    }
}
