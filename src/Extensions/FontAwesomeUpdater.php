<?php
namespace BucklesHusky\FontAwesomeIconPicker\Extensions;

use BucklesHusky\FontAwesomeIconPicker\Tasks\FontAwesomeUpdater as TasksFontAwesomeUpdater;
use SilverStripe\Core\Config\Config;
use SilverStripe\Core\Extension;

class FontAwesomeUpdater extends Extension
{
    /**
     * Handles generating or updating the Font Awesome icon map used in the WYSIWYG
     */
    public function afterCallActionHandler()
    {
        // if this is true, don't run generating the icons
        if (!$this->getDisableGenerateOnBuild()) {
            // generate the cache
            TasksFontAwesomeUpdater::generateFontAwesomeIconCache();
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
