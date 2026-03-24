import { createKindNamespace } from '@duplojs/utils';

const createCookiePluginKind = createKindNamespace(
// @ts-expect-error reserved kind namespace
"DuplojsCookiePlugin");

export { createCookiePluginKind };
