import express from 'express';
import Javascript from '../controller/javascript.mjs';
const router = express.Router();

//Javascript content operations route
router.post('/push-content', Javascript.create);
router.delete('/delete-content/:id', Javascript.deleteData);
router.get('/get-content', Javascript.get);
router.get('/get-content/:id', Javascript.getById);
router.get('/get-content/by/title', Javascript.getByTitle);
router.put('/update-content/:id', Javascript.update);

//user routes

export default router;
