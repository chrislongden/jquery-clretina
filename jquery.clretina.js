/*
* Retina Image Plugin jquery.clRetina.js v1.0
*
* Copyright (c) 2013 Chris Longden
* Author: Chris Longden
* Twitter: @chris_longden
* Dual licensed under the MIT and GPL licenses.
*
*/

var clRetinaValidUrls = [];
var clRetinaInvalidUrls = [];

(function ($) {

    $.fn.clretina = function (options) {


        var isRetinaDevice = false;

        // Default Settings
        var settings = {
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
            cssBackgroundsRetinaRatio: true,
            // Prompt to download retina images
            //downloadPrompt: false
        };

        if (options) {
            jQuery.extend(settings, options);
        }

        // Check we are on a high pixel device
        if (window.devicePixelRatio >= 1.2) {
            isRetinaDevice = true;
        }

        // Uncomment for desktop debugging!
        isRetinaDevice = true;        

        // Check and return
        if (isRetinaDevice) {
            //if (settings.downloadPrompt) {
            //    var dlr = prompt("We have detected your viewing our website on a retina display, do you want to download high resolution images?", false);
            //    if (dlr) {
            //        return checkChildren($(this), isRetinaDevice, settings);
            //    }
            //} else {
                return checkChildren($(this), isRetinaDevice, settings);
            //}
        } else {
            return this;
        }

        function generateRetinaFileName(original, settings) {

            var filePath = '';
            var fileName = '';
            var fileExt = '';

            // Breakdown current path and file name
            fileName = original.substr(original.lastIndexOf("/") + 1).replace(/.[^.]+$/, '');
            fileExt = original.replace(/^.*\./, '');
            filePath = original.replace(fileName + '.' + fileExt, '');

            // Check if user has a sub folder for retina images
            if (settings.subFolder.length > 0) filePath = filePath + settings.subFolder + '/';

            // Send back new filename
            return filePath + fileName + settings.suffix + '.' + fileExt

        }

        function checkFileExists(filename, settings)
        {
            var exists = !settings.checkExists;
            if (settings.checkExists) {
                if (clRetinaValidUrls.indexOf(filename) > -1) {
                    exists = true;
                } else {
                    if (clRetinaInvalidUrls.indexOf(filename) > -1) {
                        exists = false;
                    } else {
                        jQuery.ajax(
                            filename,
                            { type: "HEAD", async: false }
                        ).done(function (data, status, response) {
                            // Found file but check content type for an image
                            if (response.getResponseHeader('Content-Type').match("^image/")) {
                                clRetinaValidUrls.push(filename);
                                exists = true;
                            }
                        }).fail(function () {
                            clRetinaInvalidUrls.push(filename);
                            exists = false;
                        });
                    }
                }
            }
            return exists;
        }

        function checkChildren(obj, isRetinaEnabled, settings) {

            // Check is IMG element
            if (obj.is("img")) {
                if (obj.attr("data-clretina") == undefined) {
                    // Get image source
                    var imgSrc = obj.attr('src');
                    // Check source is available
                    if (imgSrc != undefined) {
                        // Generate retina filename
                        var imgSrcNew = generateRetinaFileName(imgSrc, settings);
                        // Check new and original are not the same
                        if (imgSrcNew != imgSrc) {
                            // Check file exists
                            if (checkFileExists(imgSrcNew, settings)) {
                                if (settings.imageTagsRetinaRatio) {
                                    if (obj.attr('data-retinaratio') == undefined || obj.attr('data-retinaratio') == true) {
                                        if (obj.attr('width') == undefined) obj.attr('width', obj.width());
                                        if (obj.attr('height') == undefined) obj.attr('height', obj.height());
                                    }
                                }
                                obj.attr('src', imgSrcNew);
                                obj.attr("data-clretina", "set");
                            }
                        }
                    }
                }
            }
               
            // Get CSS background image
            var cssSrc = obj.css('background-image');
            if (cssSrc != undefined) {
                if (cssSrc != 'none') {
                    if (cssSrc.match("^url")) {                        
                        if (obj.attr("data-clretina") == undefined) {
                            // Remove the URL css prefix
                            cssSrc = cssSrc.replace("url(\"", "").replace("\")", "");
                            // Get the background position
                            var cssPosition = obj.css('background-position');
                            // Generate retina filename
                            var cssSrcNew = generateRetinaFileName(cssSrc, settings);
                            // Check new and original are not the same
                            if (cssSrcNew != cssSrc) {
                                // Check file exists
                                if (checkFileExists(cssSrcNew, settings)) {
                                    obj.css('background-image', 'url(' + cssSrcNew + ')');
                                    obj.attr("data-clretina", "set");
                                    if (settings.cssBackgroundsRetinaRatio) {
                                        if (obj.attr('data-retinaratio') == undefined || obj.attr('data-retinaratio') == true) {
                                            // Reset the background image size
                                            var img = new Image;
                                            img.src = cssSrc;
                                            obj.css('background-size', img.width + 'px ' + img.height + 'px');
                                            img = null;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if (obj.children().length > 0) {
                obj.children().each(function () {
                    return checkChildren($(this), isRetinaEnabled, settings);
                });
            } else {
                return obj;
            }

        }

    };

}( jQuery ));