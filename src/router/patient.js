const express = require('express')
const auth = require('../middleware/auth')
const Hospital = require('../model/hosp')
const router = new express.Router()
const Patient = require('../model/patient')

//add patient
router.post('/patients', auth, async (req, res) => {
    const patient = new Patient({
        ...req.body,
        owner: req.hosp._id
    })

    try {
        await patient.save()
        res.status(201).send(patient)
    } catch (e) {
        res.status(400).send(e)
    }
})

//sort the patient
///patients?status=Admit or Discharged
//limit & skip
// GET /tasks?limit=10&skip=0
//sort
//GET /tasks?sortBy=createdAt_asc or desc
router.get('/findPatients', auth, async (req, res) => {

    const match = {}
    if (req.query.status) {
         match.status = req.query.status
        
    }
    const sort = {}
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split('_')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try {
        await req.hosp.populate({
            path: 'myPat',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()

        const patients = req.hosp.myPat
        res.send(patients)
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/add_Reports/:id', auth, async (req,res)=>{
    const rep = req.body
    try{
        const patient = await Patient.findOne({_id:req.params.id,owner:req.hosp._id})
        if(!patient){
            return res.status(404).send()
        }
        await patient.AddReport(rep)
        res.send(patient)
    }catch(e){
        res.status(500).send()
    }
})


module.exports = router