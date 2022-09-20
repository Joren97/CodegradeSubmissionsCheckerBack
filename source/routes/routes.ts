import express from 'express';
import submissionController from '../controllers/submission';
import courseController from '../controllers/course';
const router = express.Router();


/* Submissions */
router.get("/course/:courseId", courseController.getCourseWithAssignments)
router.get("/submission/:assignmentId", submissionController.getGradeForAssignment)

export = router;