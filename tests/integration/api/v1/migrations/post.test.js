import orchestrator from "tests/orchestrator.js";
import webserver from "infra/webserver";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    describe("Running pending migrations", () => {
      test("For first time", async () => {
        const createdUser = await orchestrator.createUser();
        const activatedUser = await orchestrator.activateUser(createdUser);
        const sessionObject = await orchestrator.createSession(activatedUser);

        const response1 = await fetch(`${webserver.origin}/api/v1/migrations`, {
          method: "POST",
          headers: {
            Cookie: `session_id=${sessionObject.token}`,
          },
        });

        expect(response1.status).toBe(403);

        const responseBody1 = await response1.json();

        expect(responseBody1).toEqual({
          name: "ForbiddenError",
          action:
            "Verifique se o seu usuário possui a feature create:migration",
          message: "Você não tem permissão para realizar esta ação",
          status_code: 403,
        });
      });
    });
  });

  describe("Default user", () => {
    describe("Running pending migrations", () => {
      test("For first time", async () => {
        const createdUser = await orchestrator.createUser();
        const activatedUser = await orchestrator.activateUser(createdUser);
        const sessionObject = await orchestrator.createSession(activatedUser);

        const response1 = await fetch(`${webserver.origin}/api/v1/migrations`, {
          method: "POST",
          headers: {
            Cookie: `session_id=${sessionObject.token}`,
          },
        });
        expect(response1.status).toBe(403);

        const responseBody1 = await response1.json();

        expect(responseBody1).toEqual({
          name: "ForbiddenError",
          action:
            "Verifique se o seu usuário possui a feature create:migration",
          message: "Você não tem permissão para realizar esta ação",
          status_code: 403,
        });
      });
    });
  });

  describe("Privileged user", () => {
    describe("Running pending migrations", () => {
      test("For first time with create:migration", async () => {
        const createdUser = await orchestrator.createUser();
        const activatedUser = await orchestrator.activateUser(createdUser);
        await orchestrator.addFeaturesToUser(createdUser, ["create:migration"]);
        const sessionObject = await orchestrator.createSession(activatedUser);
        const response1 = await fetch(`${webserver.origin}/api/v1/migrations`, {
          method: "POST",
          headers: {
            Cookie: `session_id=${sessionObject.token}`,
          },
        });
        expect(response1.status).toBe(200);

        const responseBody1 = await response1.json();

        expect(Array.isArray(responseBody1)).toBe(true);
      });
    });
  });
});
