import express from 'express';
import submissionController from '../controllers/submission';
import courseController from '../controllers/course';
const router = express.Router();


/* Submissions */
router.get("/submissions", submissionController.getSubmissions)
router.get("/course", courseController.getCourses)

export = router;