import express from 'express';
import {testApi} from '../controllers/test.controller.js'

const router = express.Router();

router.get("/", testApi);

export default router;