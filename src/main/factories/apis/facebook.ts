import { FacebookApi } from "@/infra/gateways";
import { env } from "../../config/env";
import { makeAxiosClient } from "../http";

export const makeFaceboookApi = (): FacebookApi => {
    const axiosClient = makeAxiosClient();
    return new FacebookApi(
        axiosClient,
        env.facebookApi.clientId,
        env.facebookApi.clientSecret
    );
};
