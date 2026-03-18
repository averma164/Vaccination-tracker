import express from 'express';
import { authMiddleware, authorizeRole } from '../middlewares/authMiddleware.js';
import { allBaby } from '../controller/userController.js';
import upload from '../middlewares/upload.js';
import User from '../models/user.js';
import cloudinary from '../config/cloudinary.js';

const userRouter = express.Router();


userRouter.get(
    '/all-baby',
    authMiddleware,
    authorizeRole('user', 'admin'),
    allBaby
);


userRouter.post(
    '/upload',
    authMiddleware,
    authorizeRole('user', 'admin'),
    upload.single("document"),
    async (req, res) => {
        try {
            const userId = req.user.id;

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const file = req.file;

            if (!file) {
                return res.status(400).json({ message: "No file uploaded" });
            }

            const newDoc = {
                url: file.path,
                public_id: file.filename,
                name: req.body.name || "Document"
            };

            user.documents.push(newDoc);
            await user.save();

            res.status(200).json({
                message: "Document uploaded successfully",
                document: newDoc
            });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);


userRouter.get(
    '/documents',
    authMiddleware,
    async (req, res) => {
        try {
            const user = await User.findById(req.user.id);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            res.status(200).json(user.documents);

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);


userRouter.delete(
    '/document/:docId',
    authMiddleware,
    async (req, res) => {
        try {
            const user = await User.findById(req.user.id);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const doc = user.documents.id(req.params.docId);

            if (!doc) {
                return res.status(404).json({ message: "Document not found" });
            }

            await cloudinary.uploader.destroy(doc.public_id);

            doc.deleteOne();
            await user.save();

            res.status(200).json({
                message: "Document deleted successfully"
            });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);


export default userRouter;