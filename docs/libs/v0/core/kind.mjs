import { createKindNamespace } from '@duplojs/utils';

const createCoreLibKind = createKindNamespace(
// @ts-expect-error reserved kind namespace
"DuplojsHttpCore");

export { createCoreLibKind };
