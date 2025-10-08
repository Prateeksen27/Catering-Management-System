import jwt from 'jsonwebtoken'
export const verifyToken = (req,res,next)=>{
    const token = req.header('auth-token')
    if (!token) {
        return res.status(401).json({ message: 'Access denied, no token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log("Token verified successfully:", decoded);
        
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        res.status(403).json({ message: 'Invalid token' });
    }
}