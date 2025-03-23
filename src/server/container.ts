import { SessionService } from "./services/session.service";

import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { Container } from "typedi";
import { auth } from "./auth";
import { CommunityService } from "./services/community.service";
import { RadioService } from "./services/radio.service";
import { ContentService } from "./services/content.service";
import { ShopService } from "./services/shop.service";
import { TalentService } from "./services/talent.service";
import { UserService } from "./services/user.service";

export const createContainer = async (opts?: FetchCreateContextFnOptions) => {
    const requestId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    const container = Container.of(requestId.toString());
    const context = { requestId, container };

    const session = await auth()
    container.set('SessionService', SessionService);
    const sessionService = container.get(SessionService);

    if (session) {
        sessionService.update = session;
    }

    container.set('CommunityService', CommunityService);
    container.set('Contentservice', ContentService);
    container.set('RadioService', RadioService);
    container.set('ShopService', ShopService);
    container.set('TalentService', TalentService);
    container.set('UserService', UserService);


    const communityService = container.get(CommunityService);
    const contentService = container.get(ContentService);
    const radioService = container.get(RadioService);
    const shopService = container.get(ShopService);
    const talentService = container.get(TalentService);
    const userService = container.get(UserService);

    const services = {
        sessionService,
        communityService,
        contentService,
        radioService,
        shopService,
        talentService,
        userService,
    }

    return {
        ...context,
        ...services,
    }
}
