import { Router } from "express";
import { getLanguagesList } from "./language.controllers.js";
const router = Router();

router.get("/", getLanguagesList);

export default router;
