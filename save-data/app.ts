import { SQSEvent, Context } from 'aws-lambda';

export async function lambdaHandler(event: SQSEvent, _context?: Context): Promise<void> {
    console.log(JSON.parse(event.Records[0].body));
}
