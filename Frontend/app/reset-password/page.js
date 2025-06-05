'use client';
import { Suspense } from 'react';
import ResetPassword from '../../components/Auth/ResetPassword';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPassword />
    </Suspense>
  );
}

