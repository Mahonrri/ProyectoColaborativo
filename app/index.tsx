// app/index.tsx
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Asegura que el router esté listo antes de navegar
    const timeout = setTimeout(() => {
      router.replace('/login'); // o '/register'
    }, 0); // 0 milisegundos permite que el layout termine de montar

    return () => clearTimeout(timeout);
  }, []);

  return null;
}
