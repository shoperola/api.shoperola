import { Router } from "express";
import {
  add_watchlist,
  remove_watchlist,
  viewWatchlist,
} from "./watchlist_controller";
const router = Router();

router.post("/add_watchlist/:vid/", add_watchlist);
router.delete("/remove_watchlist/:vid", remove_watchlist);
router.get("/viewWatchlist", viewWatchlist);

export default router;
