const allowHeadersFunction = {
    default(allowHeaders) {
        return (request, response) => {
            response.setHeader("Access-Control-Allow-Headers", allowHeaders);
        };
    },
};

export { allowHeadersFunction };
