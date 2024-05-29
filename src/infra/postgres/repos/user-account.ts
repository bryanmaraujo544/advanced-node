import {
    LoadUserAccountRepository,
    SaveFacebookAccountRepository,
} from "@/data/contracts/repos";
import { getRepository } from "typeorm";
import { PgUser } from "../entities";

export class PgUserAccountRepository implements LoadUserAccountRepository {
    async load(
        params: LoadUserAccountRepository.Params
    ): Promise<LoadUserAccountRepository.Result> {
        const pgUserRepo = getRepository(PgUser);
        const pgUser = await pgUserRepo.findOne({ email: params.email });

        if (!pgUser) {
            return;
        }

        return {
            id: pgUser?.id.toString(),
            name: pgUser?.name ?? undefined,
        };
    }

    async saveWithFacebook(
        params: SaveFacebookAccountRepository.Params
    ): Promise<void> {
        const pgUserRepo = getRepository(PgUser);

        if (!params.id) {
            await pgUserRepo.save({
                email: params.email,
                name: params.name,
                facebookId: params.facebookId,
            });
        } else {
            await pgUserRepo.update(
                { id: Number(params.id) },
                {
                    name: params.name,
                    facebookId: params.facebookId,
                }
            );
        }
    }
}
