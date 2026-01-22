import { createKindNamespace } from '@duplojs/utils';

const createInterfacesNodeLibKind = createKindNamespace(
// @ts-expect-error reserved kind namespace
"DuplojsHttpInterfacesNode");

export { createInterfacesNodeLibKind };
