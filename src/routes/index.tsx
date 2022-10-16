import { useRoutes } from 'react-router-dom';
import ROLE from 'src/constants/role';
import { useAppSelector } from 'src/redux';
import { routes } from './config';

const AppRouter = function AppRouter() {
  const user = useAppSelector((s) => s.auth.user);
  const have404 = useAppSelector((s) => s.auth.have404);

  const filteredRoutes = routes.filter((route) => {
    if (route.is404) {
      return have404;
    }
    if (user) {
      if (route.role) {
        if (route.role.includes(user.role as ROLE)) {
          return true;
        }
        return false;
      }
      return true;
    }

    return !route.isPrivate;
  });
  // eslint-disable-next-line react/jsx-no-useless-fragment
  const appRoutes = useRoutes(filteredRoutes);
  return appRoutes;
};

export default AppRouter;
