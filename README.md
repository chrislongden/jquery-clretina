# jquery-clretina

After noticing the images on a website I was working on didn't look up to scratch on retina displays. I decided to look into changing the images to the retina equivalent when required.

After looking at all the ways to do this via CSS selectors and other scripts, I decided to write my own. I wanted the ability, just like when developing a native app in xcode, where I simply provide an "@2x" version of the image and it was dealt with by the system.

This is exactly how this script works, you simply provide a double dimension version of the images on your website, either in the same folder with suffix or another folder (see syntax for configurable options) and this script will check all IMG tag's and CSS backgrounds for a retina version and if it exists, swap them out.

If you have a website where you have simply inserted an image without specifying the width and height, don't worry about that, this script will set the initial images dimensions before it changes the source to the retina image, so they won't resize and become twice as big.

CSS image sprites and background, this works as well as the script sets the element's "background-size" css property with the initial dimension of the non-retina image.

## Syntax

It's simply plug and play...

'''javascript
$("body").clretina({
	// Suffix for retina based files
        suffix: "@2x",
        // Sub folder for Retina versions from the current image location
        subFolder: "retina",
        // Check if the retina version of the images exists otherwise leave the original
        checkExists: true,
        // Process IMG tags
        imageTags: true,
        // This will automatically set the Width and Height properties of an IMG tag with the
        // original image's width and height so it doesn't resize to fit the retina version
        imageTagsRetinaRatio: true,
        // Process CSS background images
        cssBackgrounds: true,
        // This will automatically reset any background positions to the retina equivalent
        cssBackgroundsRetinaRatio: true
});
'''

## Usage

Really simple usage, below is an image, by default you will have to create the retina version in this folder "images/retina/myimage@2x.png"

'''html
<img src="images/myimage.png" border="0"/>
'''

Include jQuery and this script, then when the document is ready run this. (Change 'body' to any element, this example just shows scanning the entire DOM).

'''javascript
$("body").clretina();
'''

## Release History

* 2013/08/07 - v1.0 - Initial release

## License
Copyright (c) 2013 Chris Longden
Licensed under the MIT, GPL licenses.
