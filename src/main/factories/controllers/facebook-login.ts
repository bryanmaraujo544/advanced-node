import { FacebookLoginController } from "@/application/controlllers";
import { makeFaceboookAuthentication } from "../use-cases";

export const makeFaceboookLoginController = (): FacebookLoginController => {
    const fbAuthService = makeFaceboookAuthentication();
    return new FacebookLoginController(fbAuthService);
};
