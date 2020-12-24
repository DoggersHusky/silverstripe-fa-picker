const Path = require("path");
const webpack = require("webpack");
const rootDir = Path.resolve();
const moduleCSS = require(rootDir + "/webpack-config/css/modules");
const pluginCSS = require(rootDir + "/webpack-config/css/plugins");

const config = [
    {
        mode: "development",
        name: "theme-css",
        entry: {
            styles: rootDir + "/scss/main.scss",
        },
        output: {
            path: rootDir,
            devtoolModuleFilenameTemplate: "../[resource-path]?[hash]",
            devtoolFallbackModuleFilenameTemplate: "../[resource-path]?[hash]",
        },
        devtool: "nosources-source-map",
        module: moduleCSS(rootDir),
        plugins: [...pluginCSS(rootDir)],
        optimization: {
            splitChunks: {
                cacheGroups: {
                    default: false,
                    styles: {
                        name(module, chunks, cacheGroupKey) {
                            const moduleFileName = module
                                .identifier()
                                .split("/")
                                .pop();
                            return moduleFileName;
                        },
                        test: /\.css$/,
                        chunks: "all",
                        enforce: true,
                    },
                },
            },
        },
    },
    {
        name: "cms-js",
        entry: {
            "boot/boot": rootDir + "/js-src/boot/boot.js",
        },
        output: {
            path: rootDir,
            filename: "javascript/[name].js",
            devtoolModuleFilenameTemplate: function (opts) {
                if (
                    opts.resource.search("./js-src/") >= 0 ||
                    opts.resource.search("./javascript/") >= 0 ||
                    opts.resource.search("javascript/") == 0
                ) {
                    return (
                        opts.resourcePath.replace(/^.\//, "../") +
                        "?" +
                        opts.hash
                    );
                }

                return "webpack:///" + opts.resourcePath + "?" + opts.loaders;
            },
            devtoolFallbackModuleFilenameTemplate: function (opts) {
                if (
                    opts.resource.search("./js-src/") >= 0 ||
                    opts.resource.search("./javascript/") >= 0 ||
                    opts.resource.search("javascript/") == 0
                ) {
                    return (
                        "../../" +
                        opts.resourcePath.replace(/^.\//, "../") +
                        "?" +
                        opts.hash
                    );
                }

                return "webpack:///" + opts.resourcePath + "?" + opts.loaders;
            },
        },
        devtool: "nosources-source-map",
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                ["@babel/env", { modules: false }],
                                "@babel/react",
                            ],
                            comments: false,
                        },
                    },
                },
            ],
        },
        externals: {
            "apollo-client": "ApolloClient",
            "bootstrap-collapse": "BootstrapCollapse",
            classnames: "classnames",
            "deep-freeze-strict": "DeepFreezeStrict",
            "graphql-fragments": "GraphQLFragments",
            "graphql-tag": "GraphQLTag",
            "isomorphic-fetch": "IsomorphicFetch",
            i18n: "i18n",
            jquery: "jQuery",
            merge: "merge",
            "page.js": "Page",
            "react-dom/test-utils": "ReactAddonsTestUtils",
            "react-dom": "ReactDom",
            poppers: "Poppers",
            reactstrap: "Reactstrap",
            "react-apollo": "ReactApollo",
            "react-redux": "ReactRedux",
            "react-router-dom": "ReactRouterDom",
            "react-select": "ReactSelect",
            react: "React",
            "redux-form": "ReduxForm",
            "redux-thunk": "ReduxThunk",
            redux: "Redux",
            config: "Config",
            url: "NodeUrl",
            qs: "qs",
            moment: "moment",
            modernizr: "modernizr",
            "react-dnd": "ReactDND",
            "react-dnd-html5-backend": "ReactDNDHtml5Backend",
            validator: "validator",
            "prop-types": "PropTypes",

            // provided by silverstripe or modules
            "components/Accordion/Accordion": "Accordion",
            "components/Accordion/AccordionBlock": "AccordionBlock",
            "components/Button/Button": "Button",
            "components/Button/BackButton": "BackButton",
            "components/Breadcrumb/Breadcrumb": "Breadcrumb",
            "components/FormAction/FormAction": "FormAction",
            "components/FormBuilder/FormBuilder": "FormBuilder",
            "components/FormBuilderModal/FormBuilderModal": "FormBuilderModal",
            "components/FileStatusIcon/FileStatusIcon": "FileStatusIcon",
            "components/FieldHolder/FieldHolder": "FieldHolder",
            "components/GridField/GridField": "GridField",
            "components/Toolbar/Toolbar": "Toolbar",
            "components/LiteralField/LiteralField": "LiteralField",
            "components/Preview/Preview": "Preview",
            "components/ListGroup/ListGroup": "ListGroup",
            "components/ListGroup/ListGroupItem": "ListGroupItem",
            "components/Loading/Loading": "Loading",
            "components/FormAlert/FormAlert": "FormAlert",
            "components/Badge/Badge": "Badge",
            "components/VersionedBadge/VersionedBadge": "VersionedBadge",
            "components/TreeDropdownField/TreeDropdownField":
                "TreeDropdownField",
            "components/Focusedzone/Focusedzone": "Focusedzone",
            "components/ViewModeToggle/ViewModeToggle": "ViewModeToggle",
            "components/ResizeAware/ResizeAware": "ResizeAware",
            "components/Tag/Tag": "Tag",
            "components/Tag/TagList": "TagList",
            "components/Tag/CompactTagList": "CompactTagList",
            "components/Search/Search": "Search",
            "components/Search/SearchToggle": "SearchToggle",
            "containers/FormBuilderLoader/FormBuilderLoader":
                "FormBuilderLoader",
            "containers/InsertMediaModal/InsertMediaModal": "InsertMediaModal",
            "containers/InsertLinkModal/InsertLinkModal": "InsertLinkModal",
            "containers/InsertLinkModal/fileSchemaModalHandler":
                "FileSchemaModalHandler",
            "state/breadcrumbs/BreadcrumbsActions": "BreadcrumbsActions",
            "state/schema/SchemaActions": "SchemaActions",
            "state/toasts/ToastsActions": "ToastsActions",
            "state/records/RecordsActions": "RecordsActions",
            "state/records/RecordsActionTypes": "RecordsActionTypes",
            "state/tabs/TabsActions": "TabsActions",
            "state/viewMode/ViewModeActions": "ViewModeActions",
            "lib/DataFormat": "DataFormat",
            "lib/Backend": "Backend",
            "lib/getFormState": "getFormState",
            "lib/ReactRouteRegister": "ReactRouteRegister",
            "lib/ReducerRegister": "ReducerRegister",
            "lib/SilverStripeComponent": "SilverStripeComponent",
            "lib/formatWrittenNumber": "formatWrittenNumber",
            "lib/Router": "Router",
            "lib/schemaFieldValues": "schemaFieldValues",
            "lib/Config": "Config",
            "lib/Injector": "Injector",
            "lib/reduxFieldReducer": "reduxFieldReducer",
            "lib/TinyMCEActionRegistrar": "TinyMCEActionRegistrar",
            "lib/ShortcodeSerialiser": "ShortcodeSerialiser",
            "lib/withDragDropContext": "withDragDropContext",
        },
    },
];

// Use WEBPACK_CHILD=js or WEBPACK_CHILD=css env var to run a single config
module.exports = process.env.WEBPACK_CHILD
    ? config.find((entry) => entry.name === process.env.WEBPACK_CHILD)
    : (module.exports = config);
