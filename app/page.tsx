'use client';
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import { Button } from '@/components/ui/button';
import AnnotationPage from '@/components/AnnotationPage';

export default function Page() {
  return (
    <>
      <SignedOut>
        <div className="flex items-center justify-center min-h-screen">
          <Button className="text-center justify-center bg-[#6b63c9] text-white px-4 py-2 text-sm font-medium rounded-xl text-lg">
            <SignInButton />
          </Button>
        </div>
      </SignedOut>
      <SignedIn>
        <UserButton />
        <AnnotationPage />
      </SignedIn>
    </>
  );
}
