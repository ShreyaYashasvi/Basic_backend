import { Router } from "express";
import { registerUser } from "../controllers/users.controllers.js";
import { upload} from "src\middlewares\multer.middleware.js"

const router = Router();

router.route("/register").post(
    upload.fields([
        {name:"avataar",maxCount:1},
        {name:"coverimage",maxCount:1}
    ]),
    
    registerUser);
export default router;