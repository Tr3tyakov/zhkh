import { inject, injectable } from 'tsyringe';
import { DefaultAPI } from '../baseAPI.ts';
import { CookieServiceKey } from '../../cookie/key.ts';
import type { ICookieService } from '../../cookie/cookieService.interfaces.ts';
import { IReferenceBookAPI } from './referenceBookAPI.interfaces.ts';

@injectable()
export class ReferenceBookAPI extends DefaultAPI implements IReferenceBookAPI {
    constructor(@inject(CookieServiceKey) cookieService: ICookieService) {
        super(cookieService);
    }

    async getReferenceBooks() {
        const response = await this.API.get('/reference_books', {
            headers: { Authorization: this.bearer },
        });

        return response.data;
    }

    async deleteBookValue(id: number) {
        const response = await this.API.delete(`/reference_book_values/${id}`, {
            headers: { Authorization: this.bearer },
        });

        return response.data;
    }

    async createBookValue(bookId: number, bookValue: string) {
        const response = await this.API.post(
            `/reference_books/${bookId}/value/${bookValue}`,
            {},
            {
                headers: { Authorization: this.bearer },
            }
        );

        return response.data;
    }

    async updateBookValue(bookValueId: number, bookValue: string) {
        const response = await this.API.put(
            `/reference_books/${bookValueId}/value/${bookValue}`,
            {},
            {
                headers: { Authorization: this.bearer },
            }
        );

        return response.data;
    }
}
