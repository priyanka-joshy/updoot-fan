import { Loader } from "@mantine/core";
import { useRouter } from "next/router";
import { ReactNode } from "react"
import { useAuth } from "./authContext";


export const ProtectedPage = ({ children }: { children: ReactNode }) => {
  const { user , authLoading} = useAuth();
  const router = useRouter();

  if(!user){
    !authLoading && router.push('/')
    return (
      <div className="authLoader">
        <Loader color="white" size="lg" />
      </div>
    );
  }
 
  return  <>{children}</>;
}
