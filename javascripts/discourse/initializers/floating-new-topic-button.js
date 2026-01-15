import { withPluginApi } from "discourse/lib/plugin-api";
import { iconHTML } from "discourse-common/lib/icon-library";

export default {
	name: "floating-new-topic-button",

	initialize() {
		withPluginApi("1.0.0", (api) => {
			const currentUser = api.getCurrentUser();
			
			// Only show for logged-in users
			if (!currentUser) return;

			api.onPageChange(() => {
				// Remove existing button if any
				const existingBtn = document.querySelector(".floating-new-topic-btn");
				if (existingBtn) return; // Already exists

				// Create the button
				const btn = document.createElement("button");
				btn.className = "floating-new-topic-btn";
				btn.title = "New Topic";
				btn.innerHTML = iconHTML("plus");

				btn.addEventListener("click", () => {
					const composer = api.container.lookup("service:composer");
					composer.openNewTopic();
				});

				document.body.appendChild(btn);
			});
		});
	},
};
