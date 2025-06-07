import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import Contexts from "./global/index";
import "./app.css";

export default function App() {
	return (
		<Router
			root={(props) => (
				<>
					<Suspense>
						<Contexts>{props.children}</Contexts>
					</Suspense>
				</>
			)}
		>
			<FileRoutes />
		</Router>
	);
}
