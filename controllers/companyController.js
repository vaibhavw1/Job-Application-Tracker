const Company = require('../models/company');
const Application = require('../models/application');
const Profile = require('../models/profile');
const CompanyProfile = require('../models/companyProfile');
const sequelize = require('../util/database');

exports.postSaveCompany = async (req, res, next) => {
    
    const t = await sequelize.transaction();
    try {
        
        const { name, email, phone, companySize, industry, notes , profileId } = req.body;
        

     
        const [created,isCreated] = await Company.upsert({
            name: name,
            email: email,
            phone: phone,
            companySize: companySize,
            industry: industry,
            notes: notes,
            
        } ,{
            transaction: t,
            returning: true
        });
        const profile = await Profile.findByPk(profileId , { transaction: t});
        
        await created.addProfile(profile , {transaction: t});
        await t.commit();
        
        if(isCreated){

            res.status(200).json({ message: "Company added ", created: created, success: true });
        }else{
            res.status(200).json({ message: "Company updated ", created: created, success: true });
        }
    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).json({ message: 'Something went wrong', success: false });
    }

}



exports.getAllCompanies = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {

        
        const profileId = req.query.profile;

        const profile = await Profile.findByPk(profileId , {transaction: t});

        const companies = await profile.getCompanies({transaction: t});

        await t.commit();

        res.status(200).json({ companies: companies, success: true });
    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).json({ message: 'Something went wrong', success: false });
    }
}


exports.deleteCompany = async (req,res,next)=>{
    const t = await sequelize.transaction();
    try {

        const profileId = req.query.profile;
        const name = req.query.name;

        const profile = await Profile.findByPk(profileId ,{transaction: t});

        const companies = await profile.getCompanies({transaction: t});

        companies.forEach( async (company) => {
            if(company.name === name){
                await company.destroy();
            }
        });

        t.commit();

        res.status(200).json({ message: 'deleted succesfully', success: true });
    } catch (error) {
        t.rollback();
        console.error(error);
        res.status(500).json({ message: 'Something went wrong', success: false });
    }
}