const express = require("express");
const router = express.Router();
const requestController = require("../controllers/requestController");

// Create borrow request
router.post("/create", requestController.createRequest);

// Get all requests
router.get("/", requestController.getRequests);

// Approve request
router.put("/approve/:id", requestController.approveRequest);

// Deny request
router.put("/deny/:id", requestController.denyRequest);

module.exports = router;
