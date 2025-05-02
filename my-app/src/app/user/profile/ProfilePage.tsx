'use client';

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
	const { user, logout, checkAuth, isCheckingAuth } = useAuthStore();
	const router = useRouter();

	useEffect(() => {
		checkAuth(); // refetch auth status from backend
	}, []);

	const handleLogout = () => {
		logout();
		router.push("/");
	};

	if (isCheckingAuth) {
		return (
			<div className="text-center mt-10 font-bold text-purple-500">Checking session...</div>
		);
	}

	if (!user) {
		return (
			<div className="text-center text-red-500 font-bold mt-10">
				Error: User not found.
			</div>
		);
	}

	return (
		<div
			className='min-h-screen bg-gradient-to-br from-white via-purple-100 to-purple-200 flex items-center justify-center relative overflow-hidden'
		>
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.9 }}
				transition={{ duration: 0.5 }}
				className='max-w-md w-full mx-auto mt-10 p-8 bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-purple-200'
			>
				

				<div className='space-y-6'>
					<motion.div
						className='p-4 bg-white bg-opacity-60 rounded-lg border border-purple-300'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
					>
						<h3 className='text-xl font-semibold text-purple-600 mb-3'>Profile Information</h3>
						<p className='text-gray-800'>Name: {user.name}</p>
						<p className='text-gray-800'>Email: {user.email}</p>
					</motion.div>
					
				</div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6 }}
					className='mt-4'
				>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={handleLogout}
						className='w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white 
						font-bold rounded-lg shadow-lg hover:from-purple-600 hover:to-indigo-700
						focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-white cursor-pointer'
					>
						Logout
					</motion.button>
				</motion.div>
			</motion.div>
		</div>
	);
};

export default ProfilePage;
