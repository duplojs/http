export type Routes = {
	method: "GET";
	path: "/users";
	responses: {
		code: "200";
		information: "users.findMany";
		body: {
			id: number;
			username: string;
		}[];
	};
} | {
	method: "GET";
	path: "/users/{userId}";
	params: {
		userId: number;
	};
	responses: {
		code: "200";
		information: "users.findOne";
		body: {
			id: number;
			username: string;
		};
	};
};
