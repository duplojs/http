import { TheFormData } from "@duplojs/utils";

export type Routes = {
    method: "POST";
    path: "/documents";
	body: TheFormData<{
		userId: number;
		files: {
			alt: string;
			file: File;
			description: string;
		}[];
	}>;
    responses: {
        code: "422";
        information: "extract-error";
        body?: undefined;
    } | {
        code: "204";
        information: "files.receive";
        body?: undefined;
    };
};