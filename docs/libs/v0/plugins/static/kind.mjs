import { createKindNamespace } from '@duplojs/utils';

const createStaticPluginKind = createKindNamespace(
// @ts-expect-error reserved kind namespace
"DuplojsStaticPlugin");

export { createStaticPluginKind };
