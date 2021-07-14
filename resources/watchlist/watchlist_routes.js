import { Router } from "express";
import {add_watchlist, remove_watchlist} from "./watchlist_controller";
const router = Router();

router.post("/add_watchlist/:vid/:userid", add_watchlist);
router.delete("/remove_watchlist/:vid", remove_watchlist);





export default router;
