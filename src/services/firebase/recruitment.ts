import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    onSnapshot,
    serverTimestamp,
    type Unsubscribe
} from 'firebase/firestore';
import { db } from './config';
import type { JobRole } from '../../types/recruitment';

/**
 * Real-time listener for active recruitment roles
 */
export function subscribeActiveRoles(
    callback: (roles: JobRole[]) => void,
    onError?: (error: Error) => void
): Unsubscribe {
    try {
        const rolesRef = collection(db, 'recruitment_roles');
        // Match open roles
        const q = query(rolesRef, where('status', '==', 'open'));

        return onSnapshot(
            q,
            (snapshot) => {
                const roles: JobRole[] = snapshot.docs.map((docSnap) => ({
                    id: docSnap.id,
                    ...(docSnap.data() as Omit<JobRole, 'id'>)
                }));
                // Sort client-side by postedAt descending if available
                roles.sort((a, b) => {
                    const dateA = a.postedAt ? new Date(a.postedAt).getTime() : 0;
                    const dateB = b.postedAt ? new Date(b.postedAt).getTime() : 0;
                    return dateB - dateA;
                });
                callback(roles);
            },
            (error) => {
                console.warn('Real-time roles query warning:', error);
                if (onError) onError(error);
                // Return empty list safely
                callback([]);
            }
        );
    } catch (err: any) {
        console.warn('Failed to attach roles listener:', err);
        callback([]);
        return () => {};
    }
}

/**
 * Register an email address for future recruitment & role notifications
 */
export async function subscribeRecruitmentAlert(
    rawEmail: string
): Promise<{ success: boolean; message: string; alreadySubscribed?: boolean }> {
    const email = rawEmail.trim().toLowerCase();

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return {
            success: false,
            message: 'Please provide a valid email address.'
        };
    }

    try {
        const alertsRef = collection(db, 'recruitment_alerts');

        // Check if email already registered
        const checkQuery = query(alertsRef, where('email', '==', email));
        const checkSnap = await getDocs(checkQuery);

        if (!checkSnap.empty) {
            return {
                success: true,
                alreadySubscribed: true,
                message: 'This email is already subscribed for role alerts.'
            };
        }

        // Add new subscriber
        await addDoc(alertsRef, {
            email,
            active: true,
            source: 'recruitment_page',
            subscribedAt: new Date().toISOString(),
            createdAt: serverTimestamp()
        });

        return {
            success: true,
            alreadySubscribed: false,
            message: 'Subscribed successfully! We will notify you when new roles are posted.'
        };
    } catch (error: any) {
        console.error('Error registering alert subscription:', error);
        return {
            success: false,
            message: error.message || 'Unable to subscribe. Please try again.'
        };
    }
}
