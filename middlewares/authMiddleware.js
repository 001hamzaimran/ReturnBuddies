import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';

const isAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];

        // Check if Authorization header exists and starts with 'Bearer '
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        // ✅ Correctly extract the token
        const token = authHeader.split(' ')[1];
        // console.log('Token:', token);

        // ✅ Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log('Decoded JWT:', decoded);
        //  check admin 
        const user= await UserModel.findById(decoded.id)
        console.log('user',user)
        if (!user) {
            return res.status(403).json({ message: 'Unauthorized: User not found' });
        }
         if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized: User is not an admin' });
        }
        req.user=user
        
        // Optional: attach decoded info to request (e.g., user ID or role)
        // req.user = decoded;

        next(); // Proceed to next middleware or route
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};


const isLogin=async(req,res,next)=>{
  try {
        const authHeader = req.headers['authorization'];

        // Check if Authorization header exists and starts with 'Bearer '
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        // ✅ Correctly extract the token
        const token = authHeader.split(' ')[1];
        // console.log('Token:', token);

        // ✅ Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log('Decoded JWT:', decoded);
        //  check admin 
        const user= await UserModel.findById(decoded.id)
        
        req.user=user
        
        // Optional: attach decoded info to request (e.g., user ID or role)
        // req.user = decoded;

        next(); // Proceed to next middleware or route
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
}
export { isAdmin,isLogin };
