sap.ui.define(
  [
    "sap/m/Text",
    "sap/base/util/ObjectPath",
    "dayjs/dayjs.min",
    "dayjs/plugin/customParseFormat",
    "dayjs/plugin/utc"
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
          oControl.handleData(oControl)
          sap.m.TextRenderer.render(oRM, oControl);
        },
      },

      init: async function () {
        this.promise2 = this.loadLocalPluginReturnPromise();
        this.language = await this.promise2;
        if (this.language === "undefined") {
          var userLang = navigator.language || navigator.userLanguage; 
          this.language = userLang.substring(0, 2).toLowerCase();
        }
        if(this.language !== "en") {
        var locale = sap.ui.require("dayjs/locale/" + this.language);
        this.dayjs.locale(locale)
        }
        sap.m.Text.prototype.init.apply(this);
        this.rerender(this)
      },

      handleData : function(oControl) {
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

      loadLocalPluginReturnPromise: function () {
        var oModel = new sap.ui.model.json.JSONModel();
        sap.ui.getCore().setModel(oModel, "ui5-community.dateformat.DayjsText");
        return new Promise((resolve, reject) => {
          try {
            var sCurrentLocale = sap.ui
              .getCore()
              .getConfiguration()
              .getLanguage()
              .substring(0, 2)
              .toLowerCase();
            sap.ui
              .getCore()
              .getModel("ui5-community.dateformat.DayjsText")
              .setProperty("/promiseResolve", resolve);
            sap.ui
              .getCore()
              .getModel("ui5-community.dateformat.DayjsText")
              .setProperty("/language", sCurrentLocale);
            sap.ui
              .getCore()
              .getModel("ui5-community.dateformat.DayjsText")
              .setProperty("/promiseReject", reject);
            sap.ui.require(
              ["dayjs/locale/" + sCurrentLocale.toLowerCase()],
              function (locale) {
                var resolve = sap.ui
                  .getCore()
                  .getModel("ui5-community.dateformat.DayjsText")
                  .getProperty("/promiseResolve");
                var language = sap.ui
                  .getCore()
                  .getModel("ui5-community.dateformat.DayjsText")
                  .getProperty("/language");
                resolve(language);
              },
              function (locale) {
                var reject = sap.ui
                  .getCore()
                  .getModel("ui5-community.dateformat.DayjsText")
                  .getProperty("/promiseReject");
                reject();
              }
            );
          } catch (error) {
            console.warn(
              "language could not be determined, probably not in sap launchpad"
            );
            reject(error);
          }
        });
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
