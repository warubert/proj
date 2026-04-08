import { createRouter } from "next-connect";
import activation from "models/activation.js";
import controller from "infra/controller";
import authorization from "models/authorization";

const router = createRouter();

router.use(controller.injectAnonymousOrUser);
router.patch(controller.canRequest("read:activation_token"), patchHandler);

export default router.handler(controller.errorHandlers);

async function patchHandler(req, res) {
  const userTryingToPatch = req.context.user;
  const activationTokenId = req.query.token_id;

  const validActivationToken =
    await activation.findOneValidById(activationTokenId);

  await activation.activateUserByUserId(validActivationToken.user_id);

  const usedActivationToken =
    await activation.markTokenAsUsed(activationTokenId);

  const secureOutputValues = authorization.filterOutput(
    userTryingToPatch,
    "read:activation_token",
    usedActivationToken,
  );

  return res.status(200).json(secureOutputValues);
}
