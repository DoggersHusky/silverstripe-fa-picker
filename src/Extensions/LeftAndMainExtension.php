<?php

namespace BucklesHusky\FontAwesomeIconPicker\Extensions;

use SilverStripe\Control\Director;
use SilverStripe\Core\Config\Config;
use SilverStripe\Core\Extension;
use SilverStripe\Core\Manifest\ModuleResourceLoader;
use SilverStripe\View\Requirements;
use SilverStripe\View\SSViewer;
use SilverStripe\View\ThemeResourceLoader;
use stdClass;

class LeftAndMainExtension extends Extension
{
    private static $iconData;

    /**
     * @inheritDoc
     */
    public function init()
    {
        $icons = json_encode($this->owner->getIconList());
        $iconAmount = $this->owner->getIconAmount();
        $icountVersion = $this->owner->getVersionNumber();

        // load the requirements
        Requirements::add_i18n_javascript('buckleshusky/fontawesomeiconpicker: javascript/lang');
        Requirements::customScript(<<<JS
            let fullIconList = $icons;
            let iconAmount = '$iconAmount';
            let iconVersion = '$icountVersion';
        JS
        );
    }

    /**
     * Get the icon data and store it in a private static
     * @return stdClass|boolean
     */
    public function getIconData()
    {
        $data = self::$iconData;

        if (!$data) {
            // the path to the json
            $path = ASSETS_PATH . '/fa-iconmap.json';

            // if file exists
            if (file_exists($path)) {
                $icons = file_get_contents($path);

                self::$iconData = json_decode($icons);

                return self::$iconData;
            } else {
                return false;
            }
        }

        return $data;
    }

    /**
     * get a list of icons to add to the array to be displayed in the field
     *
     * @return array
     */
    public function getIconList()
    {
        $icons = $this->getIconData();

        // if file exists
        if ($icons) {
            // make sure we are dealing with an object
            if ($icons && $icons instanceof stdClass && property_exists($icons, 'icons')) {
                return $icons->icons;
            }
        }

        return [];
    }

    /**
     * get what version of fontawesome is being used
     *
     * @return string
     */
    public function getVersionNumber()
    {
        $icons = $this->getIconData();

        // if file exists
        if ($icons) {
            // make sure we are dealing with an object
            if ($icons && $icons instanceof stdClass && property_exists($icons, 'iconVersion')) {
                return $icons->iconVersion;
            }
        }

        return '';
    }

    /**
     * gets the total amount of icons
     *
     * @return int
     */
    public function getIconAmount()
    {
        $icons = $this->getIconData();

        // if file exists
        if ($icons) {
            // make sure we are dealing with an object
            if ($icons && $icons instanceof stdClass && property_exists($icons, 'iconAmount')) {
                return $icons->iconAmount;
            }
        }

        return '';
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
        $proCSS = Config::inst()->get('FontawesomeIcons', 'pro_css');

        // make sure this is set
        if(empty($proCSS)) {
            user_error('You must configure FontawesomeIcons.pro_css. This is just simply the name of the css. For example: <strong>"all.min.css"</strong>.', E_USER_ERROR);
        }

        return $proCSS;
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
