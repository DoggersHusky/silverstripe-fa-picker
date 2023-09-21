<?php

namespace BucklesHusky\FontAwesomeIconPicker\Extensions;

use SilverStripe\Control\Director;
use SilverStripe\Core\Config\Config;
use SilverStripe\Core\Extension;
use SilverStripe\Core\Manifest\ModuleResourceLoader;
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
            Requirements::css(ModuleResourceLoader::resourceURL($loader->findThemedCSS($this->getProVersionCss()), $themes));

            // load the sharp icons css only if it's not disabled
            if (!$this->getIsSharpIconsDisabled()) {
                // path to the folder relative to this folder
                $folder = Director::baseFolder() . '/' . $loader->findThemedResource($this->getProSharpVersionCssFolder());

                // attempt to find the folder
                if ($this->getProSharpVersionCssFolder() && file_exists($folder)) {
                    $folder = scandir($folder);

                    foreach ($folder as $item) {
                        if (str_contains($item, 'sharp-')) {
                            Requirements::themedCSS($this->getProSharpVersionCssFolder() . '/' . $item);
                        }
                    }
                } else if ($this->getProSharpVersionCss()) {
                    // default back to one file
                    Requirements::css(ModuleResourceLoader::resourceURL($loader->findThemedCSS($this->getProSharpVersionCss()), $themes));
                } else {
                    user_error('You must configure FontawesomeIcons.pro_sharp_css. This is just simply the name of the css. For example: <strong>"sharp-solid.min.css"</strong>.', E_USER_ERROR);
                }
            }
        } else {
            // get the free version
            Requirements::css('https://use.fontawesome.com/releases/v' . $this->getIsFreeVersion() . '/css/all.css');
        }

        //add the extra requirements if need be
        if ($extraCSSClasses = Config::inst()->get('FontawesomeIcons', 'extra_requirements_css')) {
            foreach ($extraCSSClasses as $css) {
                Requirements::css($css);
            }
        }
    }

    /**
     * Get the version to pull from the CDN
     *
     * @return string
     */
    public function getIsFreeVersion()
    {
        if ($version = Config::inst()->get('FontawesomeIcons', 'free_css_cdn_version')) {
            return $version;
        }

        return '6.2.0';
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
     * Determine if sharp icons are disabled
     *
     * @return boolean
     */
    public function getIsSharpIconsDisabled()
    {
        if (Config::inst()->get('FontawesomeIcons', 'disable_sharp_icons')) {
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

    /**
     * Get the pro sharp version css location
     *
     * @return void
     */
    public function getProSharpVersionCssFolder()
    {
        return Config::inst()->get('FontawesomeIcons', 'pro_sharp_css_folder');
    }
}
