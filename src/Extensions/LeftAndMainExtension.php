<?php

namespace BucklesHusky\FontAwesomeIconPicker\Extensions;

use SilverStripe\Core\Config\Config;
use SilverStripe\Core\Extension;
use SilverStripe\View\Requirements;

class LeftAndMainExtension extends Extension
{
    public function onBeforeInit()
    {

        //get the icon list and version
        //$icons = implode(",", $this->getIconList());
        $version = $this->getVersion();

        //convert to js for use on the template
        Requirements::customScript(
            <<<JS

            var fa_version = "$version";
JS
        );
    }

    /**
     * get what version of fontawesome is being used
     *
     * @return string
     */
    public function getVersion()
    {
        return Config::inst()->get('FontawesomeIcons', 'version');
    }
}
