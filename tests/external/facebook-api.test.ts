import { FacebookApi } from "@/infra/apis";
import { AxiosHttpClient } from "@/infra/http";
import { env } from "@/main/config/env";
describe("Facebook Api Integration Tests", () => {
    it("should return a Facebook User if token is valid", async () => {
        const axiosClient = new AxiosHttpClient();
        const sut = new FacebookApi(
            axiosClient,
            env.facebookApi.clientId,
            env.facebookApi.clientSecret
        );

        const fbUser = await sut.loadUser({
            token: "EAAGtB5Yj1ggBOz9wEc5ropa38ujqfc5jminBvy3XlGod9tDUkXZA7c65ScyajuMi8ps4E4r45EjS6Vsd2XvetgvxkZC8xWMf3JCBoNcakge4Ebrp56ctdGr5Phs9DjtxwoVJlT9iILcRg3GaSKgmL73KfQNTomYQgRrKi0djxQKEXMEtumZCIUakwc7rsZApU1npCkoJEZA19xKsa4XArCsLBrcSIRTlfjf8zsA3ZCNWLATZAAJjZCtZCDWGoT1US",
        });

        expect(fbUser).toEqual({
            facebookId: "122150586170221042",
            email: "bryanmaraujo544@gmail.com",
            name: "Bryan Martins",
        });
    });

    it("should return undefined if token is invalid", async () => {
        const axiosClient = new AxiosHttpClient();
        const sut = new FacebookApi(
            axiosClient,
            env.facebookApi.clientId,
            env.facebookApi.clientSecret
        );

        const fbUser = await sut.loadUser({
            token: "invalid_token",
        });

        expect(fbUser).toBeUndefined();
    });
});
