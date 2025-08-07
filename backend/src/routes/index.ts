'use strict';
import  {Router} from 'express';
const router = Router();


// import routes
import usersRoute from "./user.route";

// route use
router.use('/user',usersRoute);


export default router;
