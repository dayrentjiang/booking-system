import { SignedOut, SignInButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[350px]">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
          Welcome Back
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Sign in to access your dashboard
        </p>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
      </div>
    </div>
  );
}
