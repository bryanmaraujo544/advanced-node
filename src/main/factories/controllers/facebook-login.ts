import { FacebookLoginController } from "@/application/controlllers";
import { makeFaceboookAuthenticationService } from "../services";

export const makeFaceboookLoginController = (): FacebookLoginController => {
    const fbAuthService = makeFaceboookAuthenticationService();
    return new FacebookLoginController(fbAuthService);
};
