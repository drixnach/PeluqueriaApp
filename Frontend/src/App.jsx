import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route,Navigate, Outlet } from 'react-router-dom';
import { obtenerTurnos } from './services/TurnoServices';
import {AuthProvider, useAuth} from './context/AuthContext';
import { rutaPorRol } from './utils/rutas';

import VistaCliente from './components/cliente/VistaCliente';
import VistaAdmin from './components/admin/VistaAdmin';
import VistaPeluquero from './components/peluquero/VistaPeluquero';
import Login from './components/auth/Login';
import BarraSesion from './components/common/BarraSesion';
import RutaProtegida from './components/common/RutaProtegida';

function LayoutConSesion() {
  return (
    <>
      <BarraSesion />
      <Outlet />
    </>
  );
}

function PaginaLogin() {
  const { auth, cargando } = useAuth();
  if (cargando) return null;
  if (auth) return <Navigate to={rutaPorRol(auth.rol)} replace />;
  return <Login />;
}

function AppRoutes() {
  const { cargando } = useAuth();
  const [turnosGlobales, setTurnosGlobales] = useState([]);
  const [clientesGlobales, setClientesGlobales] = useState([]);

  useEffect(() => {
    cargarTurnos();
  }, []);

  async function cargarTurnos() {
    try {
      const data = await obtenerTurnos();
      setTurnosGlobales(data);
    } catch (error) {
      console.error('Error al cargar turnos', error);
    }
  }

  if (cargando) return null;

  return (
    <Routes>
      <Route path="/login" element={<PaginaLogin />} />

      <Route element={<LayoutConSesion />}>
        <Route
          path="/"
          element={<VistaCliente turnosGlobales={turnosGlobales} cargarTurnos={cargarTurnos} />}
        />
        <Route
          path="/admin/*"
          element={
            <RutaProtegida roles={['Admin']}>
              <VistaAdmin
                turnosGlobales={turnosGlobales}
                setTurnosGlobales={setTurnosGlobales}
                clientesGlobales={clientesGlobales}
                setClientesGlobales={setClientesGlobales}
                cargarTurnos={cargarTurnos}
              />
            </RutaProtegida>
          }
        />
        <Route
          path="/peluquero/*"
          element={
            <RutaProtegida roles={['Peluquero']}>
              <VistaPeluquero />
            </RutaProtegida>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}