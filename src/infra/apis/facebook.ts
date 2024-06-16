import { HttpGetClient } from "../http";
import { LoadFacebookUserApi } from "@/domain/contracts/apis";

type AppToken = {
    access_token: string;
};

type UserInfo = {
    id: string;
    name: string;
    email: string;
};

type DebugToken = {
    data: {
        user_id: string;
    };
};

export class FacebookApi implements LoadFacebookUserApi {
    private readonly baseUrl = "https://graph.facebook.com";
    constructor(
        private readonly httpClient: HttpGetClient,
        private readonly clientId: string,
        private readonly clientSecret: string
    ) {}

    async loadUser(
        params: LoadFacebookUserApi.Params
    ): Promise<LoadFacebookUserApi.Result> {
        return this.getUserInfo({
            clientToken: params.token,
        })
            .then(({ id, name, email }) => ({
                facebookId: id,
                name: name,
                email: email,
            }))
            .catch(() => undefined);
    }

    private async getAppToken() {
        return await this.httpClient.get<AppToken>({
            url: `${this.baseUrl}/oauth/access_token`,
            params: {
                client_id: this.clientId,
                client_secret: this.clientSecret,
                grant_type: "client_credentials",
            },
        });
    }

    private async getDebugToken(params: { clientToken: string }) {
        const appToken = await this.getAppToken();

        return await this.httpClient.get<DebugToken>({
            url: `${this.baseUrl}/debug_token`,
            params: {
                access_token: appToken.access_token,
                input_token: params.clientToken,
            },
        });
    }

    private async getUserInfo(params: { clientToken: string }) {
        const debugToken = await this.getDebugToken({
            clientToken: params.clientToken,
        });
        return await this.httpClient.get<UserInfo>({
            url: `${this.baseUrl}/${debugToken.data.user_id}`,
            params: {
                fields: ["id", "name", "email"].join(","),
                access_token: params.clientToken,
            },
        });
    }
}
