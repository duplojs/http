import { A } from '@duplojs/utils';
import './hooks/index.mjs';
import { IgnoreRouteCookieMetadata } from './metadata.mjs';
import { cookieHooks } from './hooks/cookieHooks.mjs';

function cookiePlugin(params) {
    return () => ({
        name: "cookie-plugin",
        hooksHubLifeCycle: [
            {
                beforeBuildRoute: (route) => {
                    if (A.some(route.definition.metadata, IgnoreRouteCookieMetadata.is)) {
                        return route;
                    }
                    return {
                        ...route,
                        definition: {
                            ...route.definition,
                            hooks: [...route.definition.hooks, cookieHooks(params)],
                        },
                    };
                },
            },
        ],
    });
}

export { cookiePlugin };
