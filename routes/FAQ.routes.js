import { Router } from "express";
import { createFAQ, deleteFAQ, getAllFAQ, updateFAQ } from "../controllers/FAQ.Controller.js";

const faqRouter = Router();

faqRouter.post('/add-faq', createFAQ);
faqRouter.get('/get-all-faq', getAllFAQ);
faqRouter.delete('/delete-faq/:faqId', deleteFAQ);
faqRouter.put('/edit-faq/:faqId', updateFAQ);
export default faqRouter