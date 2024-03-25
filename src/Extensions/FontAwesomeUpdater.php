<?php
namespace BucklesHusky\FontAwesomeIconPicker\Extensions;

use BucklesHusky\FontAwesomeIconPicker\Tasks\FontAwesomeUpdater as TasksFontAwesomeUpdater;
use SilverStripe\Core\Config\Config;
use SilverStripe\Core\Extension;

class FontAwesomeUpdater extends Extension
{
    /**
     * Handles generating or Font Awesome icons
     */
    public function afterCallActionHandler()
    {
        // if this is true, don't run generating the icons
        if (!$this->getDisableGenerateOnBuild()) {
            // generate the cache
            $path = Config::inst()->get('FontawesomeIcons', 'icon_yml_location') ? Config::inst()->get('FontawesomeIcons', 'icon_yml_location') : false;
            TasksFontAwesomeUpdater::generateFontAwesomeIconCache($path);
        }
    }

    /**
     * Determine if the user has set this to not generate the icons on dev/build
     * @return boolean
     */
    public function getDisableGenerateOnBuild()
    {
        return Config::inst()->get('FontawesomeIcons', 'disable_generate_on_build') ?? false;
    }
}
