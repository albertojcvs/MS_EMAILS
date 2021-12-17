export interface IMessage{}

export interface IMailProvider{
    send(message:IMessage): Promise<void>
}