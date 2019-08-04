export class RequestResult {
  status: number;
  msg: string;
  data: any;

  constructor(status: number, msg: string, data: any) {
    this.status = status;
    this.msg = msg;
    this.data = data;
  }

  RequestResult(status: number, msg: string, data: any) {
    this.status = status;
    this.msg = msg;
    this.data = data;
  }
}