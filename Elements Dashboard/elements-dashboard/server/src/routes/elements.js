import express from "express";
import Element from "../models/Element.js";

const router = express.Router();

/**
 * @route   GET /api/elements
 * @desc    Получить список всех элементов
 */
router.get("/", async (req, res) => {
  try {
    const elements = await Element.find();
    res.json(elements);
  } catch (err) {
    console.error("Ошибка при получении элементов:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

/**
 * @route   GET /api/elements/:id
 * @desc    Получить один элемент по ID
 */
router.get("/:id", async (req, res) => {
  try {
    const element = await Element.findById(req.params.id);
    if (!element) {
      return res.status(404).json({ error: "Элемент не найден" });
    }
    res.json(element);
  } catch (err) {
    console.error("Ошибка при получении элемента:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

export default router;
