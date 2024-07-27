const Express = require('express');


const userAuth = require('../middleware/userAuth');
const companyController = require('../controllers/companyController');


const router = Express.Router();



router.get('/get-companies',userAuth,companyController.getAllCompanies);


router.delete('/delete',userAuth,companyController.deleteCompany);


router.post('/add-company',userAuth,companyController.postSaveCompany);







module.exports = router;