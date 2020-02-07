FontAwesomeIconPicker
=================

Displays a Font Awesome 5 icon picker for SilverStripe.

## Requirements

* SilverStripe 4.x

## Installation

Installation is supported via composer only

```sh
composer require buckleshusky/fontawesomeiconpicker
```

* Run `dev/build?flush=all` to regenerate the manifest

## Usage


### Notes


## Contributing

### Translations


//for the solid tab here: https://fontawesome.com/cheatsheet/free/solid
```javascript
var names = new Set();
var icons = document.getElementsByClassName('icon');
for (const icon of icons) {
const name = "fas fa-" + icon.getElementsByTagName('dd')[0].innerText;
names.add(name);
}
console.log(JSON.stringify(Array.from(names)));
```

//for the regular tab here: https://fontawesome.com/cheatsheet/free/regular
```javascript
var names = new Set();
var icons = document.getElementsByClassName('icon');
for (const icon of icons) {
const name = "far fa-" + icon.getElementsByTagName('dd')[0].innerText;
names.add(name);
}
console.log(JSON.stringify(Array.from(names)));
```

```javascript
//for the brands tab here: https://fontawesome.com/cheatsheet/free/brands
var names = new Set();
var icons = document.getElementsByClassName('icon');
for (const icon of icons) {
const name = "fab fa-" + icon.getElementsByTagName('dd')[0].innerText;
names.add(name);
}
console.log(JSON.stringify(Array.from(names)));
```
