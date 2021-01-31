export interface IAPIGatewayParams {
    version: string;
    routeKey: string;
    rawPath: string;
    rawQueryString: string;
    cookies?: string[];
    headers: { [name: string]: string | undefined };
    queryStringParameters?: { [name: string]: string | undefined };
    requestContext: {
        accountId: string;
        apiId: string;
        authorizer?: {
            jwt: {
                claims: { [name: string]: string | number | boolean | string[] };
                scopes: string[];
            };
        };
        domainName: string;
        domainPrefix: string;
        http: {
            method: string;
            path: string;
            protocol: string;
            sourceIp: string;
            userAgent: string;
        };
        requestId: string;
        routeKey: string;
        stage: string;
        time: string;
        timeEpoch: number;
    };
    body?: string;
    pathParameters?: { [name: string]: string | undefined };
    isBase64Encoded: boolean;
    stageVariables?: { [name: string]: string | undefined };
}
