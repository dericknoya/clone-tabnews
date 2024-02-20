import { Client } from "pg";

async function query(queryObject) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
    // se trabalhando com banco local ssl não é suportado portante usar "false" ou simplesmente não declarar o parâmetro "ssl" ou use condição ternária verificando a condição da variável NODE_ENV
    // NODE_ENV: variável de ambiente do node que pode ter os valores development ou production a dependenr do ambiente em que a aplicação esteja rodando.
  });
  console.log('Credenciais do Postgres:', {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
  })
  
  try {
    await client.connect();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error(error)
    throw error;
  } finally {
    await client.end();
  }
}

export default {
  query: query,
};

function getSSLValues() {
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA,
    }
  }
  return process.env.NODE_ENV === "development" ? false : true
}
