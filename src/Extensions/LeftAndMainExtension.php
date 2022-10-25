<?php

namespace BucklesHusky\FontAwesomeIconPicker\Extensions;

use SilverStripe\Core\Config\Config;
use SilverStripe\Core\Extension;
use SilverStripe\View\Requirements;
use SilverStripe\View\SSViewer;
use SilverStripe\View\ThemeResourceLoader;

class LeftAndMainExtension extends Extension
{
    /**
     * @inheritDoc
     */
    public function init()
    {
        Requirements::add_i18n_javascript('buckleshusky/fontawesomeiconpicker: javascript/lang');
    }

    /**
     * @inheritDoc
     */
    public function onBeforeInit()
    {
        // if we are using the proversion get the pro version css from theme   
        if ($this->getIsProVersion()) {
            $loader = ThemeResourceLoader::inst();
            //get a list of themes
            $themes = Config::inst()->get(SSViewer::class, 'themes');
            //load the requirements
            Requirements::css($loader->findThemedCSS($this->getProVersionCss(), $themes));
        } else {
            // get the free version
            Requirements::css('https://use.fontawesome.com/releases/v6.2.0/css/all.css');
        }

        //add the extra requirements if need be
        if ($extraCSSClasses = Config::inst()->get('FontawesomeIcons', 'extra_requirements_css')) {
            foreach ($extraCSSClasses as $css) {
                Requirements::css($css);
            }
        }
    }

    /**
     * Determine if the iconpicker should use the pro version of fontawesome
     *
     * @return boolean
     */
    public function getIsProVersion()
    {
        if (Config::inst()->get('FontawesomeIcons', 'unlock_pro_mode')) {
            return true;
        }
        return false;
    }

    /**
     * Get the pro version css location
     *
     * @return void
     */
    public function getProVersionCss()
    {
        return Config::inst()->get('FontawesomeIcons', 'pro_css');
    }

}
