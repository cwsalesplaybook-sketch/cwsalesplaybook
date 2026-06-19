/** O playbook de Closer foi destrinchado em seções próprias do dashboard
 *  (rotas /closer/*). Este componente apenas redireciona para a primeira. */
import { Navigate } from 'react-router-dom';

export default function PlaybookCloser() {
  return <Navigate to="/closer/planos" replace />;
}
