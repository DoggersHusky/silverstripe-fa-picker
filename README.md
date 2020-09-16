Font Awesome Icon Picker
=================

Adds a Font Awesome 5 icon picker to SilverStripe 4. This currently supports version 5.14.0 of Font Awesome

**Free version**
![Overview of Image Cropper Field](screenshots/screenshot1.PNG)

**Pro Version**
![Overview of Image Cropper Field](screenshots/screenshot2.PNG)

## Requirements

* SilverStripe 4.x

## Installation

Installation is supported via composer only

```sh
composer require buckleshusky/fontawesomeiconpicker
```

* Run `dev/build?flush=all` to regenerate the manifest

## Usage

Simply add the field to a DataObject or Page like you normally would. 
This will save the Font Awesome Icon's class info to a dbfield for use on the front end.

```php

use BucklesHusky\FontAwesomeIconPicker\Forms\FAPickerField;
use SilverStripe\ORM\DataObject;

class TestDataObject extends DataObject
{

    private static $table_name = "TestDataObject";

    private static $db = [
        'FAIcon' => 'Varchar(50)',
    ];

    public function getCMSFields()
    {
        $fields = parent::getCMSFields();

        $fields->addFieldToTab(
            'Root.Main',
            FAPickerField::create('FAIcon', 'Font Awesome Icon\'s Name')
        );

        return $fields;
    }
}
```

### Notes

This has not been tested for use on the frontend of a site, but this version should work. Please note, the enabling the pro version does introduce some lag. Caching has been introduce to midigate some of it, however, swapping between icon types or filtering does still cause lag. This is being looked into.

### Settings

**Enable Font Awesome Pro**
To enable Font Awesome Pro, add this to your yml file. Replace `all.min.css` with the Font Awesome Pro css name.

```yml
FontawesomeIcons:
  unlock_pro_mode: true
  css: "all.min.css"
```

**Adding your own icons:**
To add your own icons from another (css) icon set, you can add this to your yml file:

```yml
FontawesomeIcons:
  extra_requirements_css:
    - "themes/{your theme}/css/iconpack.css"
    - "themes/{your theme}/css/inconpack2.css"
  icons:
    - "{css icon class}"
    - "{css icon class}"
```

**Removing icons:**
This only works for the built in Font Awesome icons.
Simply add this to your yml and list the icons you don't 
want your users to be able to select.

```yml
FontawesomeIcons:
  remove:
    - "fas fa-ad"
    - "fas fa-air-freshener"
```

**Disabling built in Font Awesome:**
If you want to use your own icons or a version of Font Awesome that is not supported,
you can disable the built in Font Awesome. If you decide to add your own,
you will need a yml list of icons.

```yml
FontawesomeIcons:
  disable_builtin_fontawesome: true
  my_icons:
    - "new icon"
    - "new icon"
    - "new icon"
    - "new icon"
```


### What's New
- Ability to filter by icon type
- The icons that populate the picker are now generated in php
- The generated icon list is now cached
- Updated to Font Awesome 5.14.0
- Support for Font Awesome Pro
- The icon's name is now displayed below the icon
- The icon's size have been slightly increased
- The icon's view area is now larger
- Easier use on mobile