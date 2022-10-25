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

    private $iconAmount = null;
    private $iconVersion = null;

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

        //check to see if the icon list exist
        //if (!$cache->has('iconList')) {
            // get the icon list
            $icons = Config::inst()->get('FontawesomeIconsList');

            // loop through the data
            foreach ($icons as $key => $value) {
                // @todo should switch to either free or pro depending
                $familyStylesByLicense = $value['familyStylesByLicense']['pro'];
                
                // set the version
                if ($version < end($value['changes'])) {
                    $version = end($value['changes']);
                }

                // loop through each license and get family and style
                foreach ($familyStylesByLicense as $familyStyle) {
                    array_push($iconArray, [
                        'iconStyle' => $familyStyle['family'] === 'duotone' ? $familyStyle['family'] : $familyStyle['style'],
                        'iconFamily' => $familyStyle['family'],
                        'shortName' => $value['label'],
                        'searchName' => mb_strtolower($value['label']),
                        'fullName' => 'fa-' . ($familyStyle['family'] === 'duotone' ? $familyStyle['family'] : $familyStyle['style']) . ' fa-' . str_replace(' ', '-', $key),
                    ]);
                }
            }

            //total amount icons
            $cache->set('iconAmount', number_format(count($iconArray)));

            $cache->set('iconVersion', $version);

            //cache the template
            $cache->set('iconList', $iconArray);
        // } else {
        //     //get from cache
        //     $iconArray = $cache->get('iconList');
        // }

        //store the icon amount
        $this->iconAmount = $cache->get('iconAmount');
        $this->iconVersion = $cache->get('iconVersion');

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
     * get what version of fontawesome is being used
     *
     * @return string
     */
    public function getVersionNumber()
    {
        if ($this->iconVersion == null) {
            $cache = Injector::inst()->get(CacheInterface::class . '.fontawesomeiconpicker');
            return $cache->get('iconVersion');
        }

        return $this->iconVersion;
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
