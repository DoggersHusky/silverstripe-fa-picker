<?php

namespace BucklesHusky\Forms;

use SilverStripe\Core\Config\Config;
use SilverStripe\Forms\TextField;
use SilverStripe\View\Requirements;

class FAPickerField extends TextField
{

    /**
     * Adds in the requirements for the field
     * @param array $properties Array of properties for the form element (not used)
     * @return string Rendered field template
     */
    public function Field($properties = array())
    {
        //get the icon list and version
        $icons = implode(",", $this->getIconList());
        $version = $this->getVersion();

        //convert to js for use on the template
        Requirements::customScript(<<<JS
            var iconList = "$icons";
            iconList = iconList.split(",");
            var fa_version = "$version";
JS
        );
        Requirements::javascript("buckleshusky/silverstripe-fa-picker:js/fapicker.js");
        Requirements::css("buckleshusky/silverstripe-fa-picker:css/fa-styles.css");
        Requirements::css("buckleshusky/silverstripe-fa-picker:css/external/fontawesome-all.min.css");
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
     * get what version of fontawesome is being used
     *
     * @return string
     */
    public function getVersion()
    {
        return Config::inst()->get('FontawesomeIcons', 'version');
    }

    /**
     * get a list of icons to add to the array to be displayed in the field
     *
     * @return array
     */
    public function getIconList()
    {
        //get the icon list from the yml file
        $icons = Config::inst()->get('FontawesomeIcons', 'icons');

        //add in new icons if they are in the add list
        if ($newIcons = Config::inst()->get('FontawesomeIcons', 'add')) {
            $icons = array_merge($icons, $newIcons);
        }

        //remove icons
        if ($removeIcons = Config::inst()->get('FontawesomeIcons', 'remove')) {
            foreach ($removeIcons as $ri) {
                if (($key = array_search($ri, $icons)) !== false) {
                    unset($icons[$key]);
                }
            }
        }

        return $icons;

    }
}
