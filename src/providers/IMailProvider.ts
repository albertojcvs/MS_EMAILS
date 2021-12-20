
export interface IMessage{
    from:string
    to:string
    subject:string
    body:string
}

export interface IMailProvider{
    send(message:IMessage): Promise<void>
}