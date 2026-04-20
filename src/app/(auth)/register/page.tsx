"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Leaf,
  User,
} from "lucide-react";
import Link from "next/link";
import styles from "../auth.module.css";

const roles = [
  { value: "person", label: "Persona", icon: "👤", desc: "Ciudadano" },
  { value: "company", label: "Empresa", icon: "🏢", desc: "Farmacia / Lab" },
  { value: "gestor", label: "Gestor", icon: "🔬", desc: "Biotecnológico" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("person");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      setLoading(false);
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Update the profile with the role
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase
        .from("profiles")
        .update({ full_name: fullName, role: role })
        .eq("id", user.id);

      router.push("/dashboard");
      router.refresh();
    } else {
      // Email confirmation required
      setSuccess(true);
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className={styles.authPage}>
        <div className={styles.bgOrb1} />
        <div className={styles.bgOrb2} />
        <div className={styles.card}>
          <div className={styles.brand}>
            <Link href="/" className={styles.brandLink}>
              <div className={styles.brandIcon}>
                <Leaf size={22} />
              </div>
              <div className={styles.brandName}>
                Bio<span>Pharma</span>
              </div>
            </Link>
          </div>
          <h1 className={styles.cardTitle}>¡Revisa tu correo! 📧</h1>
          <p className={styles.cardSubtitle}>
            Te hemos enviado un enlace de confirmación a <strong>{email}</strong>.
            Haz clic en el enlace para activar tu cuenta.
          </p>
          <p className={styles.footer}>
            <Link href="/login">Volver a iniciar sesión</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.authPage}>
      <div className={styles.bgOrb1} />
      <div className={styles.bgOrb2} />

      <div className={styles.card}>
        {/* Brand */}
        <div className={styles.brand}>
          <Link href="/" className={styles.brandLink}>
            <div className={styles.brandIcon}>
              <Leaf size={22} />
            </div>
            <div className={styles.brandName}>
              Bio<span>Pharma</span>
            </div>
          </Link>
        </div>

        <h1 className={styles.cardTitle}>Crea tu cuenta</h1>
        <p className={styles.cardSubtitle}>
          Únete a la revolución circular en salud
        </p>

        <form onSubmit={handleRegister} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          {/* Role selector */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>¿Cómo te describes?</label>
            <div className={styles.roleSelector}>
              {roles.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  className={`${styles.roleOption} ${
                    role === r.value ? styles.roleActive : ""
                  }`}
                  onClick={() => setRole(r.value)}
                >
                  <span className={styles.roleIcon}>{r.icon}</span>
                  <span className={styles.roleName}>{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Nombre completo</label>
            <div className={styles.inputWrapper}>
              <User size={18} />
              <input
                type="text"
                placeholder="Tu nombre"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>
          </div>

          {/* Email */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Correo electrónico</label>
            <div className={styles.inputWrapper}>
              <Mail size={18} />
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className={styles.rowGroup}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Contraseña</label>
              <div className={styles.inputWrapper}>
                <Lock size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  minLength={6}
                />
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Confirmar</label>
              <div className={styles.inputWrapper}>
                <Lock size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Repetir"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  minLength={6}
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? (
              <div className={styles.spinner} />
            ) : (
              <>
                Crear cuenta
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className={styles.footer}>
          ¿Ya tienes cuenta?{" "}
          <Link href="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
