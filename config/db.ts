import knex from "knex";

const dbConfig = {
	client: "pg",
	connection: {
		user: "postgres",
		password: "123",
		host: "localhost",
		port: "5432",
		database: "esoftProject",
	},
	pool: {
		min: 2,
		max: 50,
		idleTimeoutMillis: 10000,
	}
};

export const knexPool = knex({
	client: dbConfig.client,
	connection: {
		...dbConfig.connection
	},
	pool: {
		min: dbConfig.pool.min,
		max: dbConfig.pool.max,
		idleTimeoutMillis: dbConfig.pool.idleTimeoutMillis
	}
});

export default knexPool;