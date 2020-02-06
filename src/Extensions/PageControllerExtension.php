<?php

namespace BucklesHusky\SilverStripeFAPicker\Extensions;

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
        Requirements::css("buckleshusky/silverstripe-fa-picker:css/external/fontawesome-all.min.css");
    }

}
