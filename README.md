# UI5 custom control `ui5-cc-dayjs`

Usage of dayjs directly in a UI5 custom control.

## Features

Dayjs is a JavaScript library for parsing, validating, and formatting dates.  
With this custom control, you can use dayjs in your UI5 App.
 * use custom input and output formats (i.e. input format `YYYY-MM-DD` and output format `We/May/2022`)
 * manipulate your dates (i.e. add/remove days, months, years, etc.)
 * get start/end of the week, month, year, etc.
 * automatic translation, if present use locale of Fiori Launchpad, if not present use browser language

### Sample App with usage

https://github.com/marianfoo/ui5-dayjs-sample/blob/main/uimodule/webapp/view/MainView.view.xml

## Install

```bash
$> yarn add @marianfoo/ui5-cc-dayjs
# or
$> npm install @marianfoo/ui5-cc-dayjs
```

## Usage

1. define the dependeny in `$yourapp/package.json`

   ```json
   // it is already in "dependencies" after installation
   "ui5": {
     "dependencies": [
       // ...
       "ui5-cc-dayjs",
       // ...
     ]
   }
   ```

2. declare the namespace in your XML view and use the custom control from that namespace

   ```xml
   <mvc:View ... 
           xmlns:datejs="ui5-community.dayjs"
           ...>
      <datejs:DayjsText id="dayjsControl" value="2014/12/30" inputFormat="yyyy/MM/dd" outputFormat="dd.MM.YYYY"/>
   </mvc:View>
   ```

## How it works

Control is using dayjs behind the scenes.
More interfaces from dayjs are coming.

## Api

Control is inheriting from [`sap.m.Text`](https://ui5.sap.com/#/api/sap.m.Text). So you can use all of the properties and methods of `sap.m.Text`.

### Properties
 - value
   - Input of date Format
   - If it´s not ISO 8601, you have to use the inputFormat property
 - inputFormat
   - List of all available formats from dayjs [here](https://day.js.org/docs/en/parse/string-format)
 - outputFormat
   - List of all available formats from dayjs [here](https://day.js.org/docs/en/parse/string-format)
 - `m`anipulate
   - currently support is only `Add`,`Subtract`, `Start of Time` and `End of Time`
```xml
   <mvc:View ... 
           xmlns:datejs="ui5-community.dayjs"
           ...>
          <Label text="Add 1 Day" />
          <datejs:DayjsText value="{path: '/date'}" inputFormat="{path: '/inputFormat'}" outputFormat="{path: '/outputFormat'}"
          manipulate="{method: 'add',unit: 'day',amount: 1}"/>

          <Label text="Substract 2 Month " />
          <datejs:DayjsText value="{path: '/date'}" inputFormat="{path: '/inputFormat'}" outputFormat="{path: '/outputFormat'}"
          manipulate="{method: 'subtract',unit: 'month',amount: 2}"/>

          <Label text="Begin of Year" />
          <datejs:DayjsText value="{path: '/date'}" inputFormat="{path: '/inputFormat'}" outputFormat="{path: '/outputFormat'}"
          manipulate="{method: 'startOf',unit: 'year'}"/>

          <Label text="End of Quarter" />
          <datejs:DayjsText value="{path: '/date'}" inputFormat="{path: '/inputFormat'}" outputFormat="{path: '/outputFormat'}"
          manipulate="{method: 'endOf',unit: 'quarter'}"/>
   </mvc:View>
   ```
### Methods

- getDayjsObject
  - returns dayjs Object

## License

This work is [dual-licensed](./LICENSE) under Apache 2.0 and the Derived Beer-ware License. The official license will be Apache 2.0, but ultimately you can choose between one of them if you use this work.

When you like this stuff, buy [you](https://you) a drink when you see the person.
