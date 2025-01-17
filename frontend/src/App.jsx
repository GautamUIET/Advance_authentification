import FloatingShape from "./components/FloatingShape";
import {Routes,Route } from 'react-router-dom'
import Home from "./Pages/Home";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import EmailVerificationPage from "./Pages/EmailVerificationPage";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner";
import  ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";

const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (!isAuthenticated) {
		return <Navigate to='/login' replace />;
	}

	if (!user.isVerified) {
		return <Navigate to='/verify-email' replace />;
	}

	return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (isAuthenticated && user.isVerified) {
		return <Navigate to='/' replace />;
	}

	return children;
};

export default function App() {
  const {isCheckingAuth,checkAuth,isAuthenticated, user} = useAuthStore();

  useEffect(()=>{
    checkAuth();
  },[checkAuth]) 

  console.log('isAuth',isAuthenticated);
  console.log('user',user);

  if(isCheckingAuth) return <LoadingSpinner />
   return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      
      <FloatingShape 
        color='bg-green-500' 
        size='w-50  h-50' 
        top='-5%' 
        left='10%' 
        animationType="pulse"
        delay={0} 
      />

      <FloatingShape 
        color='bg-emerald-500' 
        size='w-48 h-48' 
        top='70%' 
        left='80%' 
        animationType="bounce" 
        delay={2} 
      />

      <FloatingShape 
        color='bg-lime-500' 
        size='w-32 h-32' 
        top='40%' 
        left='-10%' 
        animationType="swirl"
        delay={4} 
      />

      <FloatingShape 
        color='bg-teal-500' 
        size='w-40 h-40' 
        top='20%' 
        left='50%' 
        animationType="wave"
        delay={1} 
      />
       
       <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <Home />  
        </ProtectedRoute>} />

        <Route path="/signup" element={<RedirectAuthenticatedUser><Signup/></RedirectAuthenticatedUser>} />
        <Route path="/login" element={<RedirectAuthenticatedUser><Login/></RedirectAuthenticatedUser>} />
        <Route path = '/verify-email' element = {<EmailVerificationPage/>} />
        <Route path = '/forgot-password' element = {<RedirectAuthenticatedUser><ForgotPassword/></RedirectAuthenticatedUser>}/>
        <Route 
        path = '/reset-password/:token'

        element = {
          <RedirectAuthenticatedUser>
            <ResetPassword/>
          </RedirectAuthenticatedUser>
        }
        />
        
       </Routes>
       <Toaster/>
    </div>
  );
}
