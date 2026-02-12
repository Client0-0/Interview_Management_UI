export default function Input({ value, onChange, placeholder }: any) {
  return (
    <input
      className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}
