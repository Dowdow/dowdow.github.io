export default function Loading() {
  return (
    <div className="flex justify-center items-center p-12">
      <div className="inline-block w-10 h-10 after:content-[' '] after:block after:w-8 after:h-8 after:m-1 after:rounded-[50%] after:border-2 after:border-x-prim after:border-y-transparent after:animate-spin" />
    </div>
  );
}
