<?php

namespace BucklesHusky\FontAwesomeIconPicker\Extensions;

use Psr\SimpleCache\CacheInterface;
use SilverStripe\Control\Director;
use SilverStripe\Core\Config\Config;
use SilverStripe\Core\Extension;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Core\Manifest\ModuleResourceLoader;
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
        $icons = json_encode($this->owner->getIconList());
        $iconAmount = $this->owner->getIconAmount();
        $icountVersion = $this->owner->getVersionNumber();

        Requirements::customScript(<<<JS
            let fullIconList = $icons;
            let iconAmount = '$iconAmount';
            let iconVersion = '$icountVersion';
        JS
        );
    }

    /**
     * get a list of icons to add to the array to be displayed in the field
     *
     * @return array
     */
    public function getIconList()
    {
        //array of icons
        $iconArray = [];
        $cache = Injector::inst()->get(CacheInterface::class . '.fontawesomeiconpicker');
        $version = '';

        // check to see if the icon list exist
        if (!$cache->has('iconList')) {
            // get the icon list
            $icons = Config::inst()->get('FontawesomeIconsListCustom') ? Config::inst()->get('FontawesomeIconsListCustom') : Config::inst()->get('FontawesomeIconsList');

            // loop through the data
            foreach ($icons as $key => $value) {
                // determine which version to look at
                $familyStylesByLicense = $this->getIsProVersion() ? $value['familyStylesByLicense']['pro'] : $value['familyStylesByLicense']['free'];

                // set the version
                if ($version < end($value['changes'])) {
                    $version = end($value['changes']);
                }

                // loop through each license and get family and style
                foreach ($familyStylesByLicense as $familyStyle) {
                    if ($familyStyle['family'] === 'sharp' && $this->getIsSharpIconsDisabled()) {
                        continue;
                    }

                    // the full name of the icon
                    $fullName = 'fa-' . ($familyStyle['family'] === 'duotone' ? $familyStyle['family'] : $familyStyle['style']) . ' fa-' . str_replace(' ', '-', $key);

                    // if we are dealing with the sharp family
                    if ($familyStyle['family'] === 'sharp') {
                        $fullName .= ' fa-sharp';
                    }

                    array_push($iconArray, [
                        'iconStyle' => $familyStyle['family'] === 'duotone' ? $familyStyle['family'] : $familyStyle['style'],
                        'iconFamily' => $familyStyle['family'],
                        'shortName' => $value['label'],
                        'searchName' => mb_strtolower($value['label']),
                        'fullName' => $fullName,
                    ]);
                }
            }

            //total amount icons
            $cache->set('iconAmount', number_format(count($iconArray)));

            $cache->set('iconVersion', $version);

            //cache the template
            $cache->set('iconList', $iconArray);
        } else {
            //get from cache
            $iconArray = $cache->get('iconList');
        }

        return $iconArray;
    }

    /**
     * get what version of fontawesome is being used
     *
     * @return string
     */
    public function getVersionNumber()
    {
        $cache = Injector::inst()->get(CacheInterface::class . '.fontawesomeiconpicker');
        return $cache->get('iconVersion');
    }

    /**
     * gets the total amount of icons
     *
     * @return int
     */
    public function getIconAmount()
    {
        $cache = Injector::inst()->get(CacheInterface::class . '.fontawesomeiconpicker');
        return $cache->get('iconAmount');
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
