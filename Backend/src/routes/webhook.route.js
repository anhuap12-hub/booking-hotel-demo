import express from "express";
import { sepayWebhook } from "../controllers/webhook.controller.js";

const router = express.Router();

/**
 * @route   POST /api/webhooks/sepay-webhook
 * @desc    Nhận thông báo thanh toán tự động từ SePay
 * @access  Public (Không yêu cầu JWT/Token)
 */
router.post("/sepay-webhook", sepayWebhook);

export default router;