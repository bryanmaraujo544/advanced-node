import { UUIDGenerator } from "@/domain/contracts/gateways/uuid";

export class UniqueId implements UUIDGenerator {
    constructor(private readonly date: Date) {}
    uuid({ key }: UUIDGenerator.Input): string {
        function fillZero(value: number): string {
            return value.toString().padStart(2, "0");
        }
        return `${key}_${this.date.getFullYear()}${fillZero(
            this.date.getMonth() + 1
        )}${fillZero(
            this.date.getDate()
        )}${this.date.getHours()}${this.date.getMinutes()}`;
    }
}
