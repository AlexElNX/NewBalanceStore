import LoadingOverlay from "./LoadingOverlay.jsx";
import { useGlobalLoading } from "./loadingStore.js";

function GlobalLoading() {
    const loading = useGlobalLoading();
    return <LoadingOverlay visible={loading} />;
}

export default GlobalLoading;
