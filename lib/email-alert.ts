import got from 'got';

function composeMessage(
    toEmail: string,
    subject: string,
    text: string,
    html?: string,
) {
    return {
        Messages: [
            {
                From: {
                    Email: 'devops@expan.do',
                    Name: 'Expando Devops',
                },
                To: [{ Email: toEmail }],
                Subject: subject,
                TextPart: text,
                ...(html ? { HTMLPart: html } : null),
            },
        ],
    };
}

async function sendPlainTextEmail(
    toEmail: string,
    subject: string,
    text: string,
    html?: string,
) {
    return got.post('https://api.mailjet.com/v3.1/send', {
        auth:
            process.env.MAILJET_PUBLIC_KEY +
            ':' +
            process.env.MAILJET_PRIVATE_SECRET,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(composeMessage(toEmail, subject, text, html)),
        retry: { retries: 3 },
    });
}

export async function alertDevops(subject: string, text: string) {
    try {
        return sendPlainTextEmail('devops@expan.do', subject, text);
    } catch (e) {
        console.log("COULDN'T ALERT DEVOPS VIA EMAIL!");
    }
}
