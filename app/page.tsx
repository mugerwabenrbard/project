'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        console.error('[Login] Error:', result.error);
        setError(result.error);
        setIsLoading(false);
      } else {
        console.log('[Login] Success, redirecting to /staff/dashboard');
        router.push('/staff/dashboard');
      }
    } catch (err) {
      console.error('[Login] Unexpected error:', err);
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
          <div className="relative bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-2xl backdrop-blur-lg transform transition-all duration-500 ease-in-out hover:-translate-y-2">
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-extralight tracking-wider bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                  WELCOME BACK
                </h2>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-light tracking-wide">
                  Please sign in to continue
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider font-light text-gray-500 dark:text-gray-400">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent focus:border-primary/50 focus:ring-0 font-light transition-colors duration-300"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider font-light text-gray-500 dark:text-gray-400">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent focus:border-primary/50 focus:ring-0 font-light transition-colors duration-300"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                {error && (
                  <div className="flex items-center p-3 bg-red-50 dark:bg-red-900/30 rounded-xl text-red Linde-600 dark:text-red-400">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <p className="text-sm font-light">{error}</p>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary"
                    />
                    <span className="font-light text-gray-600 dark:text-gray-400">Remember me</span>
                  </label>
                  <a
                    href="#"
                    className="font-light text-primary hover:text-primary/80 transition-colors duration-300"
                  >
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-3 rounded-xl font-light tracking-wider uppercase text-sm transform transition-all duration-500 ease-in-out hover:opacity-90 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin mx-auto h-5 w-5" />
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              <div className="text-center">
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don't have an account?{' '}
                  <a
                    href="/staff/users/adduser"
                    className="text-primary hover:text-primary/80 transition-colors duration-300"
                  >
                    Sign up
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}