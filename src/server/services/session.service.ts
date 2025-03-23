import type { Session } from "next-auth";
import { getServerSession } from "next-auth"

import { Service } from "typedi";
import { NextApiRequest } from "next";

@Service()
export class SessionService {
    constructor(private session: Session) {
        this.session = session ?? {
            user: {
                name: null,
                email: null,
                image: null
            },
            expires: null
        }
    }

    current = async () => {
        return this.session
    }

    set update(session: Session) {
        this.session = session;
    }
}