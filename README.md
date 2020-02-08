FontAwesomeIconPicker
=================

Displays a Font Awesome 5 icon picker for SilverStripe.

![Overview of Image Cropper Field](screenshots/screenshot1.PNG)

## Requirements

* SilverStripe 4.x

## Installation

Installation is supported via composer only

```sh
composer require buckleshusky/fontawesomeiconpicker
```

* Run `dev/build?flush=all` to regenerate the manifest

## Usage

Simple add the field to a DataObject or Page like you normally would. 
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
This has not been tested for use on the frontend of a site.

### Settings

**Adding your own icons:**
To add your own icons from another css, you can add this to your yml file:

```yml
FontawesomeIcons:
  extra_requirements_css:
    - "themes/test/css/iconpack.css"
    - "themes/test/css/inconpack2.css"
  icons:
    - "css icon class"
    - "css icon class"
```

**Removing icons:**
This only works for the built in fontawesome icons.
Simply add this to your yml and list the icons you don't 
want your users to select.

```yml
FontawesomeIcons:
  remove:
    - "fas fa-ad"
    - "fas fa-air-freshener"
```

**Disabling built in Fontawesome:**
If you want to use your own icons or a new version of fontawesome,
you can disable the built in fontawesome. If you decide to add your own,
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


**If you decide to scrap FA yourself:**
You can use one of the useful scripts below and then use that to create
a yml file of icons

for the solid tab here: https://fontawesome.com/cheatsheet/free/solid

```javascript
var names = new Set();
var icons = document.getElementsByClassName('icon');
for (const icon of icons) {
const name = "fas fa-" + icon.getElementsByTagName('dd')[0].innerText;
names.add(name);
}
console.log(JSON.stringify(Array.from(names)));
```

for the regular tab here: https://fontawesome.com/cheatsheet/free/regular

```javascript
var names = new Set();
var icons = document.getElementsByClassName('icon');
for (const icon of icons) {
const name = "far fa-" + icon.getElementsByTagName('dd')[0].innerText;
names.add(name);
}
console.log(JSON.stringify(Array.from(names)));
```

for the brands tab here: https://fontawesome.com/cheatsheet/free/brands

```javascript
var names = new Set();
var icons = document.getElementsByClassName('icon');
for (const icon of icons) {
const name = "fab fa-" + icon.getElementsByTagName('dd')[0].innerText;
names.add(name);
}
console.log(JSON.stringify(Array.from(names)));
```
