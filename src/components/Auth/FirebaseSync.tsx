/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  doc, 
  onSnapshot, 
  collection, 
  query, 
  where,
  getDoc,
  getDocFromServer,
  setDoc
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { useStore, UserProfile, PlannerBlock } from '../../store/useStore';
import { Quest } from '../../types';

export default function FirebaseSync() {
  const { setUser, setProfile, setQuests, setPlannerBlocks, logout, setFriends } = useStore();

  useEffect(() => {
    // Validate connection to Firestore
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    };
    testConnection();

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        
        // Ensure public profile exists for social features
        const syncPublicProfile = async () => {
          const profileDocRef = doc(db, 'profiles', user.uid);
          const profileSnap = await getDoc(profileDocRef);
          
          if (!profileSnap.exists()) {
            // Get current user data to populate public profile
            const userDocSnap = await getDoc(doc(db, 'users', user.uid));
            if (userDocSnap.exists()) {
              const userData = userDocSnap.data();
              if (userData.onboarded && userData.character) {
                await setDoc(profileDocRef, {
                  uid: user.uid,
                  username: userData.character.name,
                  level: userData.character.level || 0,
                  avatarUrl: userData.character.avatarUrl,
                  status: 'online'
                });
              }
            }
          }
        };
        syncPublicProfile();
        
        // Sync Profile
        const unsubscribeProfile = onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
          if (snapshot.exists()) {
            setProfile(snapshot.data() as UserProfile);
          }
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
        });

        // Sync Quests
        const unsubscribeQuests = onSnapshot(collection(db, 'users', user.uid, 'quests'), (snapshot) => {
          const quests = snapshot.docs.map(doc => doc.data() as Quest);
          setQuests(quests);
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}/quests`);
        });

        // Sync Planner
        const unsubscribePlanner = onSnapshot(collection(db, 'users', user.uid, 'planner'), (snapshot) => {
          const blocks = snapshot.docs.map(doc => doc.data() as PlannerBlock);
          setPlannerBlocks(blocks);
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}/planner`);
        });

        // Sync Friends
        const unsubscribeFriends = onSnapshot(collection(db, 'users', user.uid, 'friends'), (snapshot) => {
          const friendsList = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: data.uid,
              name: data.username,
              level: data.level || 0,
              status: 'offline' as const,
              lastActive: data.lastActive || new Date().toISOString()
            };
          });
          setFriends(friendsList);
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}/friends`);
        });

        return () => {
          unsubscribeProfile();
          unsubscribeQuests();
          unsubscribePlanner();
          unsubscribeFriends();
        };
      } else {
        logout();
      }
    });

    return () => unsubscribeAuth();
  }, [setUser, setProfile, setQuests, setPlannerBlocks, logout]);

  return null;
}
