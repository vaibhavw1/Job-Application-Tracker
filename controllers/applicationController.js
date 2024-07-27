const Application = require('../models/application');
const Profile = require('../models/profile');
const Company = require('../models/company');
const sequelize  = require('../util/database')
const fs = require('fs');
const AWS = require('aws-sdk');
const { where } = require('sequelize');

exports.addApplication = async (req, res, next) => {

    const t = await sequelize.transaction();

    try {

        const companyName = req.body.companyName;
        const date = req.body.date;
        const notes = req.body.notes;
        const status = req.body.status;

        const companies = await req.profile.getCompanies();

        const company = companies.find((company)=>{
            return company.name === companyName
        })

        const file = req.file;
        const fileContent = fs.readFileSync(file.path);


        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_S3_REGION
        });

        const bucketName = 'jobapplicationtracker';

        const params = {
            Bucket: bucketName,
            Key: `application/${file.filename}`,
            Body: fileContent
            // ContentType: 'text/html'
        };


        s3.upload(params, async (err, uploadData) => {
            if (err) {
                console.error("Error uploading data: ", err);
                return res.status(500).json({ error: err, success: false, message: 'Something went wrong' });
            }


            const [created, isCreated] = await Application.upsert({
                companyName: companyName,
                date: date,
                status: status,
                notes: notes,
                uploadLink: uploadData.Location,
                profileId: req.profile.id,
                companyId: company.id

            },{
                transaction: t,
                returning: true
            });


            t.commit();


            fs.unlinkSync(file.path);
            if(isCreated){

                res.status(201).json({ message: "Applied", success: true });
            }else{
                res.status(201).json({ message: "Updated", success: true });
            }

        });

    } catch (error) {
        t.rollback();
        if (error.toString() === 'SequelizeUniqueConstraintError: Validation error') {
            res.status(403).json({ message: "Profile already exists! Please add a profile with different name", success: false });
            return;
        }

        console.log(error);
        return res.status(500).json({ message: 'Something went wrong', success: false });
    }


}

exports.deleteApplication = async (req, res, next) => {
    try {
        const applicationId = req.query.applicationId;

        const profileId = req.query.profile;

        const deleted = await Application.destroy({
            where:{
                id: applicationId
            }
        })

        res.status(200).json({ message: "Deleted", success: true });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong', success: false }); 
    }


}


exports.updateApplicationStatus = async (req, res, next) => {

    try {
        const applicationId = req.body.applicationId;
        const status = req.body.status;
        const updated = await Application.update(
            { status: status },
            {
                where: {
                    id: applicationId
                }
            }
        );
        res.status(200).json({ message: "Deleted", success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong', success: false }); 
    }

}



exports.getApplications = async (req, res, next) => {

    try {
        const userId = req.user.userId;
        const profileId = req.profile.id;



        const applications = await Application.findAll({
            where: {
                profileId: profileId
            }
        });

        res.status(200).json({ message: "applications fetched", success: true, applications: applications });



    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong', success: false });
    }

}