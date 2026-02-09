import { InternalServerError } from "infra/errors.js";
import authorization from "models/authorization.js";

describe("models/authorization.js", () => {
  describe("can", () => {
    test("without user", () => {
      expect(() => {
        authorization.can();
      }).toThrow(InternalServerError);
    });

    test("without user features", () => {
      const createdUser = {
        username: "John Doe",
      };

      expect(() => {
        authorization.can(createdUser);
      }).toThrow(InternalServerError);
    });

    test("without unknown features", () => {
      const createdUser = {
        features: [],
      };

      expect(() => {
        authorization.can(createdUser, "unknown:feature");
      }).toThrow(InternalServerError);
    });

    test("with valid user and known feature", () => {
      const createdUser = {
        features: ["create:user"],
      };

      expect(authorization.can(createdUser, "create:user")).toBe(true);
    });
  });

  describe("filterOutput", () => {
    test("without user", () => {
      expect(() => {
        authorization.filterOutput();
      }).toThrow(InternalServerError);
    });

    test("without user features", () => {
      const createdUser = {
        username: "John Doe",
      };

      expect(() => {
        authorization.filterOutput(createdUser);
      }).toThrow(InternalServerError);
    });

    test("without unknown features", () => {
      const createdUser = {
        features: [],
      };

      expect(() => {
        authorization.filterOutput(createdUser, "unknown:feature");
      }).toThrow(InternalServerError);
    });

    test("with valid user, known feature and resource", () => {
      const createdUser = {
        features: ["read:user"],
      };

      const resource = {
        id: 1,
        username: "John Doe",
        features: ["read:user"],
        created_at: "2026-01-01T00:00:00.000Z",
        updated_at: "2026-01-01T00:00:00.000Z",
        email: "email1@war.com",
        password: "password1",
      };

      const result = authorization.filterOutput(
        createdUser,
        "read:user",
        resource,
      );

      expect(result).toEqual({
        id: 1,
        username: "John Doe",
        features: ["read:user"],
        created_at: "2026-01-01T00:00:00.000Z",
        updated_at: "2026-01-01T00:00:00.000Z",
      });
    });

    test("with valid user, known feature but no resource", () => {
      const createdUser = {
        features: ["read:user"],
      };

      expect(() => {
        authorization.filterOutput(createdUser, "read:user");
      }).toThrow(InternalServerError);
    });
  });
});
