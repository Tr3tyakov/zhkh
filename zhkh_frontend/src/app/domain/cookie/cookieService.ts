import Cookies from 'js-cookie';
import {
    ACCESS_TOKEN,
    REFRESH_TOKEN,
} from '../../infrastructures/providers/userProvider/useUser.constants.ts';
import { ICookieService } from './cookieService.interfaces.ts';
import { injectable } from 'tsyringe';

@injectable()
export class CookieService implements ICookieService {
    getToken(tokenName: string): string | null {
        const token = Cookies.get(tokenName);
        if (!token) {
            return null;
        }
        return token;
    }

    deleteTokens() {
        const tokenNames = [ACCESS_TOKEN, REFRESH_TOKEN];
        for (const token of tokenNames) {
            Cookies.remove(token);
        }
    }
}
