'use strict';

var utils = require('@duplojs/utils');
require('./hooks/index.cjs');
var metadata = require('./metadata.cjs');
var cookieHooks = require('./hooks/cookieHooks.cjs');

function cookiePlugin(params) {
    return () => ({
        name: "cookie-plugin",
        hooksHubLifeCycle: [
            {
                beforeBuildRoute: (route) => {
                    if (utils.A.some(route.definition.metadata, metadata.IgnoreRouteCookieMetadata.is)) {
                        return route;
                    }
                    return {
                        ...route,
                        definition: {
                            ...route.definition,
                            hooks: [...route.definition.hooks, cookieHooks.cookieHooks(params)],
                        },
                    };
                },
            },
        ],
    });
}

exports.cookiePlugin = cookiePlugin;
