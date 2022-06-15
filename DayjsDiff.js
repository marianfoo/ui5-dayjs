sap.ui.define(
  [
    "sap/m/Text",
    "sap/base/util/ObjectPath",
    "dayjs/dayjs.min",
    "dayjs/plugin/customParseFormat",
    "dayjs/plugin/utc",
  ],
  (Text, ObjectPath, dayjs, dayjsCustomParseFormat, dayjsUTC) => {
    return Text.extend("ui5-community.dateformat.DayjsDiff", {
      ObjectPath: ObjectPath,
      dayjs: dayjs,
      _dayjsObjectDate1: null,
      _dayjsObjectDate2: null,
      locale: null,

      metadata: {
        properties: {
          inputFormat: {
            type: "string",
            defaultValue: "",
          },
          date1: {
            type: "string",
            defaultValue: "",
          },
          date2: {
            type: "string",
            defaultValue: "",
          },
          unit: {
            type: "string"
          },
          integer: {
            type: "boolean",
            defaultValue: true,
          },
          absolute: {
            type: "boolean",
            defaultValue: false,
          }
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
        sap.m.Text.prototype.init.apply(this);
        this.rerender(this);
      },

      handleData: function (oControl) {
        // get dayjs object
        var dayjsDateArray = oControl._inputToDayjs(oControl);
        // manipulate dayjsobject
        var difference = oControl._calculateDifference(oControl, dayjsDateArray);
        oControl.setText(difference);
        // set dayjsobject to control
        oControl._dayjsObjectDate1 = dayjsDateArray[0];
        oControl._dayjsObjectDate2 = dayjsDateArray[1];
      },

      _inputToDayjs: function (oControl) {
        if (oControl.getInputFormat() !== "") {
          dayjsDate1 = oControl.dayjs(
            oControl.getDate1(),
            oControl.getInputFormat()
          );
          dayjsDate2 = oControl.dayjs(
            oControl.getDate2(),
            oControl.getInputFormat()
          );
        } else {
          // no input format, so iso 8601 date string expected
          if (oControl.getDate1() !== "") {
            dayjsDate1 = oControl.dayjs(oControl.getDate1());
          } else {
            // no input value, return now date
            dayjsDate1 = oControl.dayjs();
          }
          if (oControl.getDate2() !== "") {
            dayjsDate2 = oControl.dayjs(oControl.getDate2());
          } else {
            // no input value, return now date
            dayjsDate2 = oControl.dayjs();
          }
        }
        return [dayjsDate1,dayjsDate2];
      },

      _calculateDifference: function (oControl, dayjsDateArray) {
        var dayjsDate1 = dayjsDateArray[0];
        var dayjsDate2 = dayjsDateArray[1];
        var difference = dayjsDate1.diff(dayjsDate2,oControl.getUnit(),!oControl.getInteger())
        if (oControl.getAbsolute()){
          return Math.abs(difference);
        }
        return difference;
      },

      /**
       * return dayjs object date1
       */
      getDayjsObjectDate1: function () {
        return this._dayjsObjectDate1;
      },
      /**
       * return dayjs object date2
       */
       getDayjsObjectDate2: function () {
        return this._dayjsObjectDate2;
      }

    });
  }
);
