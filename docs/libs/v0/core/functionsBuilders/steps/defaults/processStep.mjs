import '../../../steps/index.mjs';
import '../../../response/index.mjs';
import { createStepFunctionBuilder } from '../create.mjs';
import { G, E, A, unwrap, pipe, P, or, isType, forward } from '@duplojs/utils';
import { processStepKind } from '../../../steps/process.mjs';
import { Response } from '../../../response/base.mjs';

function buildStepsFunction(steps, buildStep) {
    return G.asyncReduce(steps, G.reduceFrom([]), async ({ lastValue, element: step, next, exit }) => {
        const result = await buildStep(step);
        if (E.isLeft(result)) {
            return exit(result);
        }
        return next(A.push(lastValue, unwrap(result)));
    });
}
const defaultProcessStepFunctionBuilder = createStepFunctionBuilder(processStepKind.has, async (step, { success, buildStep }) => {
    const { process, imports, options: stepOptions, } = step.definition;
    const { steps, hooks: processHook, options: processOptions, } = process.definition;
    const maybeBuildedSteps = await buildStepsFunction(steps, buildStep);
    if (E.isLeft(maybeBuildedSteps)) {
        return maybeBuildedSteps;
    }
    const buildedSteps = maybeBuildedSteps;
    const getOptions = pipe(stepOptions ?? processOptions, P.when(or([
        isType("object"),
        isType("undefined"),
    ]), (options) => (() => options)), P.otherwise(forward));
    return success({
        buildedFunction: async (request, floor) => {
            let processFloor = { options: getOptions(floor) };
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let index = 0; index < buildedSteps.length; index++) {
                const result = await buildedSteps[index].buildedFunction(request, processFloor);
                if (result instanceof Response) {
                    return result;
                }
                processFloor = result;
            }
            if (imports) {
                const newFloor = { ...floor };
                // eslint-disable-next-line @typescript-eslint/prefer-for-of
                for (let index = 0; index < imports.length; index++) {
                    newFloor[imports[index]] = processFloor[imports[index]];
                }
                return newFloor;
            }
            return floor;
        },
        hooksRouteLifeCycle: [
            ...processHook,
            ...A.flatMap(buildedSteps, ({ hooksRouteLifeCycle }) => hooksRouteLifeCycle),
        ],
    });
});

export { buildStepsFunction, defaultProcessStepFunctionBuilder };
