import { LoadUserAccount, SaveFacebookAccount } from "@/domain/contracts/repos";
import { getRepository } from "typeorm";
import { PgUser } from "./entities";

type LoadParams = LoadUserAccount.Params;
type LoadResult = LoadUserAccount.Result;
type SaveParams = SaveFacebookAccount.Params;
type SaveResult = SaveFacebookAccount.Result;

export class PgUserAccountRepository
    implements LoadUserAccount, SaveFacebookAccount
{
    async load(params: LoadParams): Promise<LoadResult> {
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

    async saveWithFacebook(params: SaveParams): Promise<SaveResult> {
        const pgUserRepo = getRepository(PgUser);

        let id: string;
        if (!params.id) {
            const pgUser = await pgUserRepo.save({
                email: params.email,
                name: params.name,
                facebookId: params.facebookId,
            });
            id = pgUser.id.toString();
        } else {
            id = params.id;

            await pgUserRepo.update(
                { id: Number(params.id) },
                {
                    name: params.name,
                    facebookId: params.facebookId,
                }
            );
        }

        return {
            id,
        };
    }
}
