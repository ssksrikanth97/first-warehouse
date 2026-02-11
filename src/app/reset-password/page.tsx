"use client"

import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

function ResetPasswordForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            alert("Passwords do not match")
            return
        }
        if (!token) {
            alert("Invalid reset link")
            return
        }

        setIsSubmitting(true)
        try {
            const res = await fetch('/api/auth/set-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword: password })
            })

            if (res.ok) {
                setIsSuccess(true)
                setTimeout(() => router.push('/login'), 3000)
            } else {
                const err = await res.json()
                alert(err.error || "Failed to reset password")
            }
        } catch (error) {
            console.error("Error setting password", error)
            alert("An error occurred")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Password Reset Successful!</h2>
                <p className="text-slate-500">You can now login with your new password.</p>
                <Link href="/login">
                    <Button className="mt-4">Go to Login</Button>
                </Link>
            </div>
        )
    }

    if (!token) {
        return (
            <div className="text-center py-8 text-red-500">
                Invalid or missing reset token. Please request a new link.
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                    id="confirmPassword"
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Set New Password
            </Button>
        </form>
    )
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Set New Password</CardTitle>
                    <CardDescription>Enter a strong password for your account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
                        <ResetPasswordForm />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    )
}
