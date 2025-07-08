import FAQ from "../models/FAQ.Model.js";

const createFAQ = async (req, res) => {
    try {
        const { question, answer } = req.body;
        const faq = new FAQ({ question, answer });
        await faq.save();
        res.status(200).json({ message: "FAQ created successfully", faq, status: 200 });
    } catch (error) {
        console.error("Error creating FAQ:", error);
        res.status(500).json({ message: "Internal server error", status: 500 });
    }
}


const getAllFAQ = async (req, res) => {
    try {
        const faqs = await FAQ.find();
        res.status(200).json({ data: faqs, success: true, status: 200 });
    } catch (error) {
        console.error("Error fetching FAQs:", error);
        res.status(500).json({ error: "Internal server error", success: false, status: 500 });
    }
};


export { createFAQ, getAllFAQ };