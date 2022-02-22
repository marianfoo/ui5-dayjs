# UI5 custom control `ui5-cc-dayjs`

Usage of dayjs directly in a UI5 custom control.

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
 - language
   - if the input format has language dependent values (like Month), you can use this property to set the language
 - Manipulate
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
