import { FacebookLoginController } from "@/application/controlllers";
import { makeFaceboookAuthenticationUseCase } from "../use-cases";

export const makeFaceboookLoginController = (): FacebookLoginController => {
    const fbAuthService = makeFaceboookAuthenticationUseCase();
    return new FacebookLoginController(fbAuthService);
};
