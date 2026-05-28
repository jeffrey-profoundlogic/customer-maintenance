import mapepire from '@ibm/mapepire-js';
const { Pool } = mapepire;

type PoolType = InstanceType<typeof Pool>;

let pool: PoolType | null = null;
let poolInitialized = false;

export interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  port: number;
  library: string;
}

function getConfig(): DatabaseConfig {
  const host = process.env.IBMI_HOST;
  const user = process.env.IBMI_USER;
  const password = process.env.IBMI_PASSWORD;
  const port = parseInt(process.env.IBMI_PORT || '8076', 10);
  const library = process.env.IBMI_LIBRARY || 'MYLIB';

  if (!host || !user || !password) {
    throw new Error(
      'Missing required environment variables: IBMI_HOST, IBMI_USER, IBMI_PASSWORD'
    );
  }

  return { host, user, password, port, library };
}

export async function getPool(): Promise<PoolType> {
  if (pool && poolInitialized) {
    return pool;
  }

  const config = getConfig();

  pool = new Pool({
    creds: {
      host: config.host,
      user: config.user,
      password: config.password,
      port: config.port,
      rejectUnauthorized: false,
    },
    maxSize: 10,
    startingSize: 2,
  });

  await pool.init();
  poolInitialized = true;
  console.log('Database connection pool initialized');
  return pool;
}

export function getLibrary(): string {
  return process.env.IBMI_LIBRARY || 'MYLIB';
}

export async function closePool(): Promise<void> {
  if (pool) {
    pool.end();
    pool = null;
    poolInitialized = false;
    console.log('Database connection pool closed');
  }
}
