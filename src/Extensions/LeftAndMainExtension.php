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

    // /**
    //  * get a list of icons to add to the array to be displayed in the field
    //  *
    //  * @return array
    //  */
    // public function getIconList()
    // {
    //     //check to see which icon list to use
    //     if (Config::inst()->get('FontawesomeIcons', 'unlock_pro_mode')) {
    //         //get pro icons
    //         $icons = Config::inst()->get('FontawesomeIcons', 'pro_icons');
    //     } elseif (Config::inst()->get('FontawesomeIcons', 'disable_builtin_fontawesome')) {
    //         //get the icon list from the users yml file
    //         $icons = Config::inst()->get('FontawesomeIcons', 'my_icons');
    //     } else {
    //         //get free icons
    //         $icons = Config::inst()->get('FontawesomeIcons', 'icons');
    //     }

    //     //remove icons
    //     if ($removeIcons = Config::inst()->get('FontawesomeIcons', 'remove')) {
    //         foreach ($removeIcons as $ri) {
    //             if (($key = array_search($ri, $icons)) !== false) {
    //                 unset($icons[$key]);
    //             }
    //         }
    //     }

    //     return $icons;
    // }
}
