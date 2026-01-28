import { preflightBuilder } from './builder.mjs';
import '../route/index.mjs';
import { A } from '@duplojs/utils';
import { routeBuilderHandler } from '../route/builder.mjs';

preflightBuilder.set("useRouteBuilder", ({ args: [method, paths, options,], accumulator, }) => routeBuilderHandler.use({
    method,
    paths: A.coalescing(paths),
    preflightSteps: accumulator.preflightSteps,
    steps: [],
    hooks: [
        ...(options?.hooks ?? []),
        ...accumulator.hooks,
    ],
    metadata: [
        ...(options?.metadata ?? []),
        ...accumulator.metadata,
    ],
}));
