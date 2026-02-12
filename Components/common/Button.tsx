export default function Button({ children, onClick, variant = "primary", className = "" }: any) {
  const base =
    "px-4 py-2 rounded-lg text-sm font-medium transition border";

  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 border-blue-600",
    ghost: "bg-transparent hover:bg-gray-100 border-gray-300",
    destructive: "bg-red-600 text-white hover:bg-red-700 border-red-600",
  };

  return (
    <button onClick={onClick} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
}
