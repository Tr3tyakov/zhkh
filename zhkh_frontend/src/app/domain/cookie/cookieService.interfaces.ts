interface ICookieService {
    getToken(tokenName: string): string | null;
    deleteTokens(): void;
}

export type { ICookieService };
