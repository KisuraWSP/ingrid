const user = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { z } = require('zod')

const registrationSchema = z.object({
  name : z.string().min(2, 'Name should be at least 2 characters long'),
  user_name : z.string().min(3, 'Username should be at least 3 characters long'),
  email : z.email('Invalid email address'),
  password : z.string().min(6, 'Password should be at least 6 characters long'),
  role: z.enum(['student', 'instructor', 'admin']).optional(), 
})

module.exports.createUserController = async (req, res, next) => {
  try {
    const validatedData = registrationSchema.parse(req.body)
    
    const existingUser = await user.findOne({ email : validatedData.email })
    if (existingUser) {
      return res.status(401).json({ message: 'Email already in use' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(validatedData.password, salt)

    const userItem = new user({
      name : validatedData.name,
      user_name : validatedData.user_name,
      email : validatedData.email,
      password : hashedPassword,
      role: validatedData.role || 'student',
    })

    await userItem.save()

    const userResponse = userItem.toObject()
    delete userResponse.password

    res.status(201).json({ message: 'user created successfully', userResponse })
  } catch (error) {
    next(error)
  }
}

const loginSchema = z.object({
  email : z.email('Invalid email address'),
  password : z.string().min(6, 'Password should be at least 6 characters long'),
})

module.exports.loginController = async (req, res, next) => {
  try {
    const { email , password } = loginSchema.parse(req.body)

    const userItem = await user.findOne({ email })
    if (!userItem) {
      return res.status(401).json({ message: 'Invalid email' })
    }

    const isPasswordCorrect = await bcrypt.compare(password, userItem.password)
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid password' })
    }

    const token = jwt.sign(
      { id: userItem._id, role : userItem.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    const userResponse = userItem.toObject()
    delete userResponse.password

    res.status(200).json(
      {
        message : 'Login successful',
        token,
        user : userResponse
      }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors })
    }
    next(error)
  }
}

module.exports.getAllUsersController = async (req, res, next) => {
  try {
    const userItem = await user.find()

    res.status(200).json({ userItem })
  } catch (error) {
    next(error)
  }
}


module.exports.getUserByIdController = async (req, res, next) => {
  try {
    const { labAssistantId } = req.params;

    const labAssistant = await LabAssistant.findById(labAssistantId);

    if (!labAssistant) {
      return res.status(404).json({ message: 'Lab Assistant not found' });
    }

    res.status(200).json({ labAssistant });
  } catch (error) {
    next(error);
  }
};

module.exports.updateUserByIdController = async (req, res, next) => {
  try {
    const { labAssistantId } = req.params;

    const {
      lab_assistant_id,
      firstName,
      lastName,
      gender,
      phoneNumber,
      emailAddress,
      NIC,
    } = req.body;

    const updatedLabAssistant = await LabAssistant.findByIdAndUpdate(
      labAssistantId,
      {
        lab_assistant_id,
        firstName,
        lastName,
        gender,
        phoneNumber,
        emailAddress,
        NIC,
      },
      { new: true }
    );

    if (!updatedLabAssistant) {
      return res.status(404).json({ message: 'Lab Assistant not found' });
    }

    res.status(200).json({ message: 'Lab Assistant updated successfully', labAssistant: updatedLabAssistant });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteUserByIdController = async (req, res, next) => {
  try {
    const { labAssistantId } = req.params;

    const deletedLabAssistant = await LabAssistant.findByIdAndDelete(labAssistantId);

    if (!deletedLabAssistant) {
      return res.status(404).json({ message: 'Lab Assistant not found' });
    }

    res.status(200).json({ message: 'Lab Assistant deleted successfully' });
  } catch (error) {
    next(error);
  }
};