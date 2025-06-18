import Router from 'express';
import authMiddleware from '../../middleware/authMiddleware';
import { approveApplication, getAllApplications, getAllUsers } from '../../controller/adminController';
import roleMiddleware from '../../middleware/roleMiddleware';


const router = Router();

router.get('/admin',authMiddleware,getAllApplications);
router.put('/admin/approve/:id',authMiddleware,roleMiddleware("ADMIN"),approveApplication);
router.get('/admin/users', authMiddleware, roleMiddleware("ADMIN"), getAllUsers);




export default router;