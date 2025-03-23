import { Service } from "typedi"
import axios from "axios"
@Service()
export class RadioService {
    private readonly STREAM_URL = "https://stream.zeno.fm/xs6zeac1ts8uv"

    async getNowPlaying() {
        const response = await axios.get(this.STREAM_URL, {
            headers: {
                "Icy-MetaData": "1",
            },
        })
    }
}

