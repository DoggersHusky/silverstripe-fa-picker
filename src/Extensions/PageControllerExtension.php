<?php

namespace BucklesHusky\FontAwesomeIconPicker\Extensions;

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
        Requirements::css("buckleshusky/fontawesomeiconpicker:css/external/fontawesome-all.min.css");
    }
}
