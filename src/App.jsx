import "./App.css";
import ConfirmProvider from "./components/common/Mensaje/ConfirmModal";
import ToastProvider from "./context/MensajeContext";
import { AppRouter } from "./router/AppRouter";

function App() {
	return (
		<ToastProvider>
			<ConfirmProvider>
				<AppRouter />;
			</ConfirmProvider>
		</ToastProvider>
	);
}
export default App;
