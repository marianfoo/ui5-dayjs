sap.ui.define(
  [
    "sap/m/Text",
    "dayjs/dayjs.min",
    "dayjs/plugin/customParseFormat",
    "dayjs/plugin/utc",
  ],
  (Text, dayjs, dayjsCustomParseFormat, dayjsUTC) => {
    return Text.extend("ui5-community.dateformat.DayjsText", {
      dayjs: dayjs,
      dayjsCustomParseFormat: dayjsCustomParseFormat,
      dayjsUTC: dayjsUTC,
      _dayjsObject: null,

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
          language: {
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
            if(object.hasOwnProperty("amount")){
                args = [object.amount, object.unit];
            }else {
                args = [object.unit];
            }
            dayjsDate = oControl._executeFunctionByName(object.method,dayjsDate,args)
            // oControl._executeFunctionByName('add',dayjsDate,[1,'day'])
            console.log(oControl.getManipulate());
        }
        return dayjsDate;
      },

      _setPlugins: function (oControl) {
        // set utc plugin
        if (oControl.getUtc()) {
          oControl.dayjs.extend(dayjsUTC);
        }
        return oControl;
      },

      _inputToDayjs: function (oControl) {
        if (oControl.getInputFormat() !== "") {
          if (oControl.getLanguage() !== "") {
            dayjsDate = oControl.dayjs(
              oControl.getValue(),
              oControl.getInputFormat(),
              oControl.getLanguage()
            );
          } else {
            dayjsDate = oControl.dayjs(oControl.getValue());
          }
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
        return oControl;
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
          // set plugin to parse input format
          oControl.dayjs.extend(oControl.dayjsCustomParseFormat);
          // set plugins
          oControl = oControl._setPlugins(oControl);
          // get dayjs object
          var dayjsDate = oControl._inputToDayjs(oControl);
          // manipulate dayjsobject
          dayjsDate = oControl._manipulate(dayjsDate, oControl);
          // set output format
          oControl = oControl._setOutputFormat(dayjsDate, oControl);
          // set dayjsobject to control
          oControl._dayjsObject = dayjsDate;
          // render control
          sap.m.TextRenderer.render(oRM, oControl);
        },
      },



      _executeFunctionByName: function(functionName, context /*, args */) {
        var args = Array.prototype.slice.call(arguments, 2)[0];
        var namespaces = functionName.split(".");
        var func = namespaces.pop();
        for (var i = 0; i < namespaces.length; i++) {
            context = context[namespaces[i]];
        }
        return context[func].apply(context, args);
    }
    });
  }
);
