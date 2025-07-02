import { auth,clerkClient } from '@clerk/nextjs/server'
import { notFound } from 'next/navigation'
import { redirect } from 'next/navigation'
import db from '@/lib/db'




/**
 * This page is used to sync the user data from Clerk to the database.
 * It is called when the user signs up or signs in for the first time.
 * It will redirect the user to the dashboard after syncing the data.
 */

const SyncUser = async () => {
    const { userId } = await auth()
    if (!userId) {
        throw new Error('User not found')
    }
    const clerk = await clerkClient()
    const user = await clerk.users.getUser(userId)
    if (!user.emailAddresses[0]?.emailAddress){
        return notFound()
    }

    await db.user.upsert({
        where: { 
            emailAddress : user.emailAddresses[0].emailAddress ?? ""
        },
        update: {
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl,
        },
        create: {
            id: userId,
            emailAddress: user.emailAddresses[0].emailAddress ?? "",
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl,
        },
    })
    return redirect('/dashboard')
  
}

export default SyncUser 