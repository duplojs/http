'use strict';

require('../../../steps/index.cjs');
require('../../../response/index.cjs');
var create = require('../create.cjs');
var utils = require('@duplojs/utils');
var process = require('../../../steps/process.cjs');
var predicted = require('../../../response/predicted.cjs');

function buildStepsFunction(steps, buildStep) {
    return utils.G.asyncReduce(steps, utils.G.reduceFrom([]), async ({ lastValue, element: step, next, exit }) => {
        const result = await buildStep(step);
        if (utils.E.isLeft(result)) {
            return exit(result);
        }
        return next(utils.A.push(lastValue, utils.unwrap(result)));
    });
}
const defaultProcessStepFunctionBuilder = create.createStepFunctionBuilder(process.processStepKind.has, async (step, { success, buildStep }) => {
    const { process, imports, options: stepOptions, } = step.definition;
    const { steps, hooks: processHook, options: processOptions, } = process.definition;
    const maybeBuildedSteps = await buildStepsFunction(steps, buildStep);
    if (utils.E.isLeft(maybeBuildedSteps)) {
        return maybeBuildedSteps;
    }
    const buildedSteps = maybeBuildedSteps;
    const getOptions = utils.pipe(stepOptions ?? processOptions, utils.P.when(utils.or([
        utils.isType("object"),
        utils.isType("undefined"),
    ]), (options) => (() => options)), utils.P.otherwise(utils.forward));
    return success({
        buildedFunction: async (request, floor) => {
            let processFloor = { options: getOptions(floor) };
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let index = 0; index < buildedSteps.length; index++) {
                const result = await buildedSteps[index].buildedFunction(request, floor);
                if (result instanceof predicted.PredictedResponse) {
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
            ...utils.A.flatMap(buildedSteps, ({ hooksRouteLifeCycle }) => hooksRouteLifeCycle),
        ],
    });
});

exports.buildStepsFunction = buildStepsFunction;
exports.defaultProcessStepFunctionBuilder = defaultProcessStepFunctionBuilder;
