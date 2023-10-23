import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";

export default function FormularioInicio() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signin, errors: signinErrors, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const onSubmit = handleSubmit((data) => {
    signin(data);
  });

  useEffect(() => {
    if (isAuthenticated) navigate("/tasks");
  }, [isAuthenticated]);

  return (
    <>
      <section className="bg-black h-screen sectionFondoForm">
        <div className="flex h-[calc(100vh-100px)] items-center justify-center">
          <div className="bg-zinc-900 max-w-md w-full p-12 rounded-md">
            {signinErrors.map((error, i) => (
              <div
                className="bg-red-500 p-2 text-white text-center my-2"
                key={i}
              >
                {error}
              </div>
            ))}
            <i class="bi bi-person-check text-center text-sky-500 text-6xl flex justify-center p-3"></i>
            <form onSubmit={onSubmit}>
              <input
                type="email"
                {...register("email", { required: true })}
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                placeholder="Email"
              />
              {errors.email && (
                <p className="text-red-500"> Email es requerido </p>
              )}

              <input
                type="password"
                {...register("password", { required: true })}
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                placeholder="Password"
              />
              {errors.password && (
                <p className="text-red-500"> Password es requerido </p>
              )}
              <div className="text-center p-2">
                <p className="">¿No tienes una cuenta?</p>
                <Link to="/registro" className="text-sky-500">
                  Registrarse
                </Link>
              </div>
              <div className="flex justify-around p-2">
                <p>
                  <Link to="/" className="text-sky-500">
                    <i class="bi bi-arrow-return-left text-1xl"></i>Regresar
                  </Link>
                </p>
                <button type="submit" className="text-sky-500">
                  <i class="bi bi-house text-1xl"></i> Iniciar Sesión
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
