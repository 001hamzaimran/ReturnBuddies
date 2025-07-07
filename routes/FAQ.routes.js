import { Router } from "express";
import { createFAQ, getAllFAQ } from "../controllers/FAQ.Controller.js";

const faqRouter = Router();

faqRouter.post('/add-faq', createFAQ);
faqRouter.get('/get-all-faq', getAllFAQ);

export default faqRouter