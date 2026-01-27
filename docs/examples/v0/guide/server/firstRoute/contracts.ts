import { ResponseContract } from "@duplojs/http";
import { DPE } from "@duplojs/utils";

ResponseContract.ok("superResponse", DPE.string());
ResponseContract.created("superResponse", DPE.object({
	username: DPE.string(),
	age: DPE.number(),
}));
ResponseContract.noContent("superResponse");
ResponseContract.conflict("email.alreadyUse");
ResponseContract.notFound("user.notfound");
ResponseContract.notFound("product.notfound");

