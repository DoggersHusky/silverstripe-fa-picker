<?php

namespace BucklesHusky\FontAwesomeIconPicker\Extensions;

use SilverStripe\Core\Config\Config;
use SilverStripe\Core\Extension;
use SilverStripe\View\Requirements;
use SilverStripe\View\ThemeResourceLoader;

class PageControllerExtension extends Extension
{
    /**
     * method to quicly add the version of fontawesome from this module
     */
    public function fontAwesome()
    {
        if ($this->getIsProVersion()) {
            $loader = ThemeResourceLoader::inst();
            //get a list of themes
            $themes = Config::inst()->get(SSViewer::class, 'themes');
            //load the requirements
            Requirements::css($loader->findThemedCSS($this->getProVersionCss(), $themes));
            //load the requirements
            Requirements::css($loader->findThemedCSS($this->getProSharpVersionCss(), $themes));
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

    /**
     * Get the pro sharp version css location
     *
     * @return void
     */
    public function getProSharpVersionCss()
    {
        return Config::inst()->get('FontawesomeIcons', 'pro_sharp_css');
    }
}
