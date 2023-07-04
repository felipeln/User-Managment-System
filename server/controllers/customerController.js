const Customer = require('../models/Customer')
const mongoose = require('mongoose')


// HOME PÁGE


exports.homepage = async (req,res) =>{

    const messages = await req.consumeFlash('info')
    const removeMsg = await req.consumeFlash('deleted')

    const locals = {
        title: 'nodejs',
        desc: 'free node js user management system'
    }

    // pagination
    let perpage = 10
    let page = req.query.page || 1;
    


    try {
        
        const customers = await Customer.aggregate([{$sort: {updatedAt: -1}}])
        .skip(perpage * page - perpage)
        .limit(perpage)
        .exec()


        const count = await Customer.count()

        res.render('index', {
            locals,
           customers,
            current: page,
            pages: Math.ceil(count / perpage),
            messages,
            removeMsg
        })

    } catch (error) {
        console.log(error);
    }

}

// ADD NEW CUSTUMER FORM
exports.addCustomer = async (req,res) =>{

    const locals = {
        title: 'nodejs',
        desc: 'free node js user management system'
    }

    res.render('customer/add', locals)

}
// POST NEW CUSTUMER
exports.postCustomer = async (req,res) =>{

    const newCustomer = new Customer ({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        tel: req.body.tel,
        email: req.body.email,
        details: req.body.details,
    })

   try {
    
    await Customer.create(newCustomer)


    await req.flash('info', "new customer has been added")
    

    res.redirect('/')
    
   } catch (error) {
    console.log(error);
   }
}


// view customer data
exports.view = async (req,res) =>{

   try {
    const customer = await Customer.findOne({_id: req.params.id})

    const locals = {
        title: 'View customer data',
        desc: 'free node js user management system'
    }

    res.render('customer/view', {
        locals,
        customer
    })
    
   } catch (error) {
    console.log(error);
   }
}



// edit customer data
exports.edit= async (req,res) =>{

   try {
    const customer = await Customer.findOne({_id: req.params.id})

    const locals = {
        title: 'edit customer data',
        desc: 'free node js user management system'
    }

    res.render('customer/edit', {
        locals,
        customer
    })
    
   } catch (error) {
    console.log(error);
   }
}
// post the edited customer data
exports.editPost= async (req,res) =>{

   try {
    await Customer.findByIdAndUpdate(req.params.id,{
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        tel: req.body.tel,
        email: req.body.email,
        status: req.body.status,
        details: req.body.details,
        updatedAt: Date.now(),
    })

    res.redirect(`/edit/${req.params.id}`)

   } catch (error) {
    console.log(error);
   }
}
exports.deleteCustomer= async (req,res) =>{


   try {

    let user = await Customer.findOne({_id: req.params.id})
    await Customer.findByIdAndDelete(req.params.id)

    await req.flash('deleted',`${user.firstName} ${user.lastName} has been deleted from database`)

    res.redirect(`/`)

   } catch (error) {
    console.log(error);
   }
}
// search
exports.searchCustomer= async (req,res) =>{

    const locals = {
        title: "Search Customer Data",
        description: "Free NodeJs User Management System",
      };
    

    try {
        let searchTerm = req.body.searchTerm
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

        const customers = await Customer.find({
            $or: [
                {
                    firstName: { $regex: new RegExp(searchNoSpecialChar, "i")}
                },
                
                {
                    lastName: { $regex: new RegExp(searchNoSpecialChar, "i")}
                },

            ]
        })

        res.render('search', {
            customers,
            locals
        })
    } catch (error) {
        console.log(error);
    }

}
