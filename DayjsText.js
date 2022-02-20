sap.ui.define(["sap/m/Text",
               "dayjs/dayjs.min",
               "dayjs/plugin/customParseFormat",
               "dayjs/plugin/utc"
            ], (Text, dayjs, dayjsCustomParseFormat, dayjsUTC) => {
    return Text.extend("ui5-community.dateformat.DayjsText", {

        dayjs: dayjs,
        dayjsCustomParseFormat: dayjsCustomParseFormat,
        dayjsUTC: dayjsUTC,
        _dayjsObject: null,

        metadata: {
			properties: {
				inputFormat: {
					type: "string",
					defaultValue: ""
				},
                outputFormat: {
					type: "string",
					defaultValue: ""
				},
                language: {
                    type: "string",
					defaultValue: ""
                },
                utc: {
                    type: "boolean",
                    defaultValue: false
                },
                value: {
                    type: "string",
					defaultValue: ""
                }
			},
		},

        /**
             * return dayjs object
        */
        getDayjsObject: function() {
            return this._dayjsObject;
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
                var dayjsDate;
                // set plugin to parse input format
                oControl.dayjs.extend(oControl.dayjsCustomParseFormat);
                // set utc plugin
                if (oControl.getUtc()) {
                    oControl.dayjs.extend(dayjsUTC);
                }
                if (oControl.getInputFormat() !== "") {
                    if (oControl.getLanguage() !== "") {
                        dayjsDate = oControl.dayjs(oControl.getValue(), oControl.getInputFormat(), oControl.getLanguage());
                    } else {
                        dayjsDate = oControl.dayjs(oControl.getValue());
                    }
                } else {
                    // no input format, so iso 8601 date string expected
                    if (oControl.getValue() !=="") {
                        dayjsDate = oControl.dayjs(oControl.getValue());
                    } else {
                        // no input value, return now date
                        dayjsDate = oControl.dayjs();
                    }

                }
                if (oControl.getUtc()) {
                    oControl.setText(dayjsDate.utc().format(oControl.getOutputFormat()));
                } else {
                    oControl.setText(dayjsDate.format(oControl.getOutputFormat()));
                }
                oControl._dayjsObject = dayjsDate;
                sap.m.TextRenderer.render(oRM, oControl);
            }
        }
    });
});
