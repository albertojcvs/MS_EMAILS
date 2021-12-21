import { IMailProvider } from "../../providers/IMailProvider";

export abstract class KafkaHandle{
    constructor(protected mailProvider:IMailProvider){}
  abstract handle(message: any): Promise<void>;
}
