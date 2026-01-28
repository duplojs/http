import { usePreflightBuilder } from "@duplojs/http";
import { authenticationProcess } from "./process";

export const useAuthenticatedRouteBuilder = usePreflightBuilder()
	.exec(authenticationProcess, { imports: ["user"] })
	.useRouteBuilder;
