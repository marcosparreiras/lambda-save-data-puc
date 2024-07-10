import { expect, describe, it } from '@jest/globals';
import { lambdaHandler } from '../../app';
import type { SQSEvent } from 'aws-lambda';

describe('Unit test for app handler', function () {
    it('verifies successful response', async () => {
        const event: SQSEvent = {
            Records: [
                {
                    messageId: '059f36b4-87a3-44ab-83d2-661975830a7d',
                    receiptHandle: 'AQEBwJnKyrHigUMZj6rYigCgxlaS3SLy0a...',
                    body: '{"supermarket": "COMERCIAL DAHANA LIMITADA SN 422","cnpj": "00.070.509/0030-45","address": "R GRAO MOGOL, 202, CARMO, 3106200 - BELO HORIZONTE, MG","date": "2024-06-07T12:26:37.000Z","items": [{"code": "154923","name": "LEITE LVIDA PORTO ALEGRE 1L INTEG","price": 105.8,"qty": 20,"unit": "UN"},{"code": "93567","name": "CAFE PO FINO-GRAO 500G PC TRAD","price": 33.98,"qty": 2,"unit": "UN"}]}',
                    attributes: {
                        ApproximateReceiveCount: '1',
                        SentTimestamp: '1545082649183',
                        SenderId: 'AIDAIENQZJOLO23YVJ4VO',
                        ApproximateFirstReceiveTimestamp: '1545082649185',
                    },
                    messageAttributes: {},
                    md5OfBody: '098f6bcd4621d373cade4e832627b4f6',
                    eventSource: 'aws:sqs',
                    eventSourceARN: 'arn:aws:sqs:us-east-1:111122223333:my-queue',
                    awsRegion: 'us-east-1',
                },
            ],
        };
        await lambdaHandler(event);

        expect(1).toEqual(1);
    });
});
