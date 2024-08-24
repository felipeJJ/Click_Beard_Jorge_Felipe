const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,  // Use isso se o certificado SSL não for confiável, caso contrário, omita esta opção
    },
});

client.connect()
    .then(() => console.log('Connected successfully'))
    .catch((err: { stack: any; }) => console.error('Connection error', err.stack))
    .finally(() => client.end());
