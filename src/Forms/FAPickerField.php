<?php

namespace BucklesHusky\FontAwesomeIconPicker\Forms;

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
        Requirements::javascript("buckleshusky/fontawesomeiconpicker:js/fapicker.js");
        Requirements::css("buckleshusky/fontawesomeiconpicker:css/fa-styles.css");

        //should we disable the built in ontawesome
        if (!$extraCSSClasses = Config::inst()->get('FontawesomeIcons', 'disable_builtin_fontawesome')) {
            Requirements::css("buckleshusky/fontawesomeiconpicker:css/external/fontawesome-all.min.css");
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
}
