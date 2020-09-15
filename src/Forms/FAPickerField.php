<?php

namespace BucklesHusky\FontAwesomeIconPicker\Forms;

use SilverStripe\Core\Config\Config;
use SilverStripe\Forms\TextField;
use SilverStripe\ORM\FieldType\DBHTMLText;
use SilverStripe\View\Requirements;

class FAPickerField extends TextField
{

    private static $casting = [
        'getIconList' => 'HTMLFragment',
    ];

    /**
     * Adds in the requirements for the field
     * @param array $properties Array of properties for the form element (not used)
     * @return string Rendered field template
     */
    public function Field($properties = array())
    {
        Requirements::javascript("buckleshusky/fontawesomeiconpicker:js/fapicker.js");
        Requirements::css("buckleshusky/fontawesomeiconpicker:css/fa-styles.css");

        //should we disable the built in fontawesome
        if (!$extraCSSClasses = Config::inst()->get('FontawesomeIcons', 'disable_builtin_fontawesome')) {
            //if the pro version is set, don't load the free version
            if (!$this->getIsProVersion()) {
                Requirements::css("buckleshusky/fontawesomeiconpicker:external/css/all.min.css");
            }
        }

        if ($this->getIsProVersion()) {
            Requirements::css($this->getProVersionCss());
        }

        //add the extra requirements if need be
        if ($extraCSSClasses = Config::inst()->get('FontawesomeIcons', 'extra_requirements_css')) {
            foreach ($extraCSSClasses as $css) {
                Requirements::css($css);
            }
        }

        return parent::Field($properties);
    }

    /**
     * Compiles all CSS-classes. Optionally includes a "form-group--no-label" class if no title was set on the
     * FormField.
     *
     * Uses {@link Message()} and {@link MessageType()} to add validation error classes which can
     * be used to style the contained tags.
     *
     * @return string
     */
    public function extraClass()
    {
        //add in text class
        $classes[] = parent::extraClass();

        $classes[] .= "text";

        return implode(' ', $classes);
    }

    /**
     * get a list of icons to add to the array to be displayed in the field
     *
     * @return array
     */
    public function getIconList()
    {
        $template = "";

        //check to see which icon list to use
        if (Config::inst()->get('FontawesomeIcons', 'unlock_pro_mode')) {
            //get pro icons
            $icons = Config::inst()->get('FontawesomeIcons', 'pro_icons');
        } elseif (Config::inst()->get('FontawesomeIcons', 'disable_builtin_fontawesome')) {
            //get the icon list from the users yml file
            $icons = Config::inst()->get('FontawesomeIcons', 'my_icons');
        } else {
            //get free icons
            $icons = Config::inst()->get('FontawesomeIcons', 'icons');
        }

        //remove icons
        if ($removeIcons = Config::inst()->get('FontawesomeIcons', 'remove')) {
            foreach ($removeIcons as $ri) {
                if (($key = array_search($ri, $icons)) !== false) {
                    unset($icons[$key]);
                }
            }
        }

        //needs to be cached
        foreach ($icons as $icon) {
            $template .= '<li><div class="fapicker-icons__holder__icon ' .
                true .
                '" data-icon="' .
                $icon .
                '" ><i class="' .
                $icon .
                '"></i></div><div>' .
                $icon
                . '</div></li>';
        }

        $html = DBHTMLText::create();
        $html->setValue($template);
        return $html;
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
        return Config::inst()->get('FontawesomeIcons', 'css');
    }
}
