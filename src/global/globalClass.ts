export class ResponseData<D> {
    data: D | D[];
    message: string;
    statusCode: number;
    constructor(data: D | D[], statusCode: number, message: string) {
        this.data = data;
        this.statusCode = statusCode;
        this.message = message;
    }
}
