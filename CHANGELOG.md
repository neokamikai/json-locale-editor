# Translation Manager

## 2021-02-12 - v0.3.0 - Server in typescript + ESlint setup + Gulp build
* Fixed an error when parsing JSON files with BOM
* Refactored all **server** side code to typescript and moved it to **server** folder
* Applied **eslint --fix** on **src/public/helpers/translation-manager/index.spec.js**
* Enable debug for **npm run dev** or **yarn dev**
* Fix **.dockerignore** and **Dockerfile** to properly work with gulp and typescript
* Fix **gulpfile.js** build destinations and **shouldBuild** rule
* Updated **package.json** including a lot modules for using **typescript**, **eslint** and **gulp**
* Applied **eslint --fix** on **jest.config.js**
* Adjusted **tsconfig.json** settings
* Add **gulpfile.js**
* Update **.editorconfig** ***end_of_line*** setting to use **lf** instead of **crlf**
* Add **.eslintignore** and **.eslintrc.js**
* Add **.dockerignore**
* Add some entries to **.gitignore**: **package-lock.json**, **dist**, **tmp**, **temp** and **~\***

## 2021-02-12 - v0.2.1 - "start" script and Docker image build/publish
* Add script **start** on **package.json**
* Add **Dockerfile** to allow docker image build and publishing
## 2021-02-12 - v0.2.0 - Layout and Support for .properties files
* Layout changes:
  * Encapsulated layout in cards
  * Add button for reading and exporting **.properties** files
* API changes:
  * Changed api upload handlers to use a common handler builder with output key and parser to be defined per-endpoint
  * Included parser for **.properties** file content 
  * Included new api endpoint **/read-properties**

## 2021-02-11 - v0.1.0 - MVP Release
* Initial version features:
  * Read **.json** translation files (object json files only, array fields not supported)
  * Export/Import **.csv** files
  * Export **.json** files
