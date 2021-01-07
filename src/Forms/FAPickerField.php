<?php

namespace BucklesHusky\FontAwesomeIconPicker\Forms;

use Psr\SimpleCache\CacheInterface;
use SilverStripe\Core\Config\Config;
use SilverStripe\Core\Flushable;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Forms\FormField;
use SilverStripe\Forms\TextField;
use SilverStripe\View\Requirements;

class FAPickerField extends TextField implements Flushable
{

    private $iconAmount = null;

    protected $schemaDataType = FormField::SCHEMA_DATA_TYPE_TEXT;

    protected $schemaComponent = 'FAPickerField';

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
        // if ($this->getIsProVersion()) {
        //     $loader = ThemeResourceLoader::inst();
        //     //get a list of themes
        //     $themes = Config::inst()->get(SSViewer::class, 'themes');
        //     //load the requirements
        //     Requirements::css($loader->findThemedCSS($this->getProVersionCss(), $themes));
        // }

        // //add the extra requirements if need be
        // if ($extraCSSClasses = Config::inst()->get('FontawesomeIcons', 'extra_requirements_css')) {
        //     foreach ($extraCSSClasses as $css) {
        //         Requirements::css($css);
        //     }
        // }

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
        //array of icons
        $iconArray = [];
        $cache = Injector::inst()->get(CacheInterface::class . '.fontawesomeiconpicker');

        //check to see if the icon list exist
        if (!$cache->has('iconList')) {
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
                //the data icon value/the name of the icon
                $shortIconName = trim(substr($icon, strpos($icon, '-') + 1));

                // @todo should also contain the type
                array_push($iconArray, [
                    'shortName' => $shortIconName,
                    'fullName' => $icon,
                ]);
            }

            //total amount icons
            $cache->set('iconAmount', count($icons));

            //cache the template
            $cache->set('iconList', $iconArray);
        } else {
            //get from cache
            $iconArray = $cache->get('iconList');
        }

        //store the icon amount
        $this->iconAmount = $cache->get('iconAmount');

        return $iconArray;
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

    /**
     * get what version of fontawesome is being used
     *
     * @return string
     */
    public function getVersionNumber()
    {
        return Config::inst()->get('FontawesomeIcons', 'version');
    }

    public function getIconAmount()
    {
        if ($this->iconAmount == null) {
            $cache = Injector::inst()->get(CacheInterface::class . '.fontawesomeiconpicker');
            return $cache->get('iconAmount');

        }
        return $this->iconAmount;
    }

    /**
     * @inheritDoc
     *
     * */
    public static function flush()
    {
        Injector::inst()->get(CacheInterface::class . '.fontawesomeiconpicker')->clear();
    }

    public function getSchemaDataDefaults()
    {
        $iconList = $this->getIconList();
        $defaults = parent::getSchemaDataDefaults();

        //@todo needs to send over version, icon total, and pro enabled
        $defaults['data']['iconList'] = $iconList;
        $defaults['data']['iconVersion'] = $this->getVersionNumber();
        $defaults['data']['iconTotal'] = $this->getIconAmount();

        return $defaults;
    }

    public function getAttributes()
    {
        $attributes = array(
            'class' => $this->extraClass(),
            'id' => $this->ID(),
            'name' => $this->getName(),
            'value' => $this->value(),
            'data-schema' => json_encode($this->getSchemaData()),
            'data-state' => json_encode($this->getSchemaState()),
        );

        $attributes = array_merge($attributes, $this->attributes);

        return $attributes;
    }
}
