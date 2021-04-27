<?php

namespace BucklesHusky\FontAwesomeIconPicker\Forms;

use Psr\SimpleCache\CacheInterface;
use SilverStripe\Core\Config\Config;
use SilverStripe\Core\Flushable;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Forms\FormField;
use SilverStripe\Forms\TextField;

class FAPickerField extends TextField implements Flushable
{
    //region Module implementation

    // NOTE: Apart from the getIconList() function,
    //  the module implementation has not been altered.

    private $iconAmount = null;
    protected $schemaDataType = FormField::SCHEMA_DATA_TYPE_TEXT;
    protected $schemaComponent = 'FAPickerField';

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
     * get what version of fontawesome is being used
     *
     * @return string
     */
    public function getVersionNumber()
    {
        return Config::inst()->get('FontawesomeIcons', 'version');
    }

    /**
     * gets the total amount of icons
     *
     * @return int
     */
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

    /**
     * @inheritDoc
     *
     * */
    public function getSchemaDataDefaults()
    {
        $iconList = $this->getIconList();
        $defaults = parent::getSchemaDataDefaults();

        //@todo needs to send over version, icon total, and pro enabled
        $defaults['data']['iconList'] = $iconList;
        $defaults['data']['iconVersion'] = $this->getVersionNumber();
        $defaults['data']['iconTotal'] = $this->getIconAmount();
        $defaults['data']['pro'] = $this->getIsProVersion();

        return $defaults;
    }

    /**
     * @inheritDoc
     *
     * */
    public function getAttributes()
    {
        $attributes = array(
            'class'       => $this->extraClass(),
            'id'          => $this->ID(),
            'name'        => $this->getName(),
            'value'       => $this->value(),
            'data-schema' => json_encode($this->getSchemaData()),
            'data-state'  => json_encode($this->getSchemaState()),
        );

        $attributes = array_merge($attributes, $this->attributes);

        return $attributes;
    }

    //endregion Module implementation

    /**
     * Defaults to using the built-in FontAwesome icons.
     * May include any of:
     *  - icons
     *  - pro_icons
     *
     * It is also possible to declare a custom icon array
     * using the FontawesomeIcons config name and adding the icons:
     *
     * yml:
     * FontawesomeIcons:
     *   my_custom_icons:
     *     - icon_1
     *     - icon_2
     *     - icon_3
     *
     * php:
     * `FAPickerField::addSourceMode('my_custom_icons');`
     * to add the icon source to the default, or
     * `FAPickerField::setSourceMode(['my_custom_icons']);`
     * to override the source and use only custom icons.
     *
     * @var array
     */
    protected $sourceModes = ['icons'];

    /**
     * Ensure source modes are sorted alphabetically by default
     * so all similar references will be identical.
     *
     * @return array
     */
    public function getSourceModes(): array
    {
        $modes = $this->sourceModes;
        sort($modes);

        return $modes;
    }

    /**
     * Get the cache key for the appropriate field and source modes combination.
     *
     * @param $prefix
     * @return string
     */
    public function getSourceModesCacheKey($prefix)
    {
        return $prefix . '_' . implode('_', $this->getSourceModes());
    }

    /**
     * Override the source modes array.
     *
     * @param array $sourceModes
     */
    public function setSourceModes(array $sourceModes)
    {
        $this->sourceModes = $sourceModes;

        return $this;
    }

    public function addSourceMode($mode)
    {
        $this->sourceModes[] = $mode;

        return $this;
    }

    /**
     * get a list of icons to add to the array to be displayed in the field
     *
     * @return array
     */
    public function getIconList()
    {
        //array of icons
        $cache = Injector::inst()->get(CacheInterface::class . '.fontawesomeiconpicker');
        $listCacheKey = $this->getSourceModesCacheKey('iconList');
        $amountCacheKey = $this->getSourceModesCacheKey('iconAmount');

        // Check the cache first.
        if ($cache->has($listCacheKey)) {
            $this->iconAmount = $cache->get($amountCacheKey);

            return $cache->get($listCacheKey);
        }

        $icons = [];
        // Consolidate icons based on declared source modes.
        $modes = $this->getSourceModes();
        foreach ($modes as $mode) {
            $iconSource = $this->getIconConfig($mode);
            if ($iconSource && count($iconSource) > 0) {
                $icons = array_merge($icons, $iconSource);
            }
        }

        //remove icons
        if ($removeIcons = $this->getIconConfig('remove')) {
            foreach ($removeIcons as $ri) {
                if (($key = array_search($ri, $icons)) !== false) {
                    unset($icons[$key]);
                }
            }
        }

        $iconArray = [];
        //needs to be cached
        foreach ($icons as $icon) {
            //the data icon value/the name of the icon
            $shortIconName = trim(substr($icon, strpos($icon, '-') + 1));
            //get the icon type
            $iconType = trim(strtok($icon, " "));

            array_push($iconArray, [
                'type'      => $iconType,
                'shortName' => $shortIconName,
                'fullName'  => $icon,
            ]);
        }

        //cache the template
        $cache->set($listCacheKey, $iconArray);

        //store the icon amount
        $count = count($icons);
        $cache->set($amountCacheKey, count($icons));
        $this->iconAmount = $count;

        return $iconArray;
    }

    public function getIconConfig($name)
    {
        return Config::inst()->get('FontawesomeIcons', $name);
    }
}
