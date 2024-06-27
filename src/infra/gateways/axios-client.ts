import { HttpGetClient } from "./client";
import axios from "axios";

export class AxiosHttpClient implements HttpGetClient {
    async get(input: HttpGetClient.Params): Promise<any> {
        const result = await axios.get(input.url, { params: input.params });
        return result.data;
    }
}
