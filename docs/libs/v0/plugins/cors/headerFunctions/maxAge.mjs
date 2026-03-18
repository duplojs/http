const maxAgeFunction = {
    default(maxAge) {
        return (request, response) => {
            response.setHeader("Access-Control-Max-Age", maxAge);
        };
    },
};

export { maxAgeFunction };
