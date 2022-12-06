import { CognitoUser } from "@aws-amplify/auth";
type UserRole = 'fan' | 'staff';

interface GroupInfo {
  group: UserRole,
  dashboardLink: string
}

interface UserAttributes {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  phone_number: string;
  phone_number_verified: boolean;
}
interface CognitoUserExt extends CognitoUser {
  attributes: UserAttributes;
  signInUserSession: {
    accessToken: {
      jwtToken: string,
      payload: {
        "cognito:groups": UserRole[] | undefined
      }
    }
  }
}

// determine user type and relevant dashboard link
const userDashboards: Record<UserRole, string> = {
  fan: "/user/proposals",
  staff: "/admin",
}
const accessRoutes: Record<UserRole, string[]> = {
  fan: ['user'],
  staff: ['admin', 'user'],
}

const handleUserType = (user: CognitoUserExt): GroupInfo => {
  const cognitoUserGroup = user.signInUserSession.accessToken.payload["cognito:groups"];
  if (!cognitoUserGroup) {
    // throw new Error("Invalid User: no user group");
    return (
      {
        group: "fan",
        dashboardLink: userDashboards["fan"]
      }
    );
  } else {
    const userGroup = cognitoUserGroup[0];
    return (
      {
        group: userGroup,
        dashboardLink: userDashboards[userGroup]
      }
    );
  }
}

const getDashboardType = (userType: UserRole) => {
  return userDashboards[userType];
}

const handlePageAccess = (path: string, user: CognitoUserExt) => {
  const pageType = (path.split('/'))[1];
  const { group, dashboardLink } = handleUserType(user);

  const hasAccess = accessRoutes[group].includes(pageType);    
  return hasAccess? undefined : dashboardLink;
}

export { 
  handleUserType,
  getDashboardType,
  handlePageAccess
};