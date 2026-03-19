const credentialsFunction = {
    default() {
        return (request, response) => {
            response.setHeader("access-control-allow-credentials", "true");
        };
    },
};

export { credentialsFunction };
