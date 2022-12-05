import { Loader } from "@mantine/core";
import { useRouter } from "next/router";
import { ReactNode } from "react"
import { useAuth } from "./authContext";
import handleUserType from "./handleUserType";
type UserRole = 'fan' | 'staff' | 'superAdmin';

const accessRoutes: Record<UserRole, string> = {
  fan: '/user',
  staff: '/admin',
  superAdmin: ''
}

export const ProtectedPage = ({ children }: { children: ReactNode }) => {
  const { user , authLoading} = useAuth();
  const router = useRouter();

  if(!user){
    !authLoading && router.push('/')
  } else {
    const currentPage = router.pathname;
    const {group, dashboardLink} = handleUserType(user);

    const hasAccess = currentPage.startsWith(accessRoutes[group]);
    !hasAccess && router.push(dashboardLink)

    if(hasAccess){
      return <>{children}</>;
    }
  }

  return (
    <div className="authLoader">
      <Loader color="white" size="lg" />
    </div>
  );
}
