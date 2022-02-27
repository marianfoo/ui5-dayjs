const Page = require("./Page")

class Main extends Page {
    async open() {
        await super.open(`/test/flpSandbox.html#demarianzeisdatelibsample-tile`)
    }

    _viewName = "de.marianzeis.datelibsample.controller.MainView"

    async getCheckbox() {
        const cbSelector1 = {
            wdio_ui5_key: "cbSelector1",
            selector: {
                id: "test",
                viewName: this._viewName,
                controlType: "ui5-community.dayjs.DayjsText"
            }
        }

        if ((await browser.getUI5VersionAsFloat()) <= 1.6) {
            cbSelector1.forceSelect = true
            cbSelector1.selector.interaction = "root"
        }

        return await browser.asControl(cbSelector1)
    }

    async getField(id){
        const cbSelector1 = {
            wdio_ui5_key: "cbSelector1",
            selector: {
                id: id,
                viewName: this._viewName,
                controlType: "ui5-community.dayjs.DayjsText"
            }
        }

        if ((await browser.getUI5VersionAsFloat()) <= 1.6) {
            cbSelector1.forceSelect = true
            cbSelector1.selector.interaction = "root"
        }

        return await browser.asControl(cbSelector1)
    }
}

module.exports = new Main()