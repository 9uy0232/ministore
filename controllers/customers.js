const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//insert a new customer
const createCustomer = async (req, res) => {
    const { customer_id, first_name, last_name, address, email, phone_number } = req.body;
    try {
        const customer = await prisma.customers.create({
            data: {
                customer_id,
                first_name,
                last_name,
                address,
                email,
                phone_number
            }
        });
        res.status(200).json({
            status: "ok",
            message: `User with id ${customer_id} created successfully`,
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Error creating user",
            error: err.message,
        });
    }
};

// get all customers
const getCustomers = async (req, res) => {
    const cust = await prisma.customers.findMany();
    res.json(cust);
}

// get a customer by customer_id
const getCustomer = async (req, res) => {
    const id = req.params.id;
    try {
        const cust = await prisma.customers.findUnique({
            where: { customer_id: Number(id) },
        });
        if (!cust) {
            res.status(404).json({ message: "Customer not found" });
        } else {
            res.status(200).json(cust);
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

// update a customer by customer_id
const updateCustomer = async (req, res) => {
    const { first_name, last_name, address, email, phone_number } = req.body;
    const { id } = req.params;
    const data = {};
    if (first_name) data.first_name = first_name;
    if (last_name) data.last_name = last_name;
    if (address) data.address = address;
    if (email) data.email = email;
    if (phone_number) data.phone_number = phone_number;
    if (Object.keys(data).length === 0) {
        return res.status(400).json({
            message: "No data provided",
            status: "error"
        });
    }
    try {
        const cust = await prisma.customers.update({
            data: data,
            where: { customer_id: Number(id) }
        });
        res.status(200).json({
            status: "OK",
            message: `Customer with id ${cust.customer_id} is updated successfully`,
            user: cust
        });
    } catch (err) {
        if (err.code === "P2002") {
            res.status(400).json({
                status: "error",
                message: "Email already exists",
            });
        } else if (err.code === "P2025") {
            res.status(404).json({
                status: "error",
                message: `Customer with id = ${id} not found`,
            });
        } else {
            console.error("Update customer error:", err);
            res.status(500).json({
                status: "error",
                message: `Error while updating the Customer`,
            });
        }
    }
}
// delete a customer by customer_id
const deleteCustomer = async (req, res) => {
    const id = req.params.id;
    try {
        // ตรวจสอบว่ามี Customer มั้ย
        const existingCustomer = await prisma.customers.findUnique({
            where: { customer_id: Number(id) },
        });
        // ถ้าไม่เจอ Customer
        if (!existingCustomer) {
            res.status(404).json({ message: "Customer not found" });
        }
        // ถ้ามี Customer
        await prisma.customers.delete({
            where: { customer_id: Number(id), },
        });
        res.status(200).json({
            status: "OK",
            message: `Customer with id ${id} is deleted successfully`
        })
    } catch (err) {
        res.status(500).json(err);
    }
}


module.exports = {
    createCustomer, getCustomers, getCustomer, deleteCustomer, updateCustomer
};