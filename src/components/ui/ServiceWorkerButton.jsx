import useNetwork from "../../hooks/network";
import useServiceWorker from "../../hooks/serviceWorker";

export default function ServiceWorkerButton() {
  const isOnline = useNetwork();
  const [supported, state, error, register, unregister] = useServiceWorker();

  const onClick = () => {
    if (state === null || state === "redundant") {
      register();
    } else {
      unregister();
    }
  };

  if (supported === false) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      data-error={error ? "true" : "false"}
      disabled={!isOnline}
      className="flex items-center gap-2 px-3.5 md:px-2 rounded-md
      font-mono text-sm text-prim/70
      bg-transparent data-[error=true]:bg-red-600/10 hover:bg-prim/15 disabled:hover:bg-transparent
      disabled:cursor-not-allowed"
    >
      <div
        data-state={state ?? "redundant"}
        className="w-3 h-3 rounded-full
       data-[state=redundant]:bg-gray-500
       data-[state=installing]:bg-orange-500 data-[state=installing]:animate-pulse
       data-[state=installed]:bg-orange-500
       data-[state=activating]:bg-green-500 data-[state=activating]:animate-pulse
       data-[state=activated]:bg-green-500"
      />
      <div className="hidden md:block">
        {state === null || state === "redundant" ? "register" : state}
      </div>
    </button>
  );
}
