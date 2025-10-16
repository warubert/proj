import email from "infra/email.js";
import database from "infra/database";
import webserver from "infra/webserver.js";

const EXPIRATION_IN_MILLISECONDS = 60 * 15 * 1000; // 15 minutos

async function findOneByUserId(userId) {
  const token = await runSelectQuery(userId);
  return token;

  async function runSelectQuery(userId) {
    const results = await database.query({
      text: `
        SELECT
          *
        FROM
          user_activation_tokens
        WHERE
          user_id = $1
        LIMIT
          1
      ;`,
      values: [userId],
    });
    return results.rows[0];
  }
}
async function create(userId) {
  const expiresAt = new Date(Date.now() + EXPIRATION_IN_MILLISECONDS);

  const newToken = await runInsert(userId, expiresAt);
  return newToken;

  async function runInsert(userId, expiresAt) {
    const results = await database.query({
      text: `
        INSERT INTO
          user_activation_tokens (user_id, expires_at)
        VALUES
          ($1, $2)
        RETURNING
          *
      ;`,
      values: [userId, expiresAt],
    });

    return results.rows[0];
  }
}
async function sendEmailToUser(user, activationToken) {
  await email.send({
    from: "War <contato@war.com>",
    to: user.email,
    subject: "Confirmação de cadastro",
    text: `${user.username}, clique no link abaixo para ativar seu cadastro

${webserver.origin}/cadastro/ativar/${activationToken.id}

Atenciosamente,
Equipe War`,
  });
}

const activation = {
  sendEmailToUser,
  create,
  findOneByUserId,
};

export default activation;
