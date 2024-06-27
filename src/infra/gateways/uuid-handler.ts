import { UUIDGenerator } from "@/domain/contracts/gateways/uuid";
import { v4 } from "uuid";

export class UUIDHandler implements UUIDGenerator {
    uuid({ key }: UUIDGenerator.Input): string {
        return `${key}_${v4()}`;
    }
}
