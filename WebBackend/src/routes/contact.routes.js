import { handleContactForm, handleSubscription } from "../controllers/contact.controller.js";

const router = express.Router();

router.post("/send", handleContactForm);
router.post("/subscribe", handleSubscription);

export default router;
