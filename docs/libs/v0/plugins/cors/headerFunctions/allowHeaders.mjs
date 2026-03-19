const allowHeadersFunction = {
    default(allowHeaders) {
        return (request, response) => {
            response.setHeader("access-control-allow-headers", allowHeaders);
        };
    },
};

export { allowHeadersFunction };
