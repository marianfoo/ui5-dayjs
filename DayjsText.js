sap.ui.define(
  [
    "sap/m/Text",
    "sap/base/util/ObjectPath",
    "dayjs/dayjs.min",
    "dayjs/plugin/customParseFormat",
    "dayjs/plugin/utc",
  ],
  (Text, ObjectPath, dayjs, dayjsCustomParseFormat, dayjsUTC) => {
    return Text.extend("ui5-community.dateformat.DayjsText", {
      ObjectPath: ObjectPath,
      dayjs: dayjs,
      dayjsCustomParseFormat: dayjsCustomParseFormat,
      dayjsUTC: dayjsUTC,
      _dayjsObject: null,
      language: "en",
      locale: null,

      metadata: {
        properties: {
          inputFormat: {
            type: "string",
            defaultValue: "",
          },
          outputFormat: {
            type: "string",
            defaultValue: "",
          },
          utc: {
            type: "boolean",
            defaultValue: false,
          },
          value: {
            type: "string",
            defaultValue: "",
          },
          manipulate: {
            type: "any",
            defaultValue: "",
          },
        },
      },

      renderer: {
        apiVersion: 2,
        /**
         * create the view layer
         *
         * @param {sap.ui.core.RenderManager} oRM Render Manager v2
         * @param {sap.ui.core.Control} oControl this control
         */

        render(oRM, oControl) {
          oControl.handleData(oControl);
          sap.m.TextRenderer.render(oRM, oControl);
        },
      },

      init: async function () {
        await this.loadLocalPluginReturnPromise();
        sap.m.Text.prototype.init.apply(this);
        this.rerender(this);
      },

      handleData: function (oControl) {
        oControl.dayjs.extend(oControl.dayjsCustomParseFormat);
        // set plugins
        oControl._setPlugins(oControl);
        // get dayjs object
        var dayjsDate = oControl._inputToDayjs(oControl);
        // manipulate dayjsobject
        dayjsDate = oControl._manipulate(dayjsDate, oControl);
        // set output format
        oControl._setOutputFormat(dayjsDate, oControl);
        // set dayjsobject to control
        oControl._dayjsObject = dayjsDate;
      },

       /**
       * check if flp language is available
       * if other language than english is set, load locale plugin to dayjs object
       */
      loadLocalPluginReturnPromise: async function () {
        var language = ""
        await new Promise((resolve, reject) => {
          var sCurrentLocale = "";
          try {
            sCurrentLocale = sap.ui
              .getCore()
              .getConfiguration()
              .getLanguage()
              .substring(0, 2)
              .toLowerCase();
          } catch (error) {}

          if (sCurrentLocale === "") {
            var userLang = navigator.language || navigator.userLanguage;
            sCurrentLocale = userLang.substring(0, 2).toLowerCase();
          }
          language = sCurrentLocale
          if (sCurrentLocale !== "en") {
            sap.ui.require(
              ["dayjs/locale/" + sCurrentLocale.toLowerCase()],
              resolve,
              reject
            );
          } else {
            resolve();
          }
        });
        if (language !== "en") {
          var locale = sap.ui.require("dayjs/locale/" + language);
          this.dayjs.locale(locale);
        }
      },

      /**
       * return dayjs object
       */
      getDayjsObject: function () {
        return this._dayjsObject;
      },

      _manipulate: function (dayjsDate, oControl) {
        if (oControl.getManipulate()) {
          var object = oControl.getManipulate();
          var args;
          if (object.hasOwnProperty("amount")) {
            args = [object.amount, object.unit];
          } else {
            args = [object.unit];
          }
          dayjsDate = oControl._executeFunctionByName(
            object.method,
            dayjsDate,
            args
          );
        }
        return dayjsDate;
      },

      _setPlugins: function (oControl) {
        // set utc plugin
        if (oControl.getUtc()) {
          oControl.dayjs.extend(dayjsUTC);
        }
      },

      _inputToDayjs: function (oControl) {
        if (oControl.getInputFormat() !== "") {
          dayjsDate = oControl.dayjs(
            oControl.getValue(),
            oControl.getInputFormat()
          );
        } else {
          // no input format, so iso 8601 date string expected
          if (oControl.getValue() !== "") {
            dayjsDate = oControl.dayjs(oControl.getValue());
          } else {
            // no input value, return now date
            dayjsDate = oControl.dayjs();
          }
        }
        return dayjsDate;
      },

      _setOutputFormat: function (dayjsDate, oControl) {
        if (oControl.getUtc()) {
          oControl.setText(dayjsDate.utc().format(oControl.getOutputFormat()));
        } else {
          oControl.setText(dayjsDate.format(oControl.getOutputFormat()));
        }
      },

      _executeFunctionByName: function (functionName, context /*, args */) {
        var args = Array.prototype.slice.call(arguments, 2)[0];
        var namespaces = functionName.split(".");
        var func = namespaces.pop();
        for (var i = 0; i < namespaces.length; i++) {
          context = context[namespaces[i]];
        }
        return context[func].apply(context, args);
      },
    });
  }
);
