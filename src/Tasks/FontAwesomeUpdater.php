<?php
namespace BucklesHusky\FontAwesomeIconPicker\Tasks;

use SilverStripe\Control\Director;
use SilverStripe\Core\Config\Config;
use SilverStripe\Core\Convert;
use SilverStripe\Core\Environment;
use SilverStripe\Core\Manifest\ModuleResourceLoader;
use SilverStripe\Dev\BuildTask;
use SilverStripe\View\ThemeResourceLoader;
use Symfony\Component\Yaml\Yaml;

class FontAwesomeUpdater extends BuildTask
{
    protected $title = 'Generate Font Awesome icons';
    protected $description = 'Generate icons for the Font Awesome fields';

    private static $segment = 'generate-font-awesome';

    /**
     * @inheritDoc
     */
    public function run($request)
    {
        $path = Self::getIconYMLLocation();

        self::generateFontAwesomeIconCache($path);
    }

    /**
     * Compiles the theme settings down into the stylesheet for use in the template
     */
    public static function generateFontAwesomeIconCache($ymlpath)
    {
        // increase memory limit to 256
        Environment::increaseMemoryLimitTo('256MB');
        // increase time limit to 2 mins
        Environment::increaseTimeLimitTo('120');

        $iconArray = [];
        $iconArray['icons'] = [];
        $version = '';
        $icons = '';
        $loader = ThemeResourceLoader::inst();
        $destPath = null;

        // Get destination of app folder
        if ($ymlpath) {
            $destPath = Director::baseFolder() . '/' . ModuleResourceLoader::singleton()->resolvePath($ymlpath);
        }

        // look in the app folder
        $iconsURL = $ymlpath ? $destPath : null;
        $path = ASSETS_PATH . '/fa-iconmap.json';

        // if this doesn't exist
        if (!$iconsURL || !file_exists($iconsURL) || $destPath == null) {
            self::displayMessage('To use an updated/pro version of Font Awesome, make sure to set `FontawesomeIcons.icon_yml_location` properly in your config.', true, true, true);

            // parse the icons from the module
            $module = ModuleResourceLoader::singleton()->resolvePath('buckleshusky/fontawesomeiconpicker: pickerFontAwesomeIcons/icon-families.yml');
            $icons = Yaml::parseFile(Director::baseFolder() . '/' . $module);
        } else {
            // parse the icons from the user
            $icons = Yaml::parseFile($iconsURL);
        }

        // loop through the data
        foreach ($icons as $key => $value) {
            // determine which version to look at
            $familyStylesByLicense = self::getIsProVersion() ? $value['familyStylesByLicense']['pro'] : $value['familyStylesByLicense']['free'];

            // set the version
            if ($version < end($value['changes'])) {
                $version = end($value['changes']);
            }

            // loop through each license and get family and style
            foreach ($familyStylesByLicense as $familyStyle) {
                if ($familyStyle['family'] === 'sharp' && self::getIsSharpIconsDisabled()) {
                    continue;
                }

                // the full name of the icon
                $fullName = 'fa-' . ($familyStyle['family'] === 'duotone' ? $familyStyle['family'] : $familyStyle['style']) . ' fa-' . str_replace(' ', '-', $key);

                // if we are dealing with the sharp family
                if ($familyStyle['family'] === 'sharp') {
                    $fullName .= ' fa-sharp';
                }

                array_push($iconArray['icons'], [
                    'iconStyle' => $familyStyle['family'] === 'duotone' ? $familyStyle['family'] : $familyStyle['style'],
                    'iconFamily' => $familyStyle['family'],
                    'shortName' => $value['label'],
                    'searchName' => mb_strtolower($value['label']),
                    'fullName' => $fullName,
                ]);
            }
        }

        // icon amount
        $iconArray['iconAmount'] = number_format(count($iconArray['icons']));
        // version
        $iconArray['iconVersion'] = $version;

        // Write the json to the file
        $f = fopen($path, 'w');
        fwrite($f, json_encode($iconArray));
        fclose($f);

        self::displayMessage('Font Awesome icons have been generated successfully.', true, false);
    }

    /**
     * Determine if the iconpicker should use the pro version of fontawesome
     *
     * @return boolean
     */
    private static function getIsProVersion()
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
    private static function getIsSharpIconsDisabled()
    {
        if (Config::inst()->get('FontawesomeIcons', 'disable_sharp_icons')) {
            return true;
        }
        return false;
    }

    /**
     * Get the icon's YML location
     * @return string|boolean
     */
    private static function getIconYMLLocation()
    {
        return Config::inst()->get('FontawesomeIcons', 'icon_yml_location') ? Config::inst()->get('FontawesomeIcons', 'icon_yml_location') : false;
    }

    /**
     * Writes a message to the ouput
     * @param string $message Message to display
     * @param bool $heading Whether the item is a headline or not
     * @param bool $end Whether or not it's the end of the output
     * @param bool $error Whether or not the message is an error (applicable only to web builds)
     */
    private static function displayMessage($message, $heading = false, $end = false, $error = false)
    {
        if ($heading) {
            if (!$end) {
                print (Director::is_cli() ? strtoupper("\n$message\n\n") : '<div class="build"><p><b>' . Convert::raw2xml($message) . '</b><ul>');
            } else {
                print (Director::is_cli() ? strtoupper("\n" . $message) : '</ul><p>' . Convert::raw2xml($message) . '</div>');
            }
        } else {
            print (Director::is_cli() ? "\n$message\n\n" : '<li' . ($error ? ' class="error"' : '') . '>' . Convert::raw2xml($message) . '</li>');
        }
    }
}
