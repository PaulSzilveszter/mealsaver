import { useRouter, useSegments } from "expo-router";
import React, { useState, useEffect, useContext, createContext } from "react";


// Now AuthContext will have the type or be null
const AuthContext = createContext<any>(null);

// This hook can be used to access the user info.
export function useAuth() {
  return useContext<any>(AuthContext);
}

// This hook will protect the route access based on user authentication.
function useProtectedRoute(user : any) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !user &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page.
      router.replace("/sign-in");
    } else if (user && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace("/");
    }
  }, [user, segments, router]);
}

export function AuthProvider(props: any) {
  const [user, setAuth] = useState<any>(null);

  useProtectedRoute(user);

  return (
    <AuthContext.Provider
      value={{
        signIn: (credentials:any) => setAuth({}),
        signOut: () => setAuth(null),
        user,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
