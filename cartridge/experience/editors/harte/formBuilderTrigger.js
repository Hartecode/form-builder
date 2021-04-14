"use strict";

var Resource = require("dw/web/Resource");
var HashMap = require("dw/util/HashMap");
var PageMgr = require('dw/experience/PageMgr');

module.exports.init = function (editor) {
      // Default values properties
    var defaults = {
        buttonBreakout: 'Select',
        titleBreakout: 'Cars',
        placeholder: 'Select your custom car',
        description: 'Description of Custom Car Editor',
        group1: 'car group1 configuration'
    };

    // Add some localizations
    var localization = Object.keys(defaults).reduce(function (acc, key) {
        acc.put(key, Resource.msg(key, 'experience.editors.harte.formBuilderTrigger', defaults[key]));
        return acc;
    }, new HashMap());
    editor.configuration.put('localization', localization);

    // Pass through property `options.config` from the `attribute_definition` to be used in a breakout editor
    var options = new HashMap();
    options.put('config', editor.configuration.options.config);

    // Create a configuration for a custom editor to be displayed in a modal breakout dialog (breakout editor)
    var breakoutEditorConfig = new HashMap();
    breakoutEditorConfig.put('localization', localization);
    breakoutEditorConfig.put('options', options);

    // Add a dependency to the configured breakout editor
    var breakoutEditor = PageMgr.getCustomEditor('harte.formBuilderBreakout', breakoutEditorConfig);
    editor.dependencies.put('formBuilderBreakout', breakoutEditor);
};
