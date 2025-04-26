import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const backgroundImages = [
  '/backgrounds/tesla.png',
  '/backgrounds/soviet.png',
  '/backgrounds/urban.png',
  '/backgrounds/construction.png',
  '/backgrounds/screenshot.png',
];

export default function LoginPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </AnimatePresence>
      
      <div className="absolute inset-0 bg-black/50 z-10" />
      
      <div className="relative z-20 flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button className="w-full">Sign In</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 