const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Gadget = require('../models/gadgets');
const { authMiddleware, authorize } = require('../middleware/auth');
const router = express.Router();

const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: "Forbidden: Admins only" });
    }
    next();
};

router.get('/', authMiddleware, async (req, res) => {
    try {
      const { status } = req.query;
      let whereClause = {};
  
      if (status) {
        whereClause.status = status;
      }
  
      const gadgets = await Gadget.findAll({ where: whereClause });
      const gadgetsWithProbability = gadgets.map(gadget => ({
        ...gadget.toJSON(),
        successProbability: `${Math.floor(Math.random() * 101)}%`
      }));
  
      res.json(gadgetsWithProbability);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
  

router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: "Gadget name is required" });
        }

        const codenames = ["The Nightingale", "The Kraken", "Phoenix", "Iron Patriot"];
        const randomCodename = codenames[Math.floor(Math.random() * codenames.length)];

        const newGadget = await Gadget.create({ id: uuidv4(), name: randomCodename, status: "Available" });
        res.status(201).json(newGadget);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.patch('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, status } = req.body;

        const gadget = await Gadget.findByPk(id);
        if (!gadget) {
            return res.status(404).json({ error: "Gadget not found!" });
        }

        gadget.name = name || gadget.name;
        gadget.status = status || gadget.status;
        await gadget.save();

        res.json(gadget);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const gadget = await Gadget.findByPk(id);
        if (!gadget) {
            return res.status(404).json({ error: "Gadget not found!" });
        }

        gadget.status = "Decommissioned";
        gadget.decommissionedAt = new Date();
        await gadget.save();

        res.json({ message: "Gadget decommissioned", gadget });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/:id/self-destruct', authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const gadget = await Gadget.findByPk(id);
      if (!gadget) {
        return res.status(404).json({ error: "Gadget not found!" });
      }
  
      const confirmationCode = Math.floor(Math.random() * 900000) + 100000;
      gadget.status = "Destroyed";
      await gadget.save();
  
      res.json({ message: `Self-destruct sequence initiated. Confirmation code: ${confirmationCode}` });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
module.exports = router;
