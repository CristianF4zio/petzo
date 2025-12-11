/**
 * Página de inicio de sesión
 * Permite iniciar sesión con email/password o Google
 */

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PawPrint, Mail, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { loginWithEmail, loginWithGoogle } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  // Si ya está autenticado, redirigir al dashboard
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  if (user) {
    return null;
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await loginWithEmail(email, password);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Error al iniciar sesión");
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    const result = await loginWithGoogle();

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Error al iniciar sesión con Google");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Lado Izquierdo - Imagen y texto motivacional */}
      <div className="hidden lg:flex relative bg-gradient-to-br from-[var(--color-surface)] via-[var(--color-background)] to-[var(--color-surface)] p-12 flex-col justify-between border-r border-[var(--color-border)]">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-12 h-12 rounded-[var(--radius-md)] bg-[var(--color-primary)]/20 backdrop-blur-sm">
              <PawPrint className="w-7 h-7 text-[var(--color-primary)]" />
            </div>
            <span className="text-3xl font-bold text-[var(--color-text-primary)]">PETZO</span>
          </div>

          <h2 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4 leading-tight">
            Conectando mascotas con familias amorosas
          </h2>
          <p className="text-xl text-[var(--color-text-secondary)]">
            Miles de mascotas han encontrado su hogar perfecto gracias a nuestra
            comunidad. ¡Únete hoy!
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-[var(--color-primary)]/10 backdrop-blur-sm rounded-[var(--radius-lg)] p-6 border border-[var(--color-border)]">
            <div className="text-4xl font-bold text-[var(--color-text-primary)] mb-2">1,000+</div>
            <p className="text-[var(--color-text-secondary)]">Adopciones exitosas</p>
          </div>
          <div className="bg-[var(--color-primary)]/10 backdrop-blur-sm rounded-[var(--radius-lg)] p-6 border border-[var(--color-border)]">
            <div className="text-4xl font-bold text-[var(--color-text-primary)] mb-2">500+</div>
            <p className="text-[var(--color-text-secondary)]">Refugios asociados</p>
          </div>
        </div>

        {/* Elementos decorativos */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-[var(--color-accent)]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-[var(--color-tertiary)]/5 rounded-full blur-3xl"></div>
      </div>

      {/* Lado Derecho - Formulario */}
      <div className="flex items-center justify-center p-6 lg:p-12 bg-[var(--color-background)]">
        <div className="w-full max-w-md">
          {/* Logo móvil */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-primary)]">
              <PawPrint className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-[var(--color-primary)]">
              PETZO
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
              Bienvenido de vuelta
            </h1>
            <p className="text-[var(--color-text-secondary)]">
              Inicia sesión para continuar
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="login" className="flex-1">
                Iniciar Sesión
              </TabsTrigger>
              <TabsTrigger value="register" className="flex-1">
                Registrarse
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Correo electrónico</Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="rounded border-[var(--color-border)]"
                    />
                    <span className="text-[var(--color-text-secondary)]">
                      Recordarme
                    </span>
                  </label>
                  <a
                    href="#"
                    className="text-sm text-[var(--color-primary)] hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
              </form>

              <div className="my-6">
                <div className="relative">
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-background)] px-3 text-sm text-[var(--color-text-muted)]">
                    O continúa con
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuar con Google
              </Button>

              <p className="text-center text-sm text-[var(--color-text-secondary)] mt-6">
                ¿No tienes cuenta?{" "}
                <Link
                  href="/auth/register"
                  className="text-[var(--color-primary)] font-medium hover:underline"
                >
                  Regístrate gratis
                </Link>
              </p>
            </TabsContent>

            <TabsContent value="register">
              <p className="text-center text-[var(--color-text-secondary)] mb-4">
                La funcionalidad de registro está en desarrollo
              </p>
              <Link href="/auth/register">
                <Button variant="primary" size="lg" className="w-full">
                  Ir a página de registro
                </Button>
              </Link>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
