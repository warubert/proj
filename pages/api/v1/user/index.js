import { createRouter } from "next-connect";
import controller from "infra/controller";
import user from "models/user";
import session from "models/session";
import authorization from "models/authorization";

const router = createRouter();

router.use(controller.injectAnonymousOrUser);
router.get(controller.canRequest("read:session"), getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const userTryingToGet = request.context.user;
  const sessionToken = request.cookies.session_id;

  const sessionObject = await session.findOneValidByToken(sessionToken);
  await session.renew(sessionObject.id);
  controller.setSessionCookie(sessionObject.token, response);
  response.setHeader("Cache-Control", "no-store, max-age=0, must-revalidate");

  const userFound = await user.findOneById(sessionObject.user_id);

  const secureOutputValues = authorization.filterOutput(
    userTryingToGet,
    "read:user:self",
    userFound,
  );
  return response.status(200).json(secureOutputValues);
}
