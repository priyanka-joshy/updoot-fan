import { Loader } from "@mantine/core";
import { useRouter } from "next/router";
import { ReactNode } from "react"
import { useAuth } from "./authContext";
import { handlePageAccess } from "./handleUserAccess";

export const ProtectedPage = ({ children }: { children: ReactNode }) => {
  const { user , authLoading} = useAuth();
  const router = useRouter();

  if(!user){
    !authLoading && router.push('/')
  } else {
    const redirectLink = handlePageAccess(router.pathname, user);
    // Unauthorized - redirect to relevant dashboard
    redirectLink && router.push(redirectLink)
    // Authorized
    if(!redirectLink){
      return <>{children}</>;
    }
  }

  return (
    <div className="authLoader">
      <Loader color="violet" size="lg" />
    </div>
  );
}
