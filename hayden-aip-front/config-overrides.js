const { override, fixBabelImports, addLessLoader } = require('customize-cra');

//Pack on demand for antd, pack according to import
//yarn add react-app-rewired customize-cra babel-plugin-import

module.exports = override(

    fixBabelImports('import', {

        libraryName: 'antd',

        libraryDirectory: 'es',

        style: true, //automactically package

    }),

    addLessLoader({
        lessOptions: {
          javascriptEnabled: true,
          //custome theme
          //yarn add less less-loader
          modifyVars: { '@primary-color': '#1DA57A' },
        },
      }),

);

//router
//yarn add react-router-dom

//axios
//yarn add axios

//store
//yarn add store
//utils/memoryUtils.js

//jsonp
//yarn add jsonp

//wysiwyg
//yarn add react-draft-wysiwyg draftjs-to-html