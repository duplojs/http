export type Routes = {
    method: "GET";
    path: "/hello-world";
    query: {
        name: string;
    };
    responses: {
        code: "422";
        information: "extract-error";
        body?: undefined;
    } | {
        code: "200";
        information: "helloWorld.send";
        body: string;
    };
};