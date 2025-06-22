'use client';

export default function Error({ error }) {
  return (
    <div className="text-red-600">
      <h2>Something went wrong!</h2>
      <pre>{error.message}</pre>
    </div>
  );
}