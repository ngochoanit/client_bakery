/* eslint-disable react/require-default-props */
/* eslint-disable react/destructuring-assignment */
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface PropsType {
  children: any;
  title?: string;
}

const PublicRoute = function PublicRoute(props: PropsType) {
  const { t } = useTranslation();
  useEffect(() => {
    // set title
    document.title = t(props.title ?? 'Home page');
  }, [props.title, t]);
  return props.children;
};

export default PublicRoute;
