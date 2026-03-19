import { decodeUrl } from '../../../decodeUrl.mjs';
import { createRouterFunctionBuilder } from '../create.mjs';

const defaultRouterFunctionBuilder = createRouterFunctionBuilder(({ routerElementWrapper, malformedUrlRouterElement, notfoundRouterElement, classRequest, }) => (initializationData) => {
    const routerElements = routerElementWrapper[initializationData.method];
    const decodedUrl = decodeUrl(initializationData.url);
    if (!decodedUrl) {
        return malformedUrlRouterElement.buildedRoute(new classRequest({
            ...initializationData,
            params: {},
            path: "",
            query: {},
            matchedPath: null,
            bodyReader: malformedUrlRouterElement.bodyReader,
        }));
    }
    if (!routerElements) {
        return notfoundRouterElement.buildedRoute(new classRequest({
            ...initializationData,
            ...decodedUrl,
            params: {},
            matchedPath: null,
            bodyReader: notfoundRouterElement.bodyReader,
        }));
    }
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let index = 0; index < routerElements.length; index++) {
        const routerElement = routerElements[index];
        const result = routerElement.pattern.exec(decodedUrl.path);
        if (!result) {
            continue;
        }
        return routerElement.buildedRoute(new classRequest({
            ...initializationData,
            ...decodedUrl,
            params: result.groups ?? {},
            matchedPath: routerElement.matchedPath,
            bodyReader: routerElement.bodyReader,
        }));
    }
    return notfoundRouterElement.buildedRoute(new classRequest({
        ...initializationData,
        ...decodedUrl,
        params: {},
        matchedPath: null,
        bodyReader: notfoundRouterElement.bodyReader,
    }));
});

export { defaultRouterFunctionBuilder };
