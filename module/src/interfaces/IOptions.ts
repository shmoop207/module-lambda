export interface IOptions {
    region: string
    accessKeyId: string
    secretAccessKey: string
    defaultLambda: string
    id?: string
}


export interface ILambdaOptions<T extends { [index: string]: any }> {
    lambda?: string,
    params?: T
    timeout?: number
}
