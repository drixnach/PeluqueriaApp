import { useAuth } from '../../context/AuthContext';

export default function VistaPeluquero() {
    const { auth } = useAuth();

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <div className="bg-white p-10 rounded-[2rem] border border-sky-50 shadow-xl shadow-sky-100/50 text-center max-w-md">
            <div className="text-4xl mb-4">✂️</div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Hola, {auth?.nombre}</h2>
                <p className="text-slate-500 font-medium">Tu agenda y tus estadísticas están en construcción.</p>
            </div>
        </div>
    );
}