const express = require('express')
const router = new express.Router()
const Hospital = require('../model/hosp')
const bcrypt = require('bcryptjs')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const account = require('../emails/account')


//signup
router.post('/signup', async (req,res)=>{
    const hosp = new Hospital(req.body)
    try{
        await hosp.save()
        
        //confirm email
        account.confMail(hosp.email,hosp.name, hosp._id)
        const token = await hosp.generateToken()
        res.status(201).send({hosp, token})
    }catch(e){
        res.status(401).send(e)
    }
})

//activate account
router.patch('/activate/:id' , async (req,res)=>{
    const _id = req.params.id
    try{
        const hosp = await Hospital.findById(_id)
        if(!hosp){
            return res.status(404).send()
        }
        hosp.status = 'Active'
        await hosp.save()
        res.send(hosp)
    }
    catch(e){
        res.status(500).send()
    }
})

//login
router.post('/login', async (req,res)=>{
    console.log(req.body.email)
    try{
        const hosp = await Hospital.findByCredentials(req.body.email,req.body.password)
        if(hosp.status==='Pending'){
            throw new Error("Please verify!")
        }
        const token = await hosp.generateToken()
        //res.send({hosp,token})
        res.render('main',{
            name: hosp.name
        })
    }catch(e){
        res.status(400).send(e)
    }
})

//profile
router.get('/me', auth, async (req,res)=>{
    res.send(req.hosp)
})


// logout
router.post('/logout', auth, async (req,res)=>{
    try{
        req.hosp.tokens = req.hosp.tokens.filter((token)=>{
            return token.token != req.token
        })

        await req.hosp.save()
        res.send()
    }catch(e){
        req.status(500).send()
    }
})

//logout all
router.post('/logoutAll', auth, async (req,res)=>{
    try{
        req.user.tokens=[]
        await req.hosp.save()
        res.send()
    }
    catch(e){
        res.status(500).send()
    }
})

//update
router.patch('/updateme', auth, async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowed = ['name','password','address']
    const check = updates.every((update)=>{
        return allowed.includes(update)
    })

    if(!check){
        return res.status(404).send()
    }

    try{
        updates.forEach((element)=>{
            req.hosp[element] = req.body[element]
        })
        
        await req.hosp.save()

        res.send(req.hosp)
    }catch(e){
        res.status(404).send(e)
    }
})

module.exports = router