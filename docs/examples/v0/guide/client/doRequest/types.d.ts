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
} | {
    method: "POST";
    path: "/users";
    body: {
        username: string;
		age: number;
    };
    responses: {
        code: "422";
        information: "extract-error";
        body?: undefined;
    } | {
        code: "204";
        information: "user.created";
        body?: undefined;
    };
} | {
    method: "POST";
    path: "/users/{userId}/posts";
    params: {
        userId: number;
    };
	body: {
		title: string
		content: string
	};
    responses: {
        code: "422";
        information: "extract-error";
        body?: undefined;
    } | {
        code: "204";
        information: "post.created";
        body?: undefined;
    };
} | {
    method: "GET";
    path: "/posts";
    query: {
        page: number;
    };
    responses: {
        code: "422";
        information: "extract-error";
        body?: undefined;
    } | {
        code: "200";
        information: "post.findMany";
        body: {
			title: string
			content: string
			authorId: number
		}[];
    };
};