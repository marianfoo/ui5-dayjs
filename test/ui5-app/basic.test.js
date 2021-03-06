// note: jest dev server is used
// for booting up `ui5 serve`

const url = "http://localhost:8080"
jest.setTimeout(10000)

describe("errorhandler.Control", () => {
    test("should find the errorhandler.Control in index.html", async () => {
        await page.goto(`${url}/index.html`)
        await expect(page).toBeTruthy()
    })
})
