import FAQ from "../models/FAQ.Model.js";

const createFAQ = async (req, res) => {
    try {
        const { question, answer } = req.body;
        const faq = new FAQ({ question, answer });
        await faq.save();
        res.status(200).json({ message: "FAQ created successfully", faq, status: 200, success: true });
    } catch (error) {
        console.error("Error creating FAQ:", error);
        res.status(500).json({ message: "Internal server error", status: 500, success: false, error: error.message });
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

const deleteFAQ = async (req, res) => {
    try {
        const faqId = req.params.faqId;
        const deletedFAQ = await FAQ.findByIdAndDelete(faqId);
        if (!deletedFAQ) {
            return res.status(404).json({ message: "FAQ not found", success: false, status: 404 });
        }
        res.status(200).json({ message: "FAQ deleted successfully", success: true, status: 200 });
    } catch (error) {
        console.error("Error deleting FAQ:", error);
        res.status(500).json({ error: "Internal server error", success: false, status: 500 });
    }
};

const updateFAQ = async (req, res) => {
    try {
        const faqId = req.params.faqId;
        const { question, answer } = req.body;
        const updatedFAQ = await FAQ.findByIdAndUpdate(faqId, { question, answer }, { new: true });
        if (!updatedFAQ) {
            return res.status(404).json({ message: "FAQ not found", success: false, status: 404 });
        }
        res.status(200).json({ message: "FAQ updated successfully", faq: updatedFAQ, success: true, status: 200 });
    } catch (error) {
        console.error("Error updating FAQ:", error);
        res.status(500).json({ error: "Internal server error", success: false, status: 500 });
    }
};
export { createFAQ, getAllFAQ, deleteFAQ, updateFAQ };